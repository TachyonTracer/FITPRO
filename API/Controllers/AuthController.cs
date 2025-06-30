using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Repo;
using System.Text.Json;
using Nest;
using System.Net.Http;
using Microsoft.Extensions.Configuration;
using System.Text.Json.Serialization;

namespace API
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthApiController : ControllerBase
    {
        private readonly IConfiguration _myConfig;
        private readonly RabbitMQService _rabbitMQService;
        private readonly IAuthInterface _authRepo;
        private readonly HttpClient _httpClient;

        public AuthApiController(IConfiguration myConfig, IAuthInterface authRepo, RabbitMQService rabbitMQService)
        {
            _myConfig = myConfig;
            _rabbitMQService = rabbitMQService;
            _authRepo = authRepo;
            _httpClient = new HttpClient();
        }

        // DRY: Centralized API response handler
        private IActionResult ApiResponse(bool success, string message, object data = null, int statusCode = 200)
        {
            var result = new { success, message, data };
            return statusCode switch
            {
                200 => Ok(result),
                400 => BadRequest(result),
                401 => Unauthorized(result),
                404 => NotFound(result),
                _ => StatusCode(statusCode, result)
            };
        }

        #region Login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginVM request)
        {
            try
            {
                if (!await ValidateRecaptchaToken(request.recaptchaToken))
                    return ApiResponse(false, "reCAPTCHA validation failed. Please try again.", statusCode: 400);

                if (request == null ||
                    string.IsNullOrEmpty(request.email) ||
                    string.IsNullOrEmpty(request.password) ||
                    string.IsNullOrEmpty(request.role))
                {
                    return ApiResponse(false, "Invalid login credentials.", statusCode: 400);
                }

                object user = null;
                string role = null;

                if (request.email == "admin@gmail.com")
                {
                    user = await _authRepo.LoginAdmin(request);
                    role = "admin";
                    if (user == null)
                        return ApiResponse(false, "Invalid admin credentials.", statusCode: 401);
                }
                else if (request.role.Equals("user", StringComparison.OrdinalIgnoreCase))
                {
                    user = await _authRepo.LoginUser(request);
                    role = "user";
                    if (user == null)
                        return ApiResponse(false, "Invalid email or password.", statusCode: 401);
                    if (!(user as dynamic).status)
                        return ApiResponse(false, "Please check your mail for account activation.", statusCode: 401);
                }
                else if (request.role.Equals("instructor", StringComparison.OrdinalIgnoreCase))
                {
                    user = await _authRepo.LoginInstructor(request);
                    role = "instructor";
                    if (user == null)
                        return ApiResponse(false, "Invalid email or password.", statusCode: 401);

                    var status = (user as dynamic).status as string;
                    if (status == "Unverified")
                        return ApiResponse(false, "Please check your mail for account activation", statusCode: 401);
                    if (status == "Verified")
                        return ApiResponse(false, "Wait for admin approval.", statusCode: 401);
                    if (status == "Disapproved")
                        return ApiResponse(false, "Your account has been rejected.", statusCode: 401);
                    if (status == "Suspended")
                        return ApiResponse(false, "Your account has been suspended.", statusCode: 401);
                }
                else
                {
                    return ApiResponse(false, "Invalid role specified.", statusCode: 400);
                }

                // JWT Token creation
                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, _myConfig["Jwt:Subject"]),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim("UserObject", System.Text.Json.JsonSerializer.Serialize(user))
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_myConfig["Jwt:Key"]));
                var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var authToken = new JwtSecurityToken(
                    _myConfig["Jwt:Issuer"],
                    _myConfig["Jwt:Audience"],
                    claims,
                    expires: DateTime.UtcNow.AddDays(1),
                    signingCredentials: signIn
                );

                return ApiResponse(true, "Login Successful", new
                {
                    authToken = new JwtSecurityTokenHandler().WriteToken(authToken),
                    userRole = role
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Login Failed: " + ex);
                return ApiResponse(false, "Internal server error.", statusCode: 500);
            }
        }
        #endregion

        private async Task<bool> ValidateRecaptchaToken(string token)
        {
            if (string.IsNullOrEmpty(token))
                return false;

            var recaptchaSecret = _myConfig["RecaptchaSettings:SecretKey"];
            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("secret", recaptchaSecret),
                new KeyValuePair<string, string>("response", token)
            });

            var response = await _httpClient.PostAsync(
                "https://www.google.com/recaptcha/api/siteverify",
                content);

            if (!response.IsSuccessStatusCode)
                return false;

            var responseContent = await response.Content.ReadAsStringAsync();
            var recaptchaResponse = JsonSerializer.Deserialize<RecaptchaV2Response>(responseContent);

            return recaptchaResponse.success;
        }

        #region DispatchOTP
        [HttpPost("Dispatch-otp")]
        public async Task<IActionResult> DispatchOtp([FromBody] VerifyEmail request)
        {
            int result = await _authRepo.dispatchOtp(request.email);
            return result == 1
                ? ApiResponse(true, "OTP sent successfully.")
                : ApiResponse(false, "Email not registered.");
        }
        #endregion

        #region Verify OTP
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyEmail request)
        {
            int result = await _authRepo.verifyOtp(request.email, Convert.ToInt32(request.OTP));
            return result switch
            {
                1 => ApiResponse(true, "OTP verified successfully."),
                0 => ApiResponse(false, "Email not registered."),
                -1 => ApiResponse(false, "No OTP found for this user."),
                -2 => ApiResponse(false, "Incorrect OTP."),
                -3 => ApiResponse(false, "OTP expired."),
                _ => ApiResponse(false, "An unexpected error occurred.")
            };
        }
        #endregion

        #region Update Password
        [HttpPost("update-password")]
        public async Task<IActionResult> UpdatePassword([FromBody] VerifyEmail request)
        {
            int result = await _authRepo.updatePassword(request.email, request.newPassword, Convert.ToInt32(request.OTP));
            return result switch
            {
                1 => ApiResponse(true, "Password updated successfully."),
                -1 => ApiResponse(false, "Email not registered."),
                -2 => ApiResponse(false, "No OTP found."),
                -3 => ApiResponse(false, "Incorrect OTP."),
                -4 => ApiResponse(false, "OTP expired."),
                _ => ApiResponse(false, "An unexpected error occurred.")
            };
        }
        #endregion

        #region Register User
        [HttpPost("register-user")]
        public async Task<IActionResult> RegisterUser([FromForm] User user)
        {
            if (!ModelState.IsValid)
                return ApiResponse(false, "Invalid user data.", ModelState, 400);

            if (await _authRepo.IsEmailExists(user.email))
                return ApiResponse(false, "Email already registered");

            // Handle profile image upload
            if (user.profileImageFile != null && user.profileImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(user.profileImageFile.FileName);
                var filePath = Path.Combine("../MVC/wwwroot/User_Images", fileName);
                Directory.CreateDirectory(Path.Combine("../MVC/wwwroot/User_Images"));
                user.profileImage = fileName;
                using var stream = new FileStream(filePath, FileMode.Create);
                await user.profileImageFile.CopyToAsync(stream);
            }

            bool result = await _authRepo.RegisterUserAsync(user);
            return result
                ? ApiResponse(true, "User registered successfully \n Please check your email for the activation link.")
                : ApiResponse(false, "Error in registration");
        }
        #endregion

        #region Register Instructor
        [HttpPost("register-instructor")]
        public async Task<IActionResult> RegisterInstructor([FromForm] Instructor instructor)
        {
            try
            {
                instructor.certificates ??= JsonDocument.Parse("{}");

                if (!ModelState.IsValid)
                    return ApiResponse(false, "Invalid instructor data.", ModelState, 400);

                if (await _authRepo.IsEmailExists(instructor.email))
                    return ApiResponse(false, "Email already registered");

                // Profile image
                if (instructor.profileImageFile != null && instructor.profileImageFile.Length > 0)
                {
                    var fileName = Guid.NewGuid() + "_profile" + Path.GetExtension(instructor.profileImageFile.FileName);
                    var filePath = Path.Combine("../MVC/wwwroot/Instructor_Images", fileName);
                    Directory.CreateDirectory(Path.Combine("../MVC/wwwroot/Instructor_Images"));
                    instructor.profileImage = fileName;
                    using var stream = new FileStream(filePath, FileMode.Create);
                    await instructor.profileImageFile.CopyToAsync(stream);
                }

                // ID proof
                if (instructor.idProofFile != null && instructor.idProofFile.Length > 0)
                {
                    var fileName = Guid.NewGuid() + "_idproof" + Path.GetExtension(instructor.idProofFile.FileName);
                    var filePath = Path.Combine("../MVC/wwwroot/Id_Proof", fileName);
                    Directory.CreateDirectory(Path.Combine("../MVC/wwwroot/Id_Proof"));
                    instructor.idProof = fileName;
                    using var stream = new FileStream(filePath, FileMode.Create);
                    await instructor.idProofFile.CopyToAsync(stream);
                }

                // Certificates
                if (instructor.certificateFiles != null && instructor.certificateFiles.Length > 0)
                {
                    var certificateDict = new Dictionary<string, string>();
                    var specializations = instructor.specialization.Split(',').Select(s => s.Trim()).ToList();
                    foreach (var spec in specializations)
                    {
                        foreach (var file in instructor.certificateFiles)
                        {
                            if (file != null && file.Length > 0)
                            {
                                var fileName = $"{Guid.NewGuid()}_{spec}{Path.GetExtension(file.FileName)}";
                                var filePath = Path.Combine("../MVC/wwwroot/Certificates", fileName);
                                Directory.CreateDirectory(Path.Combine("../MVC/wwwroot/Certificates"));
                                using var stream = new FileStream(filePath, FileMode.Create);
                                await file.CopyToAsync(stream);
                                certificateDict[spec] = fileName;
                            }
                        }
                    }
                    var jsonString = JsonSerializer.Serialize(certificateDict);
                    instructor.certificates = JsonDocument.Parse(jsonString);
                }
                else
                {
                    instructor.certificates = JsonDocument.Parse("{}");
                }

                bool result = await _authRepo.RegisterInstructorAsync(instructor);
                return result
                    ? ApiResponse(true, "Instructor registered successfully \n Please check your email for the activation link.")
                    : ApiResponse(false, "Error in registration");
            }
            catch (Exception ex)
            {
                return ApiResponse(false, $"An error occurred: {ex.Message}", statusCode: 500);
            }
        }
        #endregion

        #region Check Email
        [HttpGet("check-email")]
        public async Task<IActionResult> CheckEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
                return ApiResponse(false, "Email is required", statusCode: 400);

            bool exists = await _authRepo.IsEmailExists(email);
            return ApiResponse(true, "Email check complete", new { exists });
        }
        #endregion

        #region Activate User
        [HttpGet("activateuser")]
        public async Task<IActionResult> ActivateUser([FromQuery] string token)
        {
            int result = await _authRepo.ActivateUser(token);
            string redirectUrl = result switch
            {
                1 => "http://localhost:8081/auth/login?message=Activation%20Successful",
                -2 => "http://localhost:8081/auth/login?message=Invalid%20Activation%20Token",
                -3 => "http://localhost:8081/auth/login?message=Already%20Activated",
                _ => "http://localhost:8081/auth/login?message=Failed%20To%20Activate"
            };
            return Redirect(redirectUrl);
        }
        #endregion

        #region Activate Instructor
        [HttpGet("activateinstructor")]
        public async Task<IActionResult> ActivateInstructor([FromQuery] string token)
        {
            var result = await _authRepo.ActivateInstructor(token);
            int statusCode = result.Keys.First();
            string instructorName = result.ContainsKey(1) ? result[1] : string.Empty;

            if (statusCode == 1)
            {
                _rabbitMQService.PublishNotification("12", "admin",
                    $"New Instructor Registered::{instructorName} needs Approval to be an Instructor::{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}");
                return Redirect("http://localhost:8081/auth/login?message=Activation%20Successful");
            }

            var messages = new Dictionary<int, string>
            {
                {-1, "No%20token%20provided"},
                {-2, "Invalid%20Activation%20Token"},
                {-3, "Already%20Activated"},
                {-4, "Invalid%20Status"},
                {-5, "Instructor%20Already%20Verified"},
                {-6, "Internal%20Error%20Try%20Again%20Later"}
            };

            string msg = messages.ContainsKey(statusCode) ? messages[statusCode] : "Unknown%20Error";
            return Redirect($"http://localhost:8081/auth/login?message={msg}");
        }
        #endregion
    }
}

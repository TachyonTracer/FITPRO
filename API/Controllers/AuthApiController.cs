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

namespace API
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthApiController : ControllerBase
    {
        private readonly IConfiguration _myConfig;
        private readonly IAuthInterface _authRepo;

        public AuthApiController(IConfiguration myConfig, IAuthInterface authRepo)
        {
            _myConfig = myConfig;
            _authRepo = authRepo;
        }
        #region  Login 


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginVM userCredentials)
        {
            try
            {
                if (userCredentials == null ||
                    string.IsNullOrEmpty(userCredentials.email) ||
                    string.IsNullOrEmpty(userCredentials.password) ||
                    string.IsNullOrEmpty(userCredentials.role))
                {
                    return BadRequest(new { success = false, message = "Invalid login credentials." });
                }

                object user;

                if (userCredentials.role.ToLower() == "user")
                {
                    var userObj = await _authRepo.LoginUser(userCredentials);
                    if (userObj == null)
                    {
                        return Unauthorized(new { success = false, message = "Invalid email or password." });
                    }
                    if (!userObj.status)
                    {
                        return Unauthorized(new { success = false, message = "Please check your mail for account activation." });
                    }
                    user = userObj;
                }
                else if (userCredentials.role.ToLower() == "instructor")
                {
                    var instructorObj = await _authRepo.LoginInstructor(userCredentials);
                    if (instructorObj == null)
                    {
                        return Unauthorized(new { success = false, message = "Invalid email or password." });
                    }

                    if (instructorObj.status == "Unverified")
                    {
                        return Unauthorized(new { success = false, message = "Please check your mail for account activation" });
                    }

                    if (instructorObj.status == "Verified")
                    {
                        return Unauthorized(new { success = false, message = "Wait for admin approval." });
                    }

                    if (instructorObj.status == "Disapproved")
                    {
                        return Unauthorized(new { success = false, message = "Your account has been rejected." });
                    }

                    user = instructorObj;
                }
                else if (userCredentials.role.ToLower() == "user")
                {
                    var adminObj = await _authRepo.LoginAdmin(userCredentials); // Fetch admin from DB
                    if (adminObj == null)
                    {
                        return Unauthorized(new { success = false, message = "Invalid admin credentials." });
                    }
                    else
                    {
                        user = adminObj;
                    }
                }
                else
                {
                    return BadRequest(new { success = false, message = "Invalid role specified." });
                }

                // If we reach here, user is authenticated
                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, _myConfig["Jwt:Subject"]),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim("UserObject", System.Text.Json.JsonSerializer.Serialize(user))
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_myConfig["Jwt:Key"]));
                var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(
                    _myConfig["Jwt:Issuer"],
                    _myConfig["Jwt:Audience"],
                    claims,
                    expires: DateTime.UtcNow.AddDays(1),
                    signingCredentials: signIn
                );
                return Ok(new { success = true, message = "Login Successful", token = new JwtSecurityTokenHandler().WriteToken(token) });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Login Failed: " + ex);
                return StatusCode(500, new { success = false, message = "Internal server error." });
            }

        }

        #endregion




        #region DispatchOTP
        [HttpPost("Dispatch-otp")]
        public async Task<IActionResult> DispatchOtp([FromBody] VerifyEmail request)
        {
            int result = await _authRepo.dispatchOtp(request.email);

            if (result == 1)
            {
                return Ok(new { success = true, message = "OTP sent successfully." });
            }
            else
            {
                return Ok(new { success = false, message = "Email not registered." });
            }
        }
        #endregion

        #region Verify OTP
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyEmail request)
        {
            int result = await _authRepo.verifyOtp(request.email, Convert.ToInt32(request.OTP));

            if (result == 1)
            {
                return Ok(new { success = true, message = "OTP verified successfully." });
            }
            else if (result == 0)
            {
                return Ok(new { success = false, message = "Email not registered." });
            }
            else if (result == -1)
            {
                return Ok(new { success = false, message = "No OTP found for this user." });
            }
            else if (result == -2)
            {
                return Ok(new { success = false, message = "Incorrect OTP." });
            }
            else if (result == -3)
            {
                return Ok(new { success = false, message = "OTP expired." });
            }
            else
            {
                return Ok(new { success = false, message = "An unexpected error occurred." });
            }
        }
        #endregion


        #region Update Password

        [HttpPost("update-password")]
        public async Task<IActionResult> UpdatePassword([FromBody] VerifyEmail request)
        {
            int result = await _authRepo.updatePassword(request.email, request.newPassword, Convert.ToInt32(request.OTP));

            if (result == 1)
            {
                return Ok(new { success = true, message = "Password updated successfully." });
            }
            else if (result == -1)
            {
                return Ok(new { success = false, message = "Email not registered." });
            }
            else if (result == -2)
            {
                return Ok(new { success = false, message = "No OTP found." });
            }
            else if (result == -3)
            {
                return Ok(new { success = false, message = "Incorrect OTP." });
            }
            else if (result == -4)
            {
                return Ok(new { success = false, message = "OTP expired." });
            }
            else
            {
                return Ok(new { success = false, message = "An unexpected error occurred." });
            }
        }
        #endregion




        #region Register User
        [HttpPost("register-user")]
        public async Task<IActionResult> RegisterUser([FromForm] User user)
        {
            if (ModelState.IsValid)
            {
                // Check if email already exists
                if (await _authRepo.IsEmailExists(user.email))
                {
                    return new JsonResult(new { success = false, message = "Email already registered" });
                }

                // Handle profile image upload
                if (user.profileImageFile != null && user.profileImageFile.Length > 0)
                {
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(user.profileImageFile.FileName);
                    var filePath = Path.Combine("../MVC/wwwroot/User_Images", fileName);

                    // Create directory if it doesn't exist
                    Directory.CreateDirectory(Path.Combine("../MVC/wwwroot/User_Images"));

                    user.profileImage = fileName;

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await user.profileImageFile.CopyToAsync(stream);
                    }
                }

                // Register the user
                bool result = await _authRepo.RegisterUserAsync(user);

                if (result)
                {
                    return new JsonResult(new { success = true, message = "User registered successfully \n Please check your email for the activation link." });
                }
                else
                {
                    return new JsonResult(new { success = false, message = "Error in registration" });
                }
            }

            return BadRequest(ModelState);
        }

        #endregion

        #region Register Instructor
        [HttpPost("register-instructor")]
        public async Task<IActionResult> RegisterInstructor([FromForm] Instructor instructor)
        {
            try
            {
                // Initialize certificates with empty JSON document to prevent validation errors
                if (instructor.certificates == null)
                {
                    instructor.certificates = JsonDocument.Parse("{}");
                }

                if (ModelState.IsValid)
                {
                    // Check if email already exists
                    if (await _authRepo.IsEmailExists(instructor.email))
                    {
                        return new JsonResult(new { success = false, message = "Email already registered" });
                    }

                    // Handle profile image upload
                    if (instructor.profileImageFile != null && instructor.profileImageFile.Length > 0)
                    {
                        var fileName = Guid.NewGuid().ToString() + "_profile" + Path.GetExtension(instructor.profileImageFile.FileName);
                        var filePath = Path.Combine("../MVC/wwwroot/Instructor_Images", fileName);

                        // Create directory if it doesn't exist
                        Directory.CreateDirectory(Path.Combine("../MVC/wwwroot/Instructor_Images"));

                        instructor.profileImage = fileName;

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await instructor.profileImageFile.CopyToAsync(stream);
                        }
                    }

                    // Handle ID proof upload
                    if (instructor.idProofFile != null && instructor.idProofFile.Length > 0)
                    {
                        var fileName = Guid.NewGuid().ToString() + "_idproof" + Path.GetExtension(instructor.idProofFile.FileName);
                        var filePath = Path.Combine("../MVC/wwwroot/Id_Proof", fileName);

                        // Create directory if it doesn't exist
                        Directory.CreateDirectory(Path.Combine("../MVC/wwwroot/Id_Proof"));

                        instructor.idProof = fileName;

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await instructor.idProofFile.CopyToAsync(stream);
                        }
                    }

                    // Handle certificate files
                    if (instructor.certificateFiles != null && instructor.certificateFiles.Length > 0)
                    {
                        try
                        {
                            var certificateDict = new Dictionary<string, string>();
                            // Split specializations by comma
                            var specializations = instructor.specialization.Split(',')
                                .Select(s => s.Trim())
                                .ToList();
                            // Process each specialization separately
                            foreach (var spec in specializations)
                            {
                                for (int i = 0; i < instructor.certificateFiles.Length; i++)
                                {
                                    var file = instructor.certificateFiles[i];
                                    if (file != null && file.Length > 0)
                                    {
                                        // Create unique filename for each specialization
                                        var fileName = $"{Guid.NewGuid()}_{spec}{Path.GetExtension(file.FileName)}";
                                        var filePath = Path.Combine("../MVC/wwwroot/Certificates", fileName);

                                        // Create directory if it doesn't exist
                                        Directory.CreateDirectory(Path.Combine("../MVC/wwwroot/Certificates"));

                                        // Save the file
                                        using (var stream = new FileStream(filePath, FileMode.Create))
                                        {
                                            await file.CopyToAsync(stream);
                                        }

                                        // Store each specialization as a separate key
                                        certificateDict[spec] = fileName;
                                    }
                                }
                            }

                            // Convert dictionary to JSON document
                            var jsonString = JsonSerializer.Serialize(certificateDict);
                            instructor.certificates = JsonDocument.Parse(jsonString);
                        }
                        catch (Exception ex)
                        {
                            return new JsonResult(new { success = false, message = $"Error processing certificate files: {ex.Message}" });
                        }
                    }
                    else
                    {
                        instructor.certificates = JsonDocument.Parse("{}");
                    }

                    // Register the instructor
                    bool result = await _authRepo.RegisterInstructorAsync(instructor);

                    if (result)
                    {
                        return new JsonResult(new { success = true, message = "Instructor registered successfully \n Please check your email for the activation link." });
                    }
                    else
                    {
                        return new JsonResult(new { success = false, message = "Error in registration" });
                    }
                }

                return BadRequest(ModelState);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        #endregion

        #region Check Email
        [HttpGet("check-email")]
        public async Task<IActionResult> CheckEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new { success = false, message = "Email is required" });
            }

            bool exists = await _authRepo.IsEmailExists(email);
            return new JsonResult(new { exists });
        }
        #endregion


        #region Activate User
        [HttpGet("activateuser")]
        public async Task<IActionResult> ActivateUser([FromQuery] string token)
        {
            int result = await _authRepo.ActivateUser(token);

            string redirectUrl;

            if (result == 1)
            {
                // Activation successful
                redirectUrl = "http://localhost:8081/auth/login?message=Activation%20Successful";
            }
            else if (result == -2)
            {
                redirectUrl = "http://localhost:8081/auth/login?message=Invalid%20Activation%20Token";

            }
            else if (result == -3)
            {
                // User already activated
                redirectUrl = "http://localhost:8081/auth/login?message=Already%20Activated";
            }
            else
            {
                // Invalid token or other failure
                redirectUrl = "http://localhost:8081/auth/login?message=Failed%20To%20Activate";
            }

            return Redirect(redirectUrl);
        }
        #endregion

        #region Activate Instructor
        [HttpGet("activateinstructor")]
        public async Task<IActionResult> ActivateInstructor([FromQuery] string token)
        {
            int result = await _authRepo.ActivateInstructor(token);

            if (result == 1)
            {
                return Redirect("http://localhost:8081/auth/login?message=Activation%20Successful");
            }
            else if (result == -2)
            {
                return Redirect("http://localhost:8081/auth/login?message=Invalid%20Activation%20Token");
            }
            else if (result == -3)
            {
                return Redirect("http://localhost:8081/auth/login?message=Already%20Activated");
            }
            else if (result == -4)
            {
                return Redirect("http://localhost:8081/auth/login?message=Invalid%20Status");
            }
            else if (result == -5)
            {
                return Redirect("http://localhost:8081/auth/login?message=Instructor%20Already%20Verified");
            }
            else if (result == -6)
            {
                return Redirect("http://localhost:8081/auth/login?message=Internal%20Error%20Try%20Again%20Later");
            }
            else
            {
                return Redirect("http://localhost:8081/auth/login?message=Unknown%20Error");
            }
        }
        #endregion

    }
}

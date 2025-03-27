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

namespace API
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthApiController : ControllerBase
    {
        private readonly IConfiguration _myConfig;
        private readonly IAuthInterface _auth;

        public AuthApiController(IConfiguration myConfig, IAuthInterface auth)
        {
            _myConfig = myConfig;
            _auth = auth;
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
                    var userObj = await _auth.LoginUser(userCredentials);
                    if (userObj == null)
                    {
                        return Unauthorized(new { success = false, message = "Invalid email or password." });
                    }
                    if (!userObj.status)
                    {
                        return Unauthorized(new { success = false, message = "Please activate your account." });
                    }
                    user = userObj;
                }
                else if (userCredentials.role.ToLower() == "instructor")
                {
                    var instructorObj = await _auth.LoginInstructor(userCredentials);
                    if (instructorObj == null)
                    {
                        return Unauthorized(new { success = false, message = "Invalid email or password." });
                    }

                    if (instructorObj.status == "Pending" || instructorObj.status == "Inactive")
                    {
                        return Unauthorized(new { success = false, message = "Wait for admin approval." });
                    }

                    user = instructorObj;
                }
                else if (userCredentials.role.ToLower() == "admin")
                {
                    var adminObj = await _auth.LoginAdmin(userCredentials); // Fetch admin from DB
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
                Console.WriteLine($"[ERROR] Login Failed: "+ ex);
                return StatusCode(500, new { success = false, message = "Internal server error." });
            }

        }

        #endregion



        [HttpPost("register-user")]
        public async Task<IActionResult> RegisterUser([FromForm] User user)
        {
            if (ModelState.IsValid)
            {
                // Check if email already exists
                if (await _auth.IsEmailExists(user.email))
                {
                    return new JsonResult(new { success = false, message = "Email already registered" });
                }

                // Handle profile image upload
                if (user.profileImageFile != null && user.profileImageFile.Length > 0)
                {
                    var fileName = user.email + Path.GetExtension(user.profileImageFile.FileName);
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
                bool result = await _auth.RegisterUserAsync(user);

                if (result)
                {
                    return new JsonResult(new { success = true, message = "User registered successfully" });
                }
                else
                {
                    return new JsonResult(new { success = false, message = "Error in registration" });
                }
            }

            return BadRequest(ModelState);
        }

        // [HttpPost("register-instructor")]
        // public async Task<IActionResult> RegisterInstructor([FromForm] Instructor instructor, IFormFile idProofFile, IFormFile certificateFile)
        // {
        //     if (ModelState.IsValid)
        //     {
        //         // Check if email already exists
        //         if (await _auth.IsEmailExists(instructor.email))
        //         {
        //             return new JsonResult(new { success = false, message = "Email already registered" });
        //         }

        //         // Handle profile image upload
        //         if (instructor.profileImageFile != null && instructor.profileImageFile.Length > 0)
        //         {
        //             var fileName = instructor.email + "_profile" + Path.GetExtension(instructor.profileImageFile.FileName);
        //             var filePath = Path.Combine("../MVC/wwwroot/Instructor_Images", fileName);

        //             // Create directory if it doesn't exist
        //             Directory.CreateDirectory(Path.Combine("../MVC/wwwroot/Instructor_Images"));

        //             instructor.profileImage = fileName;

        //             using (var stream = new FileStream(filePath, FileMode.Create))
        //             {
        //                 await instructor.profileImageFile.CopyToAsync(stream);
        //             }
        //         }

        //         // Handle ID proof upload
        //         if (idProofFile != null && idProofFile.Length > 0)
        //         {
        //             var fileName = instructor.email + "_idproof" + Path.GetExtension(idProofFile.FileName);
        //             var filePath = Path.Combine("../MVC/wwwroot/Id_Proof", fileName);

        //             // Create directory if it doesn't exist
        //             Directory.CreateDirectory(Path.Combine("../MVC/wwwroot/Id_Proof"));

        //             instructor.idProof = fileName;

        //             using (var stream = new FileStream(filePath, FileMode.Create))
        //             {
        //                 await idProofFile.CopyToAsync(stream);
        //             }
        //         }

        //         // Handle certificate JSON document
        //         if (certificateFile != null && certificateFile.Length > 0)
        //         {
        //             try
        //             {
        //                 // Save the certificate file
        //                 var fileName = instructor.email + "_certificates.json";
        //                 var filePath = Path.Combine("../MVC/wwwroot/Certificates", fileName);

        //                 // Create directory if it doesn't exist
        //                 Directory.CreateDirectory(Path.Combine("../MVC/wwwroot/Certificates"));

        //                 // Save the file
        //                 using (var stream = new FileStream(filePath, FileMode.Create))
        //                 {
        //                     await certificateFile.CopyToAsync(stream);
        //                 }

        //                 // Read the JSON content
        //                 using (var reader = new StreamReader(certificateFile.OpenReadStream()))
        //                 {
        //                     var jsonContent = await reader.ReadToEndAsync();

        //                     // Validate JSON format
        //                     try
        //                     {
        //                         var certificatesObj = JsonSerializer.Deserialize<object>(jsonContent);
        //                         instructor.certificates = JsonDocument.Parse(jsonContent);
        //                     }
        //                     catch (JsonException)
        //                     {
        //                         return new JsonResult(new { success = false, message = "Invalid certificate JSON format" });
        //                     }
        //                 }
        //             }
        //             catch (Exception ex)
        //             {
        //                 return new JsonResult(new { success = false, message = $"Error processing certificate file: {ex.Message}" });
        //             }
        //         }

        //         // Register the instructor
        //         bool result = await _auth.RegisterInstructorAsync(instructor);

        //         if (result)
        //         {
        //             return new JsonResult(new { success = true, message = "Instructor registered successfully" });
        //         }
        //         else
        //         {
        //             return new JsonResult(new { success = false, message = "Error in registration" });
        //         }
        //     }

        //     return BadRequest(ModelState);
        // }

        [HttpGet("check-email")]
        public async Task<IActionResult> CheckEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new { success = false, message = "Email is required" });
            }

            bool exists = await _auth.IsEmailExists(email);
            return new JsonResult(new { exists });
        }
    }
}

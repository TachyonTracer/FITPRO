using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Repo;
using System.Text.Json;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthApiController : ControllerBase
    {
        private readonly IAuthInterface _authInterface;

        public AuthApiController(IAuthInterface authInterface)
        {
            _authInterface = authInterface;
        }

        [HttpPost("register-user")]
        public async Task<IActionResult> RegisterUser([FromForm] User user)
        {
            if (ModelState.IsValid)
            {
                // Check if email already exists
                if (await _authInterface.IsEmailExists(user.email))
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
                bool result = await _authInterface.RegisterUserAsync(user);
                
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

        [HttpPost("register-instructor")]
        public async Task<IActionResult> RegisterInstructor([FromForm] Instructor instructor, IFormFile idProofFile, IFormFile certificateFile)
        {
            if (ModelState.IsValid)
            {
                // Check if email already exists
                if (await _authInterface.IsEmailExists(instructor.email))
                {
                    return new JsonResult(new { success = false, message = "Email already registered" });
                }

                // Handle profile image upload
                if (instructor.profileImageFile != null && instructor.profileImageFile.Length > 0)
                {
                    var fileName = instructor.email + "_profile" + Path.GetExtension(instructor.profileImageFile.FileName);
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
                if (idProofFile != null && idProofFile.Length > 0)
                {
                    var fileName = instructor.email + "_idproof" + Path.GetExtension(idProofFile.FileName);
                    var filePath = Path.Combine("../MVC/wwwroot/Id_Proof", fileName);
                    
                    // Create directory if it doesn't exist
                    Directory.CreateDirectory(Path.Combine("../MVC/wwwroot/Id_Proof"));
                    
                    instructor.idProof = fileName;
                    
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await idProofFile.CopyToAsync(stream);
                    }
                }

                // Handle certificate JSON document
                if (certificateFile != null && certificateFile.Length > 0)
                {
                    try
                    {
                        // Save the certificate file
                        var fileName = instructor.email + "_certificates.json";
                        var filePath = Path.Combine("../MVC/wwwroot/Certificates", fileName);
                        
                        // Create directory if it doesn't exist
                        Directory.CreateDirectory(Path.Combine("../MVC/wwwroot/Certificates"));
                        
                        // Save the file
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await certificateFile.CopyToAsync(stream);
                        }
                        
                        // Read the JSON content
                        using (var reader = new StreamReader(certificateFile.OpenReadStream()))
                        {
                            var jsonContent = await reader.ReadToEndAsync();
                            
                            // Validate JSON format
                            try
                            {
                                var certificatesObj = JsonSerializer.Deserialize<object>(jsonContent);
                                instructor.certificates = JsonDocument.Parse(jsonContent);
                            }
                            catch (JsonException)
                            {
                                return new JsonResult(new { success = false, message = "Invalid certificate JSON format" });
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        return new JsonResult(new { success = false, message = $"Error processing certificate file: {ex.Message}" });
                    }
                }

                // Register the instructor
                bool result = await _authInterface.RegisterInstructorAsync(instructor);
                
                if (result)
                {
                    return new JsonResult(new { success = true, message = "Instructor registered successfully" });
                }
                else
                {
                    return new JsonResult(new { success = false, message = "Error in registration" });
                }
            }
            
            return BadRequest(ModelState);
        }

        [HttpGet("check-email")]
        public async Task<IActionResult> CheckEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new { success = false, message = "Email is required" });
            }

            bool exists = await _authInterface.IsEmailExists(email);
            return new JsonResult(new { exists });
        }
    }
}
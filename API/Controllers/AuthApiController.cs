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

        #region Register User
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
                    if (instructor.idProofFile != null && instructor.idProofFile.Length > 0)
                    {
                        var fileName = instructor.email + "_idproof" + Path.GetExtension(instructor.idProofFile.FileName);
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
                                        var fileName = $"{instructor.email}_{spec}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
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

            bool exists = await _authInterface.IsEmailExists(email);
            return new JsonResult(new { exists });
        }
        #endregion
    }
}
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repo;

namespace API
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassController : ControllerBase
    {
        public readonly IClassInterface _classRepo;
        public ClassController(IClassInterface classRepo)
        {
            _classRepo = classRepo;
        }

        #region Class:Booking
        [HttpPost("BookClass")]
        public async Task<IActionResult> BookClass([FromBody] Booking request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid request data",
                    errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                });
            }

            var response = await _classRepo.BookClass(request);

            if (!response.success)
            {
                return BadRequest(new
                {
                    success = false,
                    message = response.message
                });
            }

            return Ok(new
            {
                success = true,
                message = response.message
            });
        }
        #endregion
        #region GetAll
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            List<Class> classes = await _classRepo.GetAllClasses();
            return Ok(new { sucess = true, message = "class fetch successfully", data = classes });
        }

        #endregion

        #region GetOne
        [HttpGet("GetOne")]
        public async Task<ActionResult> GetOne(string id)
        {
            var classes = await _classRepo.GetOne(id);
            if (classes == null)
            {
                return BadRequest(new { success = false, message = "There was no class found" });

            }
            return Ok(new { sucess = true, message = "class fetch successfully", data = classes });
        }
        #endregion

        #region  GetClassById
        [HttpGet("GetClassesByInstructorId")]
        public async Task<ActionResult> GetClassById(string id)
        {
            var classes = await _classRepo.GetClassById(id);
            if (classes == null)
            {
                return BadRequest(new { success = false, message = "There was no class found" });

            }
            return Ok(new { sucess = true, message = "class fetch successfully", data = classes });
        }
        #endregion

        #region SoftDeleteClass
        [HttpDelete("soft-delete/{classId}")]
        public async Task<IActionResult> SoftDeleteClass(int classId)
        {
            bool result = await _classRepo.SoftDeleteClass(classId);
            if (result)
            {
                return Ok(new { success = true, message = "Class soft deleted successfully" });
            }
            return BadRequest(new { success = false, message = "Class is already suspended" });
        }
        #endregion

        #region Schedule class

        [HttpPost("Scheduleclass")]
        public async Task<IActionResult> Scheduleclass([FromForm] Class classData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "Invalid input data", errors = ModelState });
            }

            try
            {

                if (classData.description != null && classData.description.RootElement.ValueKind == JsonValueKind.String)
                {
                    string descriptionJson = classData.description.RootElement.GetString();
                    classData.description = JsonDocument.Parse(descriptionJson);
                }


                string uploadPath = Path.Combine("../MVC/wwwroot", "ClassAssets");
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                Dictionary<string, string> fileMetadata = new Dictionary<string, string>(); // Store file names

                //  Handle file uploads
                if (classData.assetFiles != null && classData.assetFiles.Length > 0)
                {
                    for (int i = 0; i < classData.assetFiles.Length; i++)
                    {
                        var file = classData.assetFiles[i];
                        if (file != null && file.Length > 0)
                        {
                            string fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}"; // Unique filename
                            string filePath = Path.Combine(uploadPath, fileName);

                            using (var stream = new FileStream(filePath, FileMode.Create))
                            {
                                await file.CopyToAsync(stream);
                            }

                            string key = (i == 0) ? "banner" : $"picture {i}";
                            fileMetadata[key] = fileName; // Store only the file name
                        }
                    }
                }

                //  Update `assets` JSON field with uploaded file names
                classData.assets = JsonDocument.Parse(JsonSerializer.Serialize(fileMetadata));

                //  Save class data in the database
                int result;
                try
                {
                    result = await _classRepo.ScheduleClass(classData);
                }
                catch (Exception dbEx)
                {
                    Console.WriteLine($"Database error while scheduling class: {dbEx.Message}");
                    return StatusCode(500, new { success = false, message = "Database error occurred", error = dbEx.Message });
                }

                return result switch
                {
                    1 => Ok(new { succes = true, message = "Class scheduled successfully." }),
                    -2 => Conflict(new { succes = false, message = "Class with the same name and type already exists for this instructor." }),
                    -3 => Conflict(new { succes = false, message = "Instructor already has another class during this time." }),
                    -4 => BadRequest(new { succes = false, message = "Class duration should be at least 1 hour." }),
                    0 => StatusCode(500, new { succes = false, message = "Class scheduling failed. Please try again." }),
                    _ => StatusCode(500, new { succes = false, message = "An unexpected error occurred." })
                };
            }
            catch (JsonException jsonEx)
            {
                Console.WriteLine($"Invalid JSON format: {jsonEx.Message}");
                return BadRequest(new { success = false, message = "Invalid JSON format", error = jsonEx.Message });
            }
            catch (IOException ioEx)
            {
                Console.WriteLine($"File upload error: {ioEx.Message}");
                return StatusCode(500, new { success = false, message = "Error occurred while saving files", error = ioEx.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error in ScheduleClass: {ex.Message}");
                return StatusCode(500, new { success = false, message = "An unexpected error occurred", error = ex.Message });
            }
        }
        #endregion

        #region UpdateClass
        [HttpPut("UpdateClass")]
        public async Task<IActionResult> UpdateClass([FromForm] Class request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid request data",
                    errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                });
            }

            try
            {
                // Get existing class data
                var existingClass = await _classRepo.GetOne(request.classId.ToString());
                if (existingClass == null)
                {
                    return NotFound(new { success = false, message = "Class not found" });
                }

                // Handle file uploads only if new files are provided
                if (request.assetFiles != null && request.assetFiles.Length > 0)
                {
                    var assetsPath = Path.Combine(Directory.GetCurrentDirectory(), "../MVC/wwwroot", "ClassAssets");
                    if (!Directory.Exists(assetsPath))
                    {
                        Directory.CreateDirectory(assetsPath);
                    }

                    var assetDict = new Dictionary<string, string>();

                    for (int i = 0; i < request.assetFiles.Length; i++)
                    {
                        var file = request.assetFiles[i];
                        if (file.Length > 0)
                        {
                            var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                            var filePath = Path.Combine(assetsPath, uniqueFileName);

                            using (var stream = new FileStream(filePath, FileMode.Create))
                            {
                                await file.CopyToAsync(stream);
                            }

                            if (i == 0)
                            {
                                assetDict["banner"] = uniqueFileName;
                            }
                            else
                            {
                                assetDict[$"picture {i}"] = uniqueFileName;
                            }
                        }
                    }

                    // Update assets only if new files are uploaded
                    request.assets = JsonDocument.Parse(JsonSerializer.Serialize(assetDict));
                }
                else
                {
                    // Preserve existing assets if no new files are uploaded
                    request.assets = existingClass.assets;
                }

                // Preserve existing description if not provided
                if (request.description == null)
                {
                    request.description = existingClass.description;
                }

                var response = await _classRepo.UpdateClass(request);

                if (!response.success)
                {
                    if (response.message.Contains("Instructor not found"))
                    {
                        return BadRequest(new
                        {
                            success = false,
                            message = "The specified instructor does not exist",
                            field = "instructorId"
                        });
                    }

                    return BadRequest(new
                    {
                        success = false,
                        message = response.message
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Class updated successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
        #endregion


    }
}

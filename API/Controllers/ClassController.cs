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
        [HttpGet("ClassesById")]
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


                string uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "ClassAssets");
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

                // ✅ Return response based on the result
                switch (result)
                {
                    case 1:
                        return Ok(new { success = true, message = "Class scheduled successfully" });

                    case -1:
                        return StatusCode(500, new { success = false, message = "There was an error while scheduling your class" });

                    case -2:
                        return BadRequest(new { success = false, message = "Instructor already has a class with the same name and same type" });

                    case -3:
                        return BadRequest(new { success = false, message = "Instructor has another class within the required 1-hour gap" });

                    default:
                        return BadRequest(new { success = false, message = "Failed to schedule class" });
                }
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


    }
}

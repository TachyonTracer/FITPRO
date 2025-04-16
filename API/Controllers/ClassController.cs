using System.Text.Json;
using System.Text;
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

        #region User-Stroy : List Class 
        
        #region Class:Booking
        [HttpPost("IsClassAlreadyBooked")]
        public async Task<IActionResult> IsClassIsClassAlreadyBooked(Booking bookingdata)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);

                }
                bool result = await _classRepo.IsClassAlreadyBooked(bookingdata);
                if (result)
                {

                    return Ok(new
                    {
                        success = false,
                        message = "You have already book this class"


                    });
                }
                else
                {
                    return Ok(new
                    {
                        success = true,
                        message = "You can book this class "
                    });
                }

            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message

                });
                Console.WriteLine(ex);
            }

        }

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
        [HttpGet("GetAllClasses")]
        // [Authorize]
        public async Task<IActionResult> GetAll()
        {
            List<Class> classes = await _classRepo.GetAllClasses();
            return Ok(new { sucess = true, message = "class fetch successfully", data = classes });
        }
        #endregion

        #region GetOne
        [HttpGet("GetOneClass")]
        // [Authorize]
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
        public async Task<IActionResult> Scheduleclass([FromForm] Class classData, [FromForm] string description)
        {
            try
            {

                Dictionary<string, string>? descriptionDict = JsonSerializer.Deserialize<Dictionary<string, string>>(description);

                if (descriptionDict != null)
                {
                    string formattedJson = JsonSerializer.Serialize(descriptionDict);
                    classData.description = JsonDocument.Parse(formattedJson);
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
                    1 => Ok(new { success = true, message = "Class scheduled successfully." }),
                    -2 => Conflict(new { success = false, message = "Class with the same name and type already exists for this instructor." }),
                    -3 => Conflict(new { success = false, message = "Instructor already has another class during this time." }),
                    -4 => BadRequest(new { success = false, message = "Class duration should be at least 1 hour." }),
                    0 => StatusCode(500, new { success = false, message = "Class scheduling failed. Please try again." }),
                    _ => StatusCode(500, new { success = false, message = "An unexpected error occurred." })
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

        // Handle description
        if (request.description == null && !string.IsNullOrEmpty(Request.Form["description"]))
        {
            try
            {
                request.description = JsonDocument.Parse(Request.Form["description"]);
            }
            catch (JsonException ex)
            {
                return BadRequest(new { success = false, message = "Invalid description format", error = ex.Message });
            }
        }
        else if (request.description == null)
        {
            request.description = existingClass.description;
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

            request.assets = JsonDocument.Parse(JsonSerializer.Serialize(assetDict));
        }
        else
        {
            request.assets = existingClass.assets;
        }

        int result = await _classRepo.UpdateClass(request);

        return result switch
        {
            1 => Ok(new { success = true, message = "Class updated successfully" }),
            -1 => NotFound(new { success = false, message = "Class not found" }),
            -2 => Conflict(new { success = false, message = "Class with the same name and type already exists for this instructor" }),
            -3 => Conflict(new { success = false, message = "Instructor already has another class during this time" }),
            -4 => StatusCode(500, new { success = false, message = "An unexpected error occurred" }),
            _ => StatusCode(500, new { success = false, message = "Class update failed" })
        };
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { success = false, message = ex.Message });
    }
}
        #endregion

        #endregion

        #region GetBookedClasses
        [HttpGet("GetBookedClassesByUser/{userId}")]
        public async Task<IActionResult> GetBookedClassesByUser(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest(new { success = false, message = "User ID is required" });
            }

            var classes = await _classRepo.GetBookedClassesByUserId(userId);

            if (classes == null || classes.Count == 0)
            {
                return Ok(new { success = true, message = "No classes booked by this user", data = new List<Class>() });
            }

            return Ok(new { success = true, message = "Booked classes fetched successfully", data = classes });
        }
        #endregion

        #region Cancel Booking
        [HttpDelete("CancelBooking/{userId}/{classId}")]
        public async Task<IActionResult> CancelBooking(int userId, int classId)
        {
            try 
            {
                if (userId <= 0 || classId <= 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "User ID and Class ID must be positive integers"
                    });
                }

                var (success, message) = await _classRepo.CancelBooking(userId, classId);

                if (!success)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = message
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while canceling the booking",
                    error = ex.Message
                });
            }
        }
        #endregion

        #region Activate Class
        [HttpPost("activate-class/{classId}")]
        public async Task<IActionResult> ActivateClass(int classId)
        {
            bool result = await _classRepo.ActivateClass(classId);
            if (result)
            {
                return Ok(new { success = true, message = "Class activated successfully" });
            }
            return BadRequest(new { success = false, message = "Class is already active" });
        }
        #endregion

        #region Classwise Waitlist Count
        [HttpGet("ClasswiseWaitlistCount/{classId}")]
        public async Task<IActionResult> ClasswiseWaitlistCount(string classId)
        {
            var upcomingClassCount = await _classRepo.ClasswiseWaitlistCount(classId);
            if (upcomingClassCount != -1)
            {
                return Ok(new
                {
                    success = true,
                    message = "Classwsie Waitlist Count fetched successfully",
                    count = upcomingClassCount
                });
            }

            return BadRequest(new
            {
                success = false,
                message = "Failed to fetch Classwise Waitlist Count"
            });
        }
        #endregion

        #region PredictClass
        [HttpPost("PredictClassPopularity")]
        public async Task<IActionResult> PredictClassPopularity(
        [FromForm] string c_classname, [FromForm] string c_type,
        [FromForm] string c_startdate, [FromForm] string c_enddate, [FromForm] string c_starttime,
        [FromForm] string c_endtime,[FromForm] int c_maxcapacity,
        [FromForm] string c_requiredequipments,
        [FromForm] string c_city, [FromForm] decimal c_fees,
        [FromForm] string gender, [FromForm] double rating)
        {
            try
            {
                // Validate required fields
                if (string.IsNullOrEmpty(c_classname) || string.IsNullOrEmpty(c_type))
                {
                    return BadRequest(new { success = false, message = "Class name and type are required" });
                }

                // Parse dates
                DateTime startDate = string.IsNullOrEmpty(c_startdate) ? DateTime.Now : DateTime.ParseExact(c_startdate, "yyyy-MM-dd", null);
                DateTime endDate = string.IsNullOrEmpty(c_enddate) ? DateTime.Now : DateTime.ParseExact(c_enddate, "yyyy-MM-dd", null);
                // Calculate duration if not provided (override with form value if given)
                int duration = CalculateDuration(c_starttime, c_endtime, startDate, endDate);

                // Prepare prediction data matching Flask's expected format
                var predictionData = new
                {
                    c_classname = c_classname,
                    c_type = c_type,
                    c_startdate = c_startdate,
                    c_enddate = c_enddate,
                    c_starttime = c_starttime,
                    c_endtime = c_endtime,
                    c_duration = duration,
                    c_maxcapacity = c_maxcapacity,
                    c_requiredequipments = c_requiredequipments ?? "None",
                    c_city = c_city,
                    c_fees = c_fees,
                    Gender = gender ?? "Unknown",
                    Rating = rating, // Instructor rating from form (can be overridden by existing data if needed)
                    Is_Weekend = IsWeekend(startDate.ToString("yyyy-MM-dd")) ? "Yes" : "No",
                    Session = GetSession(c_starttime)
                };

                Console.WriteLine($"Prediction Data: {JsonSerializer.Serialize(predictionData)}");

                // Convert to JSON
                string jsonData = JsonSerializer.Serialize(predictionData);

                // Call Flask API
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("http://localhost:5000"); // Flask server address
                    var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                    var response = await client.PostAsync("/predict", content);

                    if (response.IsSuccessStatusCode)
                    {
                        string result = await response.Content.ReadAsStringAsync();
                        var predictionResult = JsonSerializer.Deserialize<Dictionary<string, object>>(result);

                        return Ok(new
                        {
                            success = true,
                            message = "Class popularity predicted successfully",
                            data = predictionResult
                        });
                    }
                    else
                    {
                        string error = await response.Content.ReadAsStringAsync();
                        return StatusCode((int)response.StatusCode, new
                        {
                            success = false,
                            message = "Failed to get prediction from Flask",
                            error = error
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new
                {
                    success = false,
                    message = "An unexpected error occurred",
                    error = ex.Message
                });
            }
        }

        // Helper methods
        private bool IsWeekend(string startDate)
        {
            if (DateTime.TryParse(startDate, out DateTime date))
            {
                return date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday;
            }
            return false;
        }

        private int CalculateDuration(string startTime, string endTime, DateTime startDate, DateTime endDate)
        {
            if (string.IsNullOrEmpty(startTime) || string.IsNullOrEmpty(endTime)) return 0;

            try
            {
                TimeSpan start = TimeSpan.Parse(startTime);
                TimeSpan end = TimeSpan.Parse(endTime);
                DateTime startDateTime = startDate + start;
                DateTime endDateTime = endDate + end;

                if (endDateTime <= startDateTime) return 0;

                double TotalHours = (endDateTime - startDateTime).TotalHours;
                return (int)Math.Max(0, TotalHours);
            }
            catch
            {
                return 0;
            }
        }

        private string GetSession(string startTime)
        {
            if (string.IsNullOrEmpty(startTime) || !TimeSpan.TryParse(startTime, out TimeSpan time)) return "Unknown";

            if (time.Hours >= 6 && time.Hours < 12) return "Morning";
            if (time.Hours >= 12 && time.Hours < 17) return "Afternoon";
            if (time.Hours >= 17 && time.Hours <= 23) return "Evening";
            return "Unknown";
        }
        #endregion


        #region Class Recommendation
        [HttpPost("ClassRecommendation")]
        public async Task<IActionResult> ClassRecommendation(
            [FromForm] int userId,
            [FromForm] string fitnessGoal,
            [FromForm] string medicalCondition,
            [FromForm] int user_age,
            [FromForm] int user_weight)
        {
            try
            {
                var hybridRequest = new
                {
                    user_id = userId,
                    user_profile = new
                    {
                        fitness_goal = fitnessGoal ?? "General",
                        medical_condition = medicalCondition ?? "None",
                        age = user_age,
                        weight = user_weight
                    }
                };

                Console.WriteLine($"Sending to Flask: {JsonSerializer.Serialize(hybridRequest)}");

                // Call Flask API
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("http://localhost:5000"); // Flask server address
                    var json = JsonSerializer.Serialize(hybridRequest);
                    var content = new StringContent(json, Encoding.UTF8, "application/json");

                    var response = await client.PostAsync("/recommend", content);

                    if (response.IsSuccessStatusCode)
                    {
                        var responseJson = await response.Content.ReadAsStringAsync();
                        var result = JsonSerializer.Deserialize<Dictionary<string, object>>(responseJson);

                        return Ok(new
                        {
                            success = true,
                            message = "Class recommendation generated successfully",
                            data = result
                        });
                    }
                    else
                    {
                        var errors = await response.Content.ReadAsStringAsync();
                        return StatusCode((int)response.StatusCode, new
                        {
                            success = false,
                            message = "Failed to get class recommendations from Flask",
                            error = errors
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new
                {
                    success = false,
                    message = "An unexpected error occurred",
                    error = ex.Message
                });
            }
        }
        #endregion
    }
}

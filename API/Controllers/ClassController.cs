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
        private readonly IConfiguration _configuration;

        public ClassController(IClassInterface classRepo, IConfiguration configuration)
        {
            _classRepo = classRepo;
            _configuration = configuration;
        }

        // DRY: Centralized API response handler
        private IActionResult ApiResponse(bool success, string message, object data = null, int statusCode = 200)
        {
            var result = new { success, message, data };
            return statusCode switch
            {
                200 => Ok(result),
                400 => BadRequest(result),
                404 => NotFound(result),
                409 => Conflict(result),
                _ => StatusCode(statusCode, result)
            };
        }

        #region Class:Booking

        [HttpPost("IsClassAlreadyBooked")]
        public async Task<IActionResult> IsClassAlreadyBooked(Booking bookingdata)
        {
            if (!ModelState.IsValid)
                return ApiResponse(false, "Invalid booking data", ModelState, 400);

            try
            {
                bool result = await _classRepo.IsClassAlreadyBooked(bookingdata);
                return result
                    ? ApiResponse(false, "You have already booked this class")
                    : ApiResponse(true, "You can book this class");
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "Error checking booking", ex.Message, 500);
            }
        }

        [HttpPost("BookClass")]
        public async Task<IActionResult> BookClass([FromBody] Booking request)
        {
            if (!ModelState.IsValid)
                return ApiResponse(false, "Invalid request data", ModelState, 400);

            var response = await _classRepo.BookClass(request);
            return response.success
                ? ApiResponse(true, response.message)
                : ApiResponse(false, response.message, null, 400);
        }
        #endregion

        #region GetAll
        [HttpGet("GetAllClasses")]
        public async Task<IActionResult> GetAll()
        {
            var classes = await _classRepo.GetAllClasses();
            return ApiResponse(true, "Classes fetched successfully", classes);
        }
        #endregion

        #region GetAllActiveClasses
        [HttpGet("GetAllActiveClasses")]
        public async Task<IActionResult> GetAllActiveClasses()
        {
            var classes = await _classRepo.GetAllActiveClasses();
            return ApiResponse(true, "Active classes fetched successfully", classes);
        }
        #endregion

        #region GetOne
        [HttpGet("GetOneClass")]
        public async Task<IActionResult> GetOne(string id)
        {
            var classes = await _classRepo.GetOne(id);
            return classes == null
                ? ApiResponse(false, "There was no class found", null, 404)
                : ApiResponse(true, "Class fetched successfully", classes);
        }
        #endregion

        #region GetClassById
        [HttpGet("GetClassesByInstructorId")]
        public async Task<IActionResult> GetClassById(string id)
        {
            var classes = await _classRepo.GetClassById(id);
            return classes == null
                ? ApiResponse(false, "There was no class found", null, 404)
                : ApiResponse(true, "Class fetched successfully", classes);
        }
        #endregion

        #region SoftDeleteClass
        [HttpDelete("soft-delete/{classId}")]
        public async Task<IActionResult> SoftDeleteClass(int classId)
        {
            bool result = await _classRepo.SoftDeleteClass(classId);
            return result
                ? ApiResponse(true, "Class soft deleted successfully")
                : ApiResponse(false, "Class is already suspended", null, 400);
        }
        #endregion

        #region Schedule class
        [HttpPost("Scheduleclass")]
        public async Task<IActionResult> Scheduleclass([FromForm] Class classData, [FromForm] string description)
        {
            if (!ModelState.IsValid)
                return ApiResponse(false, "Invalid class data", ModelState, 400);

            try
            {
                var descriptionDict = JsonSerializer.Deserialize<Dictionary<string, string>>(description);
                if (descriptionDict != null)
                {
                    classData.description = JsonDocument.Parse(JsonSerializer.Serialize(descriptionDict));
                }

                string uploadPath = Path.Combine("../MVC/wwwroot", "ClassAssets");
                Directory.CreateDirectory(uploadPath);

                var fileMetadata = new Dictionary<string, string>();
                if (classData.assetFiles != null && classData.assetFiles.Length > 0)
                {
                    for (int i = 0; i < classData.assetFiles.Length; i++)
                    {
                        var file = classData.assetFiles[i];
                        if (file != null && file.Length > 0)
                        {
                            string fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                            string filePath = Path.Combine(uploadPath, fileName);
                            using (var stream = new FileStream(filePath, FileMode.Create))
                                await file.CopyToAsync(stream);
                            string key = (i == 0) ? "banner" : $"picture {i}";
                            fileMetadata[key] = fileName;
                        }
                    }
                }
                classData.assets = JsonDocument.Parse(JsonSerializer.Serialize(fileMetadata));

                int result = await _classRepo.ScheduleClass(classData);
                return result switch
                {
                    1 => ApiResponse(true, "Class scheduled successfully"),
                    -2 => ApiResponse(false, "Class with the same name and type already exists for this instructor.", null, 409),
                    -3 => ApiResponse(false, "Instructor already has another class during this time.", null, 409),
                    -4 => ApiResponse(false, "Class duration should be at least 1 hour.", null, 400),
                    0 => ApiResponse(false, "Class scheduling failed. Please try again.", null, 500),
                    _ => ApiResponse(false, "An unexpected error occurred.", null, 500)
                };
            }
            catch (JsonException ex)
            {
                return ApiResponse(false, "Invalid JSON format", ex.Message, 400);
            }
            catch (IOException ex)
            {
                return ApiResponse(false, "Error occurred while saving files", ex.Message, 500);
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "An unexpected error occurred", ex.Message, 500);
            }
        }
        #endregion

        #region UpdateClass
        [HttpPut("UpdateClass")]
        public async Task<IActionResult> UpdateClass([FromForm] Class request)
        {
            if (!ModelState.IsValid)
                return ApiResponse(false, "Invalid request data", ModelState, 400);

            try
            {
                var existingClass = await _classRepo.GetOne(request.classId.ToString());
                if (existingClass == null)
                    return ApiResponse(false, "Class not found", null, 404);

                if (request.description == null && !string.IsNullOrEmpty(Request.Form["description"]))
                {
                    try
                    {
                        request.description = JsonDocument.Parse(Request.Form["description"]);
                    }
                    catch (JsonException ex)
                    {
                        return ApiResponse(false, "Invalid description format", ex.Message, 400);
                    }
                }
                else if (request.description == null)
                {
                    request.description = existingClass.description;
                }

                if (request.assetFiles != null && request.assetFiles.Length > 0)
                {
                    var assetsPath = Path.Combine(Directory.GetCurrentDirectory(), "../MVC/wwwroot", "ClassAssets");
                    Directory.CreateDirectory(assetsPath);

                    var assetDict = new Dictionary<string, string>();
                    for (int i = 0; i < request.assetFiles.Length; i++)
                    {
                        var file = request.assetFiles[i];
                        if (file.Length > 0)
                        {
                            var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                            var filePath = Path.Combine(assetsPath, uniqueFileName);
                            using (var stream = new FileStream(filePath, FileMode.Create))
                                await file.CopyToAsync(stream);
                            assetDict[i == 0 ? "banner" : $"picture {i}"] = uniqueFileName;
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
                    1 => ApiResponse(true, "Class updated successfully"),
                    -1 => ApiResponse(false, "Class not found", null, 404),
                    -2 => ApiResponse(false, "Class with the same name and type already exists for this instructor", null, 409),
                    -3 => ApiResponse(false, "Instructor already has another class during this time", null, 409),
                    -4 => ApiResponse(false, "An unexpected error occurred", null, 500),
                    _ => ApiResponse(false, "Class update failed", null, 500)
                };
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "An unexpected error occurred", ex.Message, 500);
            }
        }
        #endregion

        #region GetBookedClasses
        [HttpGet("GetBookedClassesByUser/{userId}")]
        public async Task<IActionResult> GetBookedClassesByUser(string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return ApiResponse(false, "User ID is required", null, 400);

            var classes = await _classRepo.GetBookedClassesByUserId(userId);
            return ApiResponse(true, "Booked classes fetched successfully", classes ?? new List<Class>());
        }
        #endregion

        #region Cancel Booking
        [HttpDelete("CancelBooking/{userId:int}/{classId:int}")]
        public async Task<IActionResult> CancelBooking(int userId, int classId)
        {
            if (userId <= 0 || classId <= 0)
                return ApiResponse(false, "User ID and Class ID must be positive integers", null, 400);

            try
            {
                var (success, message) = await _classRepo.CancelBooking(userId, classId);
                return success
                    ? ApiResponse(true, message)
                    : ApiResponse(false, message, null, 400);
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "An error occurred while canceling the booking", ex.Message, 500);
            }
        }
        #endregion

        #region Activate Class
        [HttpPost("activate-class/{classId}")]
        public async Task<IActionResult> ActivateClass(int classId)
        {
            bool result = await _classRepo.ActivateClass(classId);
            return result
                ? ApiResponse(true, "Class activated successfully")
                : ApiResponse(false, "Class is already active", null, 400);
        }
        #endregion

        #region Classwise Waitlist Count
        [HttpGet("ClasswiseWaitlistCount/{classId}")]
        public async Task<IActionResult> ClasswiseWaitlistCount(string classId)
        {
            var count = await _classRepo.ClasswiseWaitlistCount(classId);
            return count != -1
                ? ApiResponse(true, "Classwise Waitlist Count fetched successfully", new { count })
                : ApiResponse(false, "Failed to fetch Classwise Waitlist Count", null, 400);
        }
        #endregion

        #region PredictClass
        [HttpPost("PredictClassPopularity")]
        public async Task<IActionResult> PredictClassPopularity(
            [FromForm] string c_classname, [FromForm] string c_type,
            [FromForm] string c_startdate, [FromForm] string c_enddate,
            [FromForm] string c_starttime, [FromForm] string c_endtime,
            [FromForm] int c_maxcapacity, [FromForm] string c_requiredequipments,
            [FromForm] string c_city, [FromForm] decimal c_fees,
            [FromForm] string gender, [FromForm] double rating)
        {
            try
            {
                if (string.IsNullOrEmpty(c_classname) || string.IsNullOrEmpty(c_type))
                    return ApiResponse(false, "Class name and type are required", null, 400);

                DateTime startDate = string.IsNullOrEmpty(c_startdate) ? DateTime.Now : DateTime.ParseExact(c_startdate, "yyyy-MM-dd", null);
                DateTime endDate = string.IsNullOrEmpty(c_enddate) ? DateTime.Now : DateTime.ParseExact(c_enddate, "yyyy-MM-dd", null);
                int duration = CalculateDuration(c_starttime, c_endtime, startDate, endDate);

                var predictionData = new
                {
                    c_classname,
                    c_type,
                    c_startdate,
                    c_enddate,
                    c_starttime,
                    c_endtime,
                    c_duration = duration,
                    c_maxcapacity,
                    c_requiredequipments = c_requiredequipments ?? "None",
                    c_city,
                    c_fees,
                    Gender = gender ?? "Unknown",
                    Rating = rating,
                    Is_Weekend = IsWeekend(startDate.ToString("yyyy-MM-dd")) ? "Yes" : "No",
                    Session = GetSession(c_starttime)
                };

                string aiServiceUrl = Environment.GetEnvironmentVariable("AI_SERVICE_URL") ?? "http://localhost:5000";
                using var client = new HttpClient();
                var jsonData = JsonSerializer.Serialize(predictionData);
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                var response = await client.PostAsync($"{aiServiceUrl}/predict", content);

                if (response.IsSuccessStatusCode)
                {
                    string result = await response.Content.ReadAsStringAsync();
                    var predictionResult = JsonSerializer.Deserialize<Dictionary<string, object>>(result);
                    return ApiResponse(true, "Class popularity predicted successfully", predictionResult);
                }
                else
                {
                    string error = await response.Content.ReadAsStringAsync();
                    return ApiResponse(false, $"Failed to get prediction from AI service: {error}", error, (int)response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "An unexpected error occurred", ex.Message, 500);
            }
        }

        private bool IsWeekend(string startDate)
        {
            if (DateTime.TryParse(startDate, out DateTime date))
                return date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday;
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

                string aiServiceUrl = Environment.GetEnvironmentVariable("AI_SERVICE_URL") ?? "http://localhost:5000";
                using var client = new HttpClient { BaseAddress = new Uri(aiServiceUrl) };
                var json = JsonSerializer.Serialize(hybridRequest);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await client.PostAsync("/recommend", content);

                if (response.IsSuccessStatusCode)
                {
                    var responseJson = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<Dictionary<string, object>>(responseJson);
                    return ApiResponse(true, "Class recommendation generated successfully", result);
                }
                else
                {
                    var errors = await response.Content.ReadAsStringAsync();
                    return ApiResponse(false, "Failed to get class recommendations from Flask", errors, (int)response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "An unexpected error occurred", ex.Message, 500);
            }
        }
        #endregion
    }
}

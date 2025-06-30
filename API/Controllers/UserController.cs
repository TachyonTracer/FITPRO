using Microsoft.AspNetCore.Mvc;
using Repo;
using System.Threading.Tasks;
using System.IO;
using System;
using System.Collections.Generic;

namespace API
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserInterface _userRepo;
        private readonly RabbitMQService _rabbitMQService;

        public UserController(IUserInterface userRepo, RabbitMQService rabbitMQService)
        {
            _userRepo = userRepo;
            _rabbitMQService = rabbitMQService;
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
                500 => StatusCode(500, result),
                _ => StatusCode(statusCode, result)
            };
        }

        #region Get All Users
        [HttpGet("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var userList = await _userRepo.GetAllUsers();
            if (userList != null && userList.Count > 0)
                return ApiResponse(true, "Users fetched successfully.", userList);
            return ApiResponse(false, "No users found.", null, 404);
        }
        #endregion

        #region Get One User By Id
        [HttpGet("GetOneUser/{id}")]
        public async Task<IActionResult> GetOneUser(int id)
        {
            var user = await _userRepo.GetAllUsersById(id);
            if (user != null)
                return ApiResponse(true, "User fetched successfully.", user);
            return ApiResponse(false, "User does not exist.", null, 404);
        }
        #endregion

        #region Get All Users By ClassId
        [HttpGet("GetAllUsersByClassId/{classId}")]
        public async Task<IActionResult> GetAllUsersByClassId(int classId)
        {
            var userList = await _userRepo.GetAllUsersByClassId(classId);
            if (userList.Count > 0)
                return ApiResponse(true, "Users by class fetched successfully.", userList);
            return ApiResponse(false, "No users found for this class.", userList, 404);
        }
        #endregion

        #region Get All Users By InstructorId
        [HttpGet("GetAllUsersByInstructorId/{instructorId}")]
        public async Task<IActionResult> GetAllUsersByInstructorId(int instructorId)
        {
            var userList = await _userRepo.GetAllUsersByClassId(instructorId);
            if (userList.Count > 0)
                return ApiResponse(true, "Users by instructor fetched successfully.", userList);
            return ApiResponse(false, "No users found for this instructor.", userList, 404);
        }
        #endregion

        #region Suspend User
        [HttpPost("UserSuspend/{id}")]
        public async Task<IActionResult> SuspendUser(string id, [FromForm] string reason)
        {
            var user = await _userRepo.GetAllUsersById(int.Parse(id));
            if (user == null)
                return ApiResponse(false, "User not found.", null, 404);

            var result = await _userRepo.SuspendUser(id, reason);
            return result
                ? ApiResponse(true, "User suspended. Suspend mail sent successfully!")
                : ApiResponse(false, "Failed to suspend user.", null, 400);
        }
        #endregion

        #region Activate User
        [HttpPost("UserActivate/{id}")]
        public async Task<IActionResult> ActivateUser(string id)
        {
            var user = await _userRepo.GetAllUsersById(int.Parse(id));
            if (user == null)
                return ApiResponse(false, "User not found.", null, 404);

            var result = await _userRepo.ActivateUser(id);
            return result
                ? ApiResponse(true, "User activated. Mail sent successfully!")
                : ApiResponse(false, "Failed to activate user.", null, 400);
        }
        #endregion

        #region TestUserNotification
        [HttpGet("GetUserNotification")]
        public IActionResult GetUserNotification()
        {
            try
            {
                _rabbitMQService.PublishNotification("12", "admin", $"New Admin Notification::Nevil Registered recently::{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}");
                _rabbitMQService.PublishNotification("39", "instructor", $"Class Full !!!::One of your class is fully booked!::{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}");
                return ApiResponse(true, "Successfully sent user notification");
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "An error occurred while sending notifications.", ex.Message, 500);
            }
        }
        #endregion

        #region Update User Profile
        [HttpPut("UserUpdateProfile")]
        public async Task<IActionResult> UpdateProfile([FromForm] User user)
        {
            if (!ModelState.IsValid)
                return ApiResponse(false, "Invalid user data.", ModelState, 400);

            try
            {
                // Handle profile image upload
                if (user.profileImageFile != null && user.profileImageFile.Length > 0)
                {
                    var fileName = Guid.NewGuid() + Path.GetExtension(user.profileImageFile.FileName);
                    var filePath = Path.Combine("../MVC/wwwroot/User_Images", fileName);
                    Directory.CreateDirectory(Path.Combine("../MVC/wwwroot/User_Images"));
                    user.profileImage = fileName;
                    using (var stream = new FileStream(filePath, FileMode.Create))
                        await user.profileImageFile.CopyToAsync(stream);
                }

                bool success = await _userRepo.UpdateUserProfileAsync(user);
                return success
                    ? ApiResponse(true, "Profile updated successfully")
                    : ApiResponse(false, "User not found or update failed", null, 404);
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "Internal server error", ex.Message, 500);
            }
        }
        #endregion

        #region GetUserById
        [HttpGet("GetUserById/{userId}")]
        public async Task<IActionResult> GetUserById(string userId)
        {
            try
            {
                var user = await _userRepo.GetUserByIdAsync(Convert.ToInt32(userId));
                if (user == null)
                    return ApiResponse(false, "User not found", null, 404);
                return ApiResponse(true, "User fetched successfully", user);
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "Internal server error", ex.Message, 500);
            }
        }
        #endregion

        #region GetUserBalanceById
        [HttpGet("GetUserBalanceById/{userId}")]
        public async Task<IActionResult> GetUserBalanceById(string userId)
        {
            var balance = await _userRepo.GetUserBalanceById(int.Parse(userId));
            if (balance != null)
                return ApiResponse(true, "User balance fetched successfully.", balance);
            return ApiResponse(false, "Error occurred while fetching user balance.", null, 404);
        }
        #endregion

        #region Upcoming Class Count By User
        [HttpGet("UpcomingClassCountByUser/{userId}")]
        public async Task<IActionResult> UpcomingClassCountByUser(string userId)
        {
            var classCount = await _userRepo.UpcomingClassCountByUser(userId);
            if (classCount != -1)
                return ApiResponse(true, "Upcoming class count by user fetched successfully", new { count = classCount });
            return ApiResponse(false, "Failed to fetch upcoming class count by user", null, 400);
        }
        #endregion

        #region Completed Class Count By User
        [HttpGet("CompletedClassCountByUser/{userId}")]
        public async Task<IActionResult> CompletedClassCountByUser(string userId)
        {
            var classCount = await _userRepo.CompletedClassCountByUser(userId);
            if (classCount != -1)
                return ApiResponse(true, "Completed class count by user fetched successfully", new { count = classCount });
            return ApiResponse(false, "Failed to fetch completed class count by user", null, 400);
        }
        #endregion

        #region Enrolled Class Count By User
        [HttpGet("EnrolledClassCountByUser/{userId}")]
        public async Task<IActionResult> EnrolledClassCountByUser(string userId)
        {
            var classCount = await _userRepo.EnrolledClassCountByUser(userId);
            if (classCount != -1)
                return ApiResponse(true, "Enrolled class count by user fetched successfully", new { count = classCount });
            return ApiResponse(false, "Failed to fetch enrolled class count by user", null, 400);
        }
        #endregion

        #region Add Balance 
        [HttpPost("AddBalance")]
        public async Task<IActionResult> AddBalance(Balance balance)
        {
            if (!ModelState.IsValid)
                return ApiResponse(false, "Invalid balance data.", ModelState, 400);

            var result = await _userRepo.AddBalance(balance);
            return result switch
            {
                1 => ApiResponse(true, "Balance added successfully."),
                0 => ApiResponse(false, "Failed to add balance.", null, 400),
                _ => ApiResponse(false, "An unexpected error occurred while adding balance.", null, 500)
            };
        }
        #endregion

        #region Debit Balance 
        [HttpPost("DebitBalance")]
        public async Task<IActionResult> DebitBalance(Balance balance)
        {
            if (!ModelState.IsValid)
                return ApiResponse(false, "Invalid balance data.", ModelState, 400);

            var result = await _userRepo.DebitBalance(balance);
            return result switch
            {
                1 => ApiResponse(true, "Balance debited successfully."),
                0 => ApiResponse(false, "Failed to debit balance.", null, 400),
                -1 => ApiResponse(false, "Insufficient balance or user not found.", null, 400),
                _ => ApiResponse(false, "An unexpected error occurred while debiting balance.", null, 500)
            };
        }
        #endregion
    }
}

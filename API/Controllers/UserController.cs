using Microsoft.AspNetCore.Mvc;
using Repo;
using System.Threading.Tasks;

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

		#region Get All Users For Admin Dashboard By Paras

		#region Get All Users

		[HttpGet("GetAllUsers")]
		// [Authorize]
		public async Task<IActionResult> GetAllInstructors()
		{
			List<User> userList = await _userRepo.GetAllUsers();
			if (userList != null)
			{
				return Ok(new
				{
					success = true,
					message = "Users fetched successfully.",
					data = userList
				});
			}

			return Ok(new
			{
				success = false,
				message = "Error occured while fetching users."
			});
		}
		#endregion

		#region Get One User By Id
		[HttpGet("GetOneUser/{id}")]
		public async Task<IActionResult> GetOneInstructor(int id)
		{
			var user = await _userRepo.GetAllUsersById(id);
			if (user != null)
			{
				return Ok(new
				{
					success = true,
					message = "One User fetched successfully.",
					data = user
				});
			}
			return Ok(new
			{
				success = false,
				message = "User does not exists."
			});
		}
		#endregion

		#region Get All Users By ClassId
		[HttpGet("GetAllUsersByClassId/{classId}")]
		// [Authorize]
		public async Task<IActionResult> GetAllUsersByClassId(int classId)
		{
			List<User> userList = await _userRepo.GetAllUsersByClassId(classId);
			if (userList.Count != 0)
			{
				return Ok(new
				{
					success = true,
					message = "Users By Classes fetched successfully.",
					data = userList
				});
			}
			else if (userList.Count == 0)
			{
				return Ok(new
				{
					success = false,
					message = "Users By Classes Not Available.",
					data = userList
				});
			}

			return Ok(new
			{
				success = false,
				message = "Error occured while fetching users by classes."
			});
		}
		#endregion

		#region Get All Users By InstructorId
		[HttpGet("GetAllUsersByInstructorId/{instructorId}")]
		public async Task<IActionResult> GetAllUsersByInstructorId(int instructorId)
		{
			List<User> userList = await _userRepo.GetAllUsersByClassId(instructorId);
			if (userList.Count != 0)
			{
				return Ok(new
				{
					success = true,
					message = "Users By Instructor fetched successfully.",
					data = userList
				});
			}
			else if (userList.Count == 0)
			{
				return Ok(new
				{
					success = false,
					message = "Users By Instructor Not Available.",
					data = userList
				});
			}

			return Ok(new
			{
				success = false,
				message = "Error occured while fetching users by instructors."
			});
		}
		#endregion

		#endregion

		#region User stroy:List User Design
		#region Suspend User
		[HttpPost("UserSuspend/{id}")]
		public async Task<IActionResult> SuspendInstructor(string id,[FromForm]string reason)
		{
			var instructor = await _userRepo.GetAllUsersById(int.Parse(id));
			if (instructor == null)
			{
				return NotFound(new { success = false, message = "User not found." });
			}

			var result = await _userRepo.SuspendUser(id,reason);
			if (result)
			{
				return Ok(new { success = true, message = "User Suspended.Suspend Mail send successfully!" });
			}
			return BadRequest(new { message = "Failed to Suspennd User." });
		}
		#endregion

		#region Activate User
        [HttpPost("UserActivate/{id}")]
        public async Task<IActionResult> ActivateInstructor(string id)
        {
            var instructor = await _userRepo.GetAllUsersById(int.Parse(id));
            if (instructor == null)
            {
                return NotFound(new {success = false, message = "User not found." });
            }

            var result = await _userRepo.ActivateUser(id);
            if (result)
            {
                return Ok(new {success = true, message = "User Activated,Mail send successfully!" });
            }
            return BadRequest(new { message = "Failed to Activate User." });
        }
        #endregion
		#endregion


		// Todo: remove before merge
		#region TestUserNotification
		[HttpGet]
		[Route("GetUserNotification")]
		public async Task<ActionResult> GetUserNotification()
		{
			try
			{
				_rabbitMQService.PublishNotification("12", "admin", $"New Admin Notification::Nevil Registered recently::{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}");
				_rabbitMQService.PublishNotification("29", "instructor", $"Class Full !!!::One of your class is fully booked!::{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}");
				// _rabbitMQService.PublishNotification("U2", "user", $"New User Notification::Admin Assigned a new task for you::{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}");

				return Ok(new { success = true, data = "successfully sent user notification" });
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { success = false, message = "An error occurred while fetching admins.", error = ex.Message });
			}
		}
		#endregion


		#region Update User Profile
		// Update profile with image upload
		[HttpPut("UserUpdateProfile")]
		public async Task<IActionResult> UpdateProfile([FromForm] User user)
		{
			try
			{
				if (!ModelState.IsValid)
				{
					return BadRequest(ModelState);
				}

				// Handle profile image upload
				if (user.profileImageFile != null && user.profileImageFile.Length > 0)
				{
					var fileName = Guid.NewGuid().ToString() + Path.GetExtension(user.profileImageFile.FileName);
					var filePath = Path.Combine("../MVC/wwwroot/User_Images", fileName);

					// Create directory if it doesn't exist
					Directory.CreateDirectory(Path.Combine("../MVC/wwwroot/User_Images"));

					user.profileImage = fileName;

					// Save the image to the server
					using (var stream = new FileStream(filePath, FileMode.Create))
					{
						await user.profileImageFile.CopyToAsync(stream);
					}
				}

				// Update the user's profile information
				bool success = await _userRepo.UpdateUserProfileAsync(user);

				if (!success)
				{
					return NotFound("User not found or update failed");
				}

				return Ok(new { message = "Profile updated successfully" });
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = "Internal server error", error = ex.Message });
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
				{
					return NotFound(new { message = "User not found" });
				}

				return Ok(user);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = "Internal server error", error = ex.Message });
			}
		}
		#endregion

		#region GetUeserBalaceById
		[HttpGet("GetUserBalanceById/{userId}")]
		public async Task<IActionResult> GetUserBalanceById(string userId)
		{
			var balance = await _userRepo.GetUserBalanceById(int.Parse(userId));
			if (balance != null)
			{
				return Ok(new
				{
					success = true,
					message = "User Balance fetched successfully.",
					data = balance
				});
			}
			return Ok(new
			{
				success = false,
				message = "Error occured while fetching user balance."
			});
		}
		#endregion
	}
}

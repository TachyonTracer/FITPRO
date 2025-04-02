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
		public async Task<IActionResult> SuspendInstructor(string id)
		{
			var instructor = await _userRepo.GetAllUsersById(int.Parse(id));
			if (instructor == null)
			{
				return NotFound(new { success = false, message = "Instructor not found." });
			}

			var result = await _userRepo.SuspendUser(id);
			if (result)
			{
				return Ok(new { success = true, message = "User Suspended successfully!" });
			}
			return BadRequest(new { message = "Failed to Suspennd User." });
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
                _rabbitMQService.PublishNotification("A1", "admin", $"New Admin Notification::Nevil Registered recently::{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}");
                _rabbitMQService.PublishNotification("I2", "instructor", $"New Instructor Notification::Admin Assigned a new task for you::{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}");
                _rabbitMQService.PublishNotification("U2", "user", $"New User Notification::Admin Assigned a new task for you::{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}");

                return Ok(new { success = true, data = "successfully sent user notification" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while fetching admins.", error = ex.Message });
            }
        }
        #endregion

	}

}


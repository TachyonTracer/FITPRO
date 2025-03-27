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

		public UserController(IUserInterface userRepo)
		{
			_userRepo = userRepo;
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
			else if(userList.Count == 0)
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


	}

}


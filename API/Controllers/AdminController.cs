using Microsoft.AspNetCore.Mvc;
using Repo;
using System.Threading.Tasks;



namespace API
{

	[ApiController]
	[Route("api/[controller]")]
	public class AdminController : ControllerBase
	{
		private readonly IAdminInterface _adminRepo;

		public AdminController(IAdminInterface adminRepo)
		{
			_adminRepo = adminRepo;
		}


		#region Analytics Related

		#region Top Goals

		[HttpGet("top-goals")]
		public async Task<IActionResult> GetTopUserGoals()
		{
			try
			{
				var goals = await _adminRepo.GetTopUserGoalsAsync();

				if (goals != null && goals.Any())
				{
					return Ok(new { success = true, message = "Data retrieved successfully", data = goals });
				}
				else
				{
					return Ok(new { success = false, message = "No goals found", data = (object)null });
				}
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { success = false, message = "An error occurred", error = ex.Message });
			}
		}
		#endregion

		#region Top Specialization
		[HttpGet("top-specialization")]
		public async Task<IActionResult> GetTopSpecializationGoals()
		{
			try
			{
				var specializations = await _adminRepo.GetTopSpecialization();

				if (specializations != null && specializations.Any())
				{
					return Ok(new { success = true, message = "Data retrieved successfully", data = specializations });
				}
				else
				{
					return NotFound(new { success = false, message = "No specializations found", data = (object)null });
				}
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { success = false, message = "An error occurred", error = ex.Message });
			}
		}
		#endregion

		#region Count Users
		[HttpGet("count-users")]
		public async Task<IActionResult> GetUserCount()
		{
			try
			{
				int userCount = await _adminRepo.CountUsers();
				return Ok(new { success = true, message = "User count retrieved successfully", count = userCount });
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { success = false, message = "An error occurred", error = ex.Message });
			}
		}
		#endregion

		#region Count Classes
		[HttpGet("count-classes")]
		public async Task<IActionResult> GetClassCount()
		{
			try
			{
				int classCount = await _adminRepo.CountClasses();
				return Ok(new { success = true, message = "Class count retrieved successfully", count = classCount });
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { success = false, message = "An error occurred", error = ex.Message });
			}
		}
		#endregion

		#region Count Instructors

		[HttpGet("count-instructors")]
		public async Task<IActionResult> GetInstructorCount()
		{
			try
			{
				int instructorCount = await _adminRepo.CountInstructors();
				return Ok(new { success = true, message = "Instructor count retrieved successfully", count = instructorCount });
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { success = false, message = "An error occurred", error = ex.Message });
			}
		}
		#endregion


		#endregion
	}

}

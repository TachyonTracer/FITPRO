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

		#region Total Revenue
		[HttpGet("total-revenue")]
		public async Task<IActionResult> GetTotalRevenue()
		{
			try
			{
				int totalRevenue = await _adminRepo.TotalRevenue();
				return Ok(new { success = true, message = "Total revenue retrieved successfully", count = totalRevenue });
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { success = false, message = "An error occurred", error = ex.Message });
			}
		}
		#endregion


		#region Active and Inactive Users API
		[HttpGet("user-engagement")]
		public async Task<IActionResult> GetActiveInactiveUserCount()
		{
			try
			{
				// Get the active and inactive user counts
				var (activeUserCount, inactiveUserCount) = await _adminRepo.CountActiveInactiveUsers();

				return Ok(new 
				{ 
					success = true, 
					message = "Active and Inactive user counts retrieved successfully", 
					activeUsers = activeUserCount, 
					inactiveUsers = inactiveUserCount 
				});
			}
			catch (Exception ex)
			{
				return StatusCode(500, new 
				{ 
					success = false, 
					message = "An error occurred", 
					error = ex.Message 
				});
			}
		}
		#endregion

		#region User Activity (Last 7 Days)
		[HttpGet("user-activity")]
		public async Task<IActionResult> GetUserActivityLast7Days()
		{
			try
			{
				// Fetch user activity data for the last 7 days
				var userActivityData = await _adminRepo.GetUserActivityLast7Days();

				return Ok(new { success = true, message = "User activity data retrieved successfully", data = userActivityData });
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

using Microsoft.AspNetCore.Mvc;
using Repo;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

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

        // Generic method to handle API responses with DRY principle
        private async Task<IActionResult> HandleApiResponse<T>(Func<Task<T>> func, string successMessage, string notFoundMessage = null)
        {
            try
            {
                var result = await func();
                if (result == null || (result is IEnumerable<object> enumerable && !enumerable.Any()))
                {
                    if (notFoundMessage != null)
                        return NotFound(new { success = false, message = notFoundMessage, data = (object)null });
                    return Ok(new { success = false, message = notFoundMessage ?? "No data found." });
                }
                return Ok(new { success = true, message = successMessage, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred", error = ex.Message });
            }
        }

        #region Analytics Related

        #region Top Specialization
        [HttpGet("top-specialization")]
        public Task<IActionResult> GetTopSpecializationGoals()
        {
            return HandleApiResponse(
                () => _adminRepo.GetTopSpecialization(),
                "Data retrieved successfully",
                "No specializations found"
            );
        }
        #endregion

        #region Count Users
        [HttpGet("count-users")]
        public Task<IActionResult> GetUserCount()
        {
            return HandleApiResponse(
                async () => await _adminRepo.CountUsers(),
                "User count retrieved successfully"
            );
        }
        #endregion

        #region Count Classes
        [HttpGet("count-classes")]
        public Task<IActionResult> GetClassCount()
        {
            return HandleApiResponse(
                async () => await _adminRepo.CountClasses(),
                "Class count retrieved successfully"
            );
        }
        #endregion

        #region Count Instructors
        [HttpGet("count-instructors")]
        public Task<IActionResult> GetInstructorCount()
        {
            return HandleApiResponse(
                async () => await _adminRepo.CountInstructors(),
                "Instructor count retrieved successfully"
            );
        }
        #endregion

        #region Total Revenue
        [HttpGet("total-revenue")]
        public Task<IActionResult> GetTotalRevenue()
        {
            return HandleApiResponse(
                async () => await _adminRepo.TotalRevenue(),
                "Total revenue retrieved successfully"
            );
        }
        #endregion

        #region Active and Inactive Users API
        [HttpGet("user-engagement")]
        public async Task<IActionResult> GetActiveInactiveUserCount()
        {
            try
            {
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

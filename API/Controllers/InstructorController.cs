using Microsoft.AspNetCore.Mvc;
using System.IO;
using Repo;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace API
{
    [ApiController]
    [Route("api/[controller]")]
    public class InstructorController : ControllerBase
    {
        private readonly IInstructorInterface _instructorRepo;

        public InstructorController(IInstructorInterface instructorRepo)
        {
            _instructorRepo = instructorRepo;
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

        #region Get All Instructors
        [HttpGet("GetAllInstructors")]
        public async Task<IActionResult> GetAllInstructors()
        {
            var instructorList = await _instructorRepo.GetAllInstructors();
            if (instructorList != null && instructorList.Count > 0)
                return ApiResponse(true, "Instructors fetched successfully.", instructorList);
            return ApiResponse(false, "No instructors found.", null, 404);
        }
        #endregion

        #region Get One Instructor
        [HttpGet("GetOneInstructor/{id}")]
        public async Task<IActionResult> GetOneInstructor(string id)
        {
            var instructor = await _instructorRepo.GetOneInstructor(id);
            if (instructor != null)
                return ApiResponse(true, "One Instructor fetched successfully.", instructor);
            return ApiResponse(false, "Instructor does not exist.", null, 404);
        }
        #endregion

        #region Get One Instructor By Id (Profile)
        [HttpGet("GetOneInstructorById/{instructorId}")]
        public async Task<IActionResult> GetOneInstructorById(int instructorId)
        {
            var instructor = await _instructorRepo.GetOneInstructorByIdForProfile(instructorId);
            if (instructor == null)
                return ApiResponse(false, "Instructor not found", null, 404);
            return ApiResponse(true, "Instructor profile fetched successfully.", instructor);
        }
        #endregion

        #region Update Instructor Profile
        [HttpPost("edit-profile-basic")]
        public async Task<IActionResult> EditProfileBasic([FromForm] Instructor instructor)
        {
            try
            {
                if (instructor.profileImageFile != null && instructor.profileImageFile.Length > 0)
                {
                    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(instructor.profileImageFile.FileName)}";
                    var filePath = Path.Combine("../MVC/wwwroot/Instructor_Images", fileName);
                    Directory.CreateDirectory(Path.Combine("../MVC/wwwroot/Instructor_Images"));
                    instructor.profileImage = fileName;
                    using (var stream = new FileStream(filePath, FileMode.Create))
                        await instructor.profileImageFile.CopyToAsync(stream);
                }

                int result = await _instructorRepo.EditProfileBasic(instructor);
                return result > 0
                    ? ApiResponse(true, "Instructor profile updated successfully.")
                    : ApiResponse(false, "Instructor not found or no changes made.", null, 404);
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "An error occurred while updating profile.", ex.Message, 500);
            }
        }
        #endregion

        #region Class Count By Instructor
        [HttpGet("ClassCountByInstructor/{instructorId}")]
        public async Task<IActionResult> ClassCountByInstructor(string instructorId)
        {
            var classCount = await _instructorRepo.ClassCountByInstructor(instructorId);
            return classCount != -1
                ? ApiResponse(true, "Class Count By Instructor fetched successfully", new { count = classCount })
                : ApiResponse(false, "Failed to fetch Class Count By Instructor", null, 400);
        }
        #endregion

        #region Get Verified Instructors
        [HttpGet("GetVerifiedInstructors")]
        public async Task<IActionResult> GetVerifiedInstructors()
        {
            var instructorList = await _instructorRepo.GetVerifiedInstructors();
            if (instructorList != null && instructorList.Count > 0)
                return ApiResponse(true, "Verified Instructors fetched successfully.", instructorList);
            return ApiResponse(false, "No verified instructors found.", null, 404);
        }
        #endregion

        #region Upcoming Class Count By Instructor
        [HttpGet("UpcomingClassCountByInstructor/{instructorId}")]
        public async Task<IActionResult> UpcomingClassCountByInstructor(string instructorId)
        {
            var classCount = await _instructorRepo.UpcomingClassCountByInstructor(instructorId);
            return classCount != -1
                ? ApiResponse(true, "Upcoming Class Count By Instructor fetched successfully", new { count = classCount })
                : ApiResponse(false, "Failed to fetch Upcoming Class Count By Instructor", null, 400);
        }
        #endregion

        #region User Count By Instructor
        [HttpGet("UserCountByInstructor/{instructorId}")]
        public async Task<IActionResult> UserCountByInstructor(string instructorId)
        {
            var userCount = await _instructorRepo.UserCountByInstructor(instructorId);
            return userCount != -1
                ? ApiResponse(true, "User Count By Instructor fetched successfully", new { count = userCount })
                : ApiResponse(false, "Failed to fetch User Count By Instructor", null, 400);
        }
        #endregion

        #region Upcoming Class Details By Instructor
        [HttpGet("UpcomingClassDetailsByInstructor/{instructorId}")]
        public async Task<IActionResult> UpcomingClassDetailsByInstructor(string instructorId)
        {
            var upcomingClassList = await _instructorRepo.UpcomingClassDetailsByInstructor(instructorId);
            if (upcomingClassList != null && upcomingClassList.Count > 0)
                return ApiResponse(true, "Upcoming Class Details fetched successfully.", upcomingClassList);
            return ApiResponse(false, "No upcoming class details found.", null, 404);
        }
        #endregion

        #region Get Approved Instructors
        [HttpGet("GetApprovedInstructors")]
        public async Task<IActionResult> GetApprovedInstructors()
        {
            var instructorList = await _instructorRepo.GetApprovedInstructors();
            if (instructorList != null && instructorList.Count > 0)
                return ApiResponse(true, "Approved Instructors fetched successfully.", instructorList);
            return ApiResponse(false, "No approved instructors found.", null, 404);
        }
        #endregion

        #region Approve Instructor
        [HttpPost("InstructorApprove/{id}")]
        public async Task<IActionResult> ApproveInstructor(string id)
        {
            var instructor = await _instructorRepo.GetOneInstructor(id);
            if (instructor == null)
                return ApiResponse(false, "Instructor not found.", null, 404);

            var result = await _instructorRepo.ApproveInstructor(id);
            return result
                ? ApiResponse(true, "Instructor approved, Approval mail sent successfully!")
                : ApiResponse(false, "Failed to approve instructor.", null, 400);
        }
        #endregion

        #region Disapprove Instructor
        [HttpPost("InstructorDisapprove/{id}")]
        public async Task<IActionResult> DisapproveInstructor(string id, [FromForm] string reason)
        {
            var instructor = await _instructorRepo.GetOneInstructor(id);
            if (instructor == null)
                return ApiResponse(false, "Instructor not found.", null, 404);

            var result = await _instructorRepo.DisapproveInstructor(id, reason);
            return result
                ? ApiResponse(true, "Instructor disapproved, Disapprove mail sent successfully!")
                : ApiResponse(false, "Failed to disapprove instructor.", null, 400);
        }
        #endregion

        #region Suspend Instructor
        [HttpPost("InstructorSuspend/{id}")]
        public async Task<IActionResult> SuspendInstructor(string id, [FromForm] string reason)
        {
            var instructor = await _instructorRepo.GetOneInstructor(id);
            if (instructor == null)
                return ApiResponse(false, "Instructor not found.", null, 404);

            var result = await _instructorRepo.SuspendInstructor(id, reason);
            return result
                ? ApiResponse(true, "Instructor suspended, mail sent successfully!")
                : ApiResponse(false, "Failed to suspend instructor.", null, 400);
        }
        #endregion

        #region Activate Instructor
        [HttpPost("InstructorActivate/{id}")]
        public async Task<IActionResult> ActivateInstructor(string id)
        {
            var instructor = await _instructorRepo.GetOneInstructor(id);
            if (instructor == null)
                return ApiResponse(false, "Instructor not found.", null, 404);

            var result = await _instructorRepo.ActivateInstructor(id);
            return result
                ? ApiResponse(true, "Instructor activated, mail sent successfully!")
                : ApiResponse(false, "Failed to activate instructor.", null, 400);
        }
        #endregion

        #region Get Typewise Class Count
        [HttpGet("typewise-class-count/{instructorId}")]
        public async Task<IActionResult> GetTypewiseClassCount(string instructorId)
        {
            try
            {
                var typewiseClassCount = await _instructorRepo.GetTypewiseClassCount(instructorId);
                return ApiResponse(true, "Typewise Class Count data retrieved successfully", typewiseClassCount);
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "An error occurred", ex.Message, 500);
            }
        }
        #endregion
    }
}
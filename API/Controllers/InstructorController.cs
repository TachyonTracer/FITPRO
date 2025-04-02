using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Repo;

namespace API
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstructorController : ControllerBase
    {
        private readonly IInstructorInterface _instructorRepo;

        #region Constructor
        public InstructorController(IInstructorInterface instructorRepo)
        {
            _instructorRepo = instructorRepo;
        }
        #endregion

        #region Get All Instructors
        [HttpGet("GetAllInstructors")]
        // [Authorize]
        public async Task<IActionResult> GetAllInstructors()
        {
            List<Instructor> instructorList = await _instructorRepo.GetAllInstructors();
            if (instructorList != null)
            {
                return Ok(new
                {
                    success = true,
                    message = "Instructors fetched successfully.",
                    data = instructorList
                });
            }

            return Ok(new
            {
                success = false,
                message = "Error occured while fetching instructors."
            });
        }
        #endregion


        #region Get One Instructor
        [HttpGet("GetOneInstructor/{id}")]
        // [Authorize]
        public async Task<IActionResult> GetOneInstructor(string id)
        {
            var instructor = await _instructorRepo.GetOneInstructor(id);
            if (instructor != null)
            {
                return Ok(new
                {
                    success = true,
                    message = "One Instructor fetched successfully.",
                    data = instructor
                });
            }
            return Ok(new
            {
                success = false,
                message = "Instructor does not exists."
            });
        }
        #endregion

        #region Get Verified Instructors
        [HttpGet("GetVerifiedInstructors")]
        // [Authorize]
        public async Task<IActionResult> GetVerifiedInstructors()
        {
            List<Instructor> instructorList = await _instructorRepo.GetVerifiedInstructors();
            if (!instructorList.IsNullOrEmpty())
            {
                return Ok(new
                {
                    success = true,
                    message = "Verified Instructors fetched successfully.",
                    data = instructorList
                });
            }

            return Ok(new
            {
                success = false,
                message = "No verified instructors found."
            });
        }
        #endregion

        #region Get Approved Instructors
        [HttpGet("GetApprovedInstructors")]
        // [Authorize]
        public async Task<IActionResult> GetApprovedInstructors()
        {
            List<Instructor> instructorList = await _instructorRepo.GetApprovedInstructors();
            if (!instructorList.IsNullOrEmpty())
            {
                return Ok(new
                {
                    success = true,
                    message = "Approved Instructors fetched successfully.",
                    data = instructorList
                });
            }

            return Ok(new
            {
                success = false,
                message = "No approved instructors found."
            });
        }
        #endregion


        #region User Stroy : Update Instructor(Admin Dashboard)
        
        #region Approve Instructor
        [HttpPost("InstructorApprove/{id}")]
        public async Task<IActionResult> ApproveInstructor(string id)
        {
            var instructor = await _instructorRepo.GetOneInstructor(id);
            if (instructor == null)
            {
                return NotFound(new {success = false, message = "Instructor not found." });
            }

            var result = await _instructorRepo.ApproveInstructor(id);
            if (result)
            {
                return Ok(new {success = true, message = "Instructor approved, Approval mail send successfully!." });
            }
            return BadRequest(new { message = "Failed to approve instructor." });
        }
        #endregion

        #region Disapprove Instructor
        [HttpPost("InstructorDisapprove/{id}")]
        public async Task<IActionResult> DisapproveInstructor(string id)
        {
            var instructor = await _instructorRepo.GetOneInstructor(id);
            if (instructor == null)
            {
                return NotFound(new {success = false, message = "Instructor not found." });
            }

            var result = await _instructorRepo.DisapproveInstructor(id);
            if (result)
            {
                return Ok(new {success = true, message = "Instructor disapproved, Disapprove mail send successfully!." });
            }
            return BadRequest(new { message = "Failed to disapprove instructor." });
        }
        #endregion

        #region Suspend Instructor
        [HttpPost("InstructorSuspend/{id}")]
        public async Task<IActionResult> SuspendInstructor(string id)
        {
            var instructor = await _instructorRepo.GetOneInstructor(id);
            if (instructor == null)
            {
                return NotFound(new {success = false, message = "Instructor not found." });
            }

            var result = await _instructorRepo.SuspendInstructor(id);
            if (result)
            {
                return Ok(new {success = true, message = "Instructor Suspended successfully!" });
            }
            return BadRequest(new { message = "Failed to Suspennd instructor." });
        }
        #endregion
        #endregion
    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Repo;

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

        #region  Get One Instructor By Id
        [HttpGet("GetOneInstructorById/{instructorId}")]
        public async Task<ActionResult<Instructor>> GetOneInstructorById(int instructorId)
        {
            var instructor = await _instructorRepo.GetOneInstructorByIdForProfile(instructorId);

            if (instructor == null)
            {
                return NotFound(new { message = "Instructor not found" });
            }

            return Ok(instructor);

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
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(instructor.profileImageFile.FileName);
                    var filePath = Path.Combine("../MVC/wwwroot/Instructor_Images", fileName);

                    Directory.CreateDirectory(Path.Combine("../MVC/wwwroot/Instructor_Images"));

                    instructor.profileImage = fileName;

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await instructor.profileImageFile.CopyToAsync(stream);
                    }
                }


                int result = await _instructorRepo.EditProfileBasic(instructor);


                if (result > 0)
                {
                    return Ok(new { message = "Instructor profile updated successfully." });
                }
                else
                {
                    return Ok("Instructor not found or no changes made.");
                }
            }
            catch (Exception ex)
            {
                return Ok(new { error = "An error occurred while updating profile.", details = ex.Message });
            }
        }
        #endregion


        #region Class Count By Instructor
        [HttpGet("ClassCountByInstructor/{instructorId}")]
        public async Task<IActionResult> ClassCountByInstructor(string instructorId)
        {
            var classCount = await _instructorRepo.ClassCountByInstructor(instructorId);
            if (classCount != -1)
            {
                return Ok(new
                {
                    success = true,
                    message = "Class Count By Instructor fetched successfully",
                    count = classCount
                });
            }

            return BadRequest(new
            {
                success = false,
                message = "Failed to fetch Class Count By Instructor"
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


        #region Upcoming Class Count By Instructor
        [HttpGet("UpcomingClassCountByInstructor/{instructorId}")]
        public async Task<IActionResult> UpcomingClassCountByInstructor(string instructorId)
        {
            var classCount = await _instructorRepo.UpcomingClassCountByInstructor(instructorId);
            if (classCount != -1)
            {
                return Ok(new
                {
                    message = "Upcoming Class Count By Instructor fetched successfully",
                    count = classCount
                });
            }

            return BadRequest(new
            {
                success = false,
                message = "Failed to fetch Upcoming Class Count By Instructor"
            });
        }
        #endregion


        #region User Count By Instructor
        [HttpGet("UserCountByInstructor/{instructorId}")]
        public async Task<IActionResult> UserCountByInstructor(string instructorId)
        {
            var classCount = await _instructorRepo.UserCountByInstructor(instructorId);
            if (classCount != -1)
            {
                return Ok(new
                {
                    success = true,
                    message = "User Count By Instructor fetched successfully",
                    count = classCount
                });
            }

            return BadRequest(new
            {
                success = false,
                message = "Failed to fetch User Count By Instructor"
            });
        }
        #endregion


        #region Upcoming Class Details By Instructor
        [HttpGet("UpcomingClassDetailsByInstructor/{instructorId}")]
        // [Authorize]
        public async Task<IActionResult> UpcomingClassDetailsByInstructor(string instructorId)
        {
            List<Class> upcomingClassList = await _instructorRepo.UpcomingClassDetailsByInstructor(instructorId);
            if (upcomingClassList != null)
            {
                return Ok(new
                {
                    success = true,
                    message = "Upcoming Class Details fetched successfully.",
                    data = upcomingClassList
                });
            }

            return Ok(new
            {
                success = false,
                message = "Error occured while fetching upcoming class details."
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
                return NotFound(new { success = false, message = "Instructor not found." });
            }

            var result = await _instructorRepo.ApproveInstructor(id);
            if (result)
            {
                return Ok(new { success = true, message = "Instructor approved, Approval mail send successfully!." });
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
                return NotFound(new { success = false, message = "Instructor not found." });
            }

            var result = await _instructorRepo.DisapproveInstructor(id);
            if (result)
            {
                return Ok(new { success = true, message = "Instructor disapproved, Disapprove mail send successfully!." });
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
                return NotFound(new { success = false, message = "Instructor not found." });
            }

            var result = await _instructorRepo.SuspendInstructor(id);
            if (result)
            {
                return Ok(new { success = true, message = "Instructor Suspended successfully!" });
            }
            return BadRequest(new { message = "Failed to Suspennd instructor." });
        }
        #endregion
        #endregion

        #region Blog 
        [HttpPost]
        [Route("SaveDraft")]

        public async Task<IActionResult> SaveDraft(BlogPost blogSpot)
        {
            return Ok();
        }


        [HttpPost]
        [Route("SaveImage")]

        public async Task<IActionResult> SaveImage(Images image)
        {
            var fileName = "";
            if (image.BlogImageFile != null && image.BlogImageFile.Length > 0)
            {
                Directory.CreateDirectory("../MVC/wwwroot/BlogImages");

                fileName = Guid.NewGuid() + System.IO.Path.GetExtension(image.BlogImageFile.FileName);

                var filePath = System.IO.Path.Combine("../MVC/wwwroot/BlogImages", fileName);
                image.ThumbnailPath = filePath;

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    image.BlogImageFile.CopyTo(stream);
                }
            }
            return Ok(new { success = "True", Path = $"http://localhost:8080/BlogImages/{fileName}" });
        }
        #endregion
    }

}

public class Images
{
    public string? ThumbnailPath { get; set; }

    // For file upload (not mapped to database)
    // [System.ComponentModel.DataAnnotations.Display(Name = "Thumbnail")]
    public IFormFile? BlogImageFile { get; set; }


}
public class BlogPost
{
    public int? Id { get; set; }

    // [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Title is required")]
    // [System.ComponentModel.DataAnnotations.StringLength(200, ErrorMessage = "Title cannot be longer than 200 characters")]
    public string? Title { get; set; }

    // [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Description is required")]
    public string? Description { get; set; }

    public string? Labels { get; set; }

    public string? ThumbnailPath { get; set; }

    // For file upload (not mapped to database)
    // [System.ComponentModel.DataAnnotations.Display(Name = "Thumbnail")]
    public IFormFile? ThumbnailFile { get; set; }


    public bool? IsCompleted { get; set; }

    public DateTime? CreatedAt { get; set; } = DateTime.Now;

    public DateTime? UpdatedAt { get; set; }
}

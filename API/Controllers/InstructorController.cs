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
        public async Task<IActionResult> DisapproveInstructor(string id,[FromForm] string reason)
        {
            var instructor = await _instructorRepo.GetOneInstructor(id);
            if (instructor == null)
            {
                return NotFound(new { success = false, message = "Instructor not found." });
            }

            var result = await _instructorRepo.DisapproveInstructor(id,reason);
            if (result)
            {
                return Ok(new {success = true, message = "Instructor disapproved, Disapprove mail send successfully!" });
            }
            return BadRequest(new { message = "Failed to disapprove instructor." });
        }
        #endregion

        #region Suspend Instructor
        [HttpPost("InstructorSuspend/{id}")]
        public async Task<IActionResult> SuspendInstructor(string id,[FromForm]string reason)
        {
            var instructor = await _instructorRepo.GetOneInstructor(id);
            if (instructor == null)
            {
                return NotFound(new { success = false, message = "Instructor not found." });
            }

            var result = await _instructorRepo.SuspendInstructor(id,reason);
            if (result)
            {
                return Ok(new {success = true, message = "Instructor Suspended,Mail send successfully!" });
            }
            return BadRequest(new { message = "Failed to Suspennd instructor." });
        }
        #endregion
        
        #region Activate Instructor
        [HttpPost("InstructorActivate/{id}")]
        public async Task<IActionResult> ActivateInstructor(string id)
        {
            var instructor = await _instructorRepo.GetOneInstructor(id);
            if (instructor == null)
            {
                return NotFound(new {success = false, message = "Instructor not found." });
            }

            var result = await _instructorRepo.ActivateInstructor(id);
            if (result)
            {
                return Ok(new {success = true, message = "Instructor Activated,Mail send successfully!" });
            }
            return BadRequest(new { message = "Failed to Activate instructor." });
        }
        #endregion

        #endregion

        #region Blog 
        [HttpPost]
        [Route("SaveDraft")]

        public async Task<IActionResult> SaveDraft(BlogPost blogpost)
        {
            if (blogpost.c_blog_author_id >0) {
                try {

                    var fileName = "";
                    if (blogpost.ThumbnailFile != null && blogpost.ThumbnailFile.Length > 0)
                    {
                        Directory.CreateDirectory("../MVC/wwwroot/BlogImages/Thumbnails");

                        fileName = Guid.NewGuid() + System.IO.Path.GetExtension(blogpost.ThumbnailFile.FileName);

                        var filePath = System.IO.Path.Combine("../MVC/wwwroot/BlogImages/Thumbnails", fileName);
                        blogpost.c_thumbnail = fileName;

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            blogpost.ThumbnailFile.CopyTo(stream);
                        }
                    } else {
                        if (blogpost.c_blog_id <0) {
                            blogpost.c_thumbnail = "default.png";
                        }
                    }

                    // Convert c_content to Base64
                    if (!string.IsNullOrEmpty(blogpost.c_content))
                    {
                        var contentBytes = System.Text.Encoding.UTF8.GetBytes(blogpost.c_content);
                        blogpost.c_content = Convert.ToBase64String(contentBytes);
                    }

                    if (blogpost.c_blog_id > 0) {
                        var result = await _instructorRepo.UpdateBlogDraft(blogpost);
                        if (result) {
                            return Ok(new {
                                success=true,
                                message="Successfully Updated the blog as draft.",
                                blog_id=blogpost.c_blog_id
                            });
                        } else {
                            return StatusCode(500, new { success = false, message = "An unexpected error occurred while updating your blog." });
                        }
                    } else {
                        blogpost.c_source_url = $"blog-post-{Convert.ToString(Guid.NewGuid())}";
                        // var result = Convert.ToInt32(_instructorRepo.SaveBlogDraft(blogpost));
                        var result = await _instructorRepo.SaveBlogDraft(blogpost);
                        if (result > 0 ) {
                            return Ok(new {
                                success=true,
                                message="Successfully Saved the blog as draft.",
                                blog_id=result
                            });
                        } else {
                            return StatusCode(500, new { success = false, message = "An unexpected error occurred while saving your blog as draft." });
                        }
                    }
                } 
                catch (Exception e) {
                    Console.WriteLine(e.Message);
                    return StatusCode(500, new { success = false, message = "An unexpected error occurred." });
                }
            } else {
                return BadRequest(new {success=false, message="Invalid Blog Data"});    
            }
        }

        [HttpPost]
        [Route("PublishBlog")]
        public async Task<IActionResult> PublishBlog(BlogPost blogpost)
        {
            if (blogpost.c_blog_author_id >0) {
                try {
                    var fileName = "";
                    if (blogpost.ThumbnailFile != null && blogpost.ThumbnailFile.Length > 0)
                    {
                        Directory.CreateDirectory("../MVC/wwwroot/BlogImages/Thumbnails");

                        fileName = Guid.NewGuid() + System.IO.Path.GetExtension(blogpost.ThumbnailFile.FileName);

                        var filePath = System.IO.Path.Combine("../MVC/wwwroot/BlogImages/Thumbnails", fileName);
                        blogpost.c_thumbnail = filePath;

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            blogpost.ThumbnailFile.CopyTo(stream);
                        }
                    } else {
                        blogpost.c_thumbnail = "http://localhost:8081/BlogImages/Thumbnails/default.png";
                    }

                    if (blogpost.c_blog_id > 0) {
                        var result = Convert.ToBoolean(_instructorRepo.PublishBlog(blogpost));
                        if (result) {
                            return Ok(new {
                                success=true,
                                message="Successfully Published the blog.",
                                blog_url=blogpost.c_source_url,
                                return_url="instructor"
                            });
                        } else {
                            return StatusCode(500, new { success = false, message = "An unexpected error occurred while publishing your blog." });
                        }
                    } else {
                        return StatusCode(500, new { success = false, message = "An unexpected error occurred while saving your blog as draft." });
                    }
                } 
                catch (Exception e) {
                    Console.WriteLine(e);
                    return StatusCode(500, new { success = false, message = "An unexpected error occurred." });
                }
            } else {
                return BadRequest(new {success=false, message="Invalid Blog Data"});    
            }
        }


        [HttpPost]
        [Route("SaveImage")]

        public async Task<IActionResult> SaveImage(vm_blog_image image)
        {
            var fileName = "";
            if (image.BlogImageFile != null && image.BlogImageFile.Length > 0)
            {
                Directory.CreateDirectory("../MVC/wwwroot/BlogImages/TempImages");

                fileName = Guid.NewGuid() + System.IO.Path.GetExtension(image.BlogImageFile.FileName);

                var filePath = System.IO.Path.Combine("../MVC/wwwroot/BlogImages/TempImages", fileName);
                image.blog_image_path = filePath;

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    image.BlogImageFile.CopyTo(stream);
                }
            }
            return Ok(new { success = true, Path = $"http://localhost:8081/BlogImages/TempImages/{fileName}" });
        }


        [HttpPost]
        [Route("GetInstructorBlogsById")]

        public async Task<IActionResult> GetInstructorBlogsById(string instructor_id)
        {
            if(instructor_id != null) {
                try {
                    var blog_list = await _instructorRepo.GetBlogsByInstructorId(Convert.ToInt32(instructor_id));

                    if (blog_list.Count == 0)
                    {
                        return BadRequest(new { success = false, message = "No blogs found.", data = blog_list });
                    }
                    return Ok(new
                    {
                        success = true,
                        message = "Fetched All blogs.",
                        data = new
                        {
                            count = blog_list.Count,
                            entries = blog_list
                        }
                    });

                } catch {
                    return StatusCode(500, new { success=false, message="Something went wrong fetching your blogs, please try again later."});
                }
            } else {
                return BadRequest(new {success=false, message="Instructor Id is required"});
            }
        }


        [HttpPost]
        [Route("GetBlogById")]

        public async Task<IActionResult> GetBlogById(string blog_id)
        {
            if(blog_id != null) {
                try {
                    var blog = await _instructorRepo.GetBlogById(Convert.ToInt32(blog_id));

                    if (blog == null)
                    {
                        return BadRequest(new { success = false, message = "No blog found for the given id.", data = blog });
                    }
                    return Ok(new
                    {
                        success = true,
                        message = "Fetched blog.",
                        data = new
                        {
                            count = 1,
                            entries = blog
                        }
                    });

                } catch {
                    return StatusCode(500, new { success=false, message="Something went wrong fetching your blog, please try again later."});
                }
            } else {
                return BadRequest(new {success=false, message="Blog Id is required"});
            }
        }

        #endregion

        #region Get Typewise Class Count
		[HttpGet("typewise-class-count/{instructorId}")]
		public async Task<IActionResult> GetTypewiseClassCount(string instructorId)
		{
			try
			{
				// Fetch user activity data for the last 7 days
				var typewiseClassCount = await _instructorRepo.GetTypewiseClassCount(instructorId);

				return Ok(new { success = true, message = "Typewise Class Count data retrieved successfully", data = typewiseClassCount });
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { success = false, message = "An error occurred", error = ex.Message });
			}
		}
		#endregion
    }

}
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IO;

using Repo;
using Nest;

namespace API
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly IBlogInterface _blogRepo;

        public BlogController(IBlogInterface blogRepo)
        {
            _blogRepo = blogRepo;
        }
        #region Blog 
        [HttpPost]
        [Route("SaveDraft")]

        public async Task<IActionResult> SaveDraft(BlogPost blogpost)
        {
            if (blogpost.c_blog_author_id > 0)
            {
                try
                {
                    // Set Thumbnail Name
                    var fileName = "";
                    if (blogpost.ThumbnailFile != null && blogpost.ThumbnailFile.Length > 0)
                    {
                        fileName = Guid.NewGuid() + System.IO.Path.GetExtension(blogpost.ThumbnailFile.FileName);
                        blogpost.c_thumbnail = fileName;
                    }
                    else
                    {
                        if (blogpost.c_blog_id < 0)
                        {
                            blogpost.c_thumbnail = "default.png";
                        }
                    }

                    // Convert c_content to Base64
                    if (!string.IsNullOrEmpty(blogpost.c_content))
                    {
                        var contentBytes = System.Text.Encoding.UTF8.GetBytes(blogpost.c_content);
                        blogpost.c_content = Convert.ToBase64String(contentBytes);
                    }

                    var returnDict = new Dictionary<string, object>();

                    if (blogpost.c_blog_id > 0)
                    {
                        var result = await _blogRepo.UpdateBlogDraft(blogpost);
                        if (result)
                        {
                            returnDict["success"] = true;
                            returnDict["message"] = "Successfully updated the blog as draft.";
                            returnDict["blog_id"] = blogpost.c_blog_id;
                        }
                        else
                        {
                            return StatusCode(500, new { success = false, message = "An unexpected error occurred while updating your blog." });
                        }
                    }
                    else
                    {
                        blogpost.c_source_url = $"blog-post-{Convert.ToString(Guid.NewGuid())}";
                        // var result = Convert.ToInt32(_blogRepo.SaveBlogDraft(blogpost));
                        var result = await _blogRepo.SaveBlogDraft(blogpost);
                        if (result > 0)
                        {
                            blogpost.c_blog_id = result;
                            returnDict["success"] = true;
                            returnDict["message"] = "Successfully Saved the blog as draft.";
                            returnDict["blog_id"] = blogpost.c_blog_id;
                        }
                        else
                        {
                            return StatusCode(500, new { success = false, message = "An unexpected error occurred while saving your blog as draft." });
                        }
                    }

                    // Delete Previous Thumbnail and Store New one 
                    if (blogpost.ThumbnailFile != null && blogpost.ThumbnailFile.Length > 0 && blogpost.c_blog_id > 0)
                    {
                        // DeleteBlogThumbnails(blogpost.c_blog_id.ToString());
                        var webRootPath = Path.Combine("../MVC", "wwwroot");
                        var thumbnailDir = Path.Combine(webRootPath, "BlogImages", "Thumbnails", blogpost.c_blog_id.ToString());

                        if (Directory.Exists(thumbnailDir))
                        {
                            var files = Directory.GetFiles(thumbnailDir);
                            foreach (var file in files)
                            {
                                try
                                {
                                    System.IO.File.Delete(file);
                                }
                                catch (Exception ex)
                                {
                                    // Handle exceptions (log or throw)
                                    Console.WriteLine($"Error deleting file {file}: {ex.Message}");
                                }
                            }
                        }
                        Directory.CreateDirectory($"../MVC/wwwroot/BlogImages/Thumbnails/{blogpost.c_blog_id}");

                        var filePath = System.IO.Path.Combine($"../MVC/wwwroot/BlogImages/Thumbnails/{blogpost.c_blog_id}", fileName);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            blogpost.ThumbnailFile.CopyTo(stream);
                        }
                    }

                    // Return here
                    return Ok(returnDict);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                    return StatusCode(500, new { success = false, message = "An unexpected error occurred." });
                }
            }
            else
            {
                return BadRequest(new { success = false, message = "Invalid Blog Data" });
            }
        }

        [HttpPost]
        [Route("PublishBlog")]
        public async Task<IActionResult> PublishBlog(BlogPost blogpost)
        {
            if (blogpost.c_blog_author_id > 0)
            {
                try
                {

                    // Set Thumbnail Name
                    var fileName = "";
                    if (blogpost.ThumbnailFile != null && blogpost.ThumbnailFile.Length > 0)
                    {
                        fileName = Guid.NewGuid() + System.IO.Path.GetExtension(blogpost.ThumbnailFile.FileName);
                        blogpost.c_thumbnail = fileName;
                    }
                    else
                    {
                        if (blogpost.c_blog_id < 0)
                        {
                            blogpost.c_thumbnail = "default.png";
                        }
                    }

                    // Convert c_content to Base64
                    if (!string.IsNullOrEmpty(blogpost.c_content))
                    {
                        var contentBytes = System.Text.Encoding.UTF8.GetBytes(blogpost.c_content);
                        blogpost.c_content = Convert.ToBase64String(contentBytes);
                    }

                    // If User directly hits 'Publish'. 
                    if (blogpost.c_blog_id <= 0)
                    {

                        // Create a new source url for new blog.
                        blogpost.c_source_url = $"blog-post-{Convert.ToString(Guid.NewGuid())}";

                        var result = await _blogRepo.SaveBlogDraft(blogpost);
                        if (result > 0)
                        {
                            blogpost.c_blog_id = result;
                        }
                        else
                        {
                            return StatusCode(500, new { success = false, message = "An unexpected error occurred while saving your blog." });
                        }
                    }

                    // Delete Previous Thumbnail and Store New one 
                    if (blogpost.ThumbnailFile != null && blogpost.ThumbnailFile.Length > 0 && blogpost.c_blog_id > 0)
                    {
                        // DeleteBlogThumbnails(blogpost.c_blog_id.ToString());
                        var webRootPath = Path.Combine("../MVC", "wwwroot");
                        var thumbnailDir = Path.Combine(webRootPath, "BlogImages", "Thumbnails", blogpost.c_blog_id.ToString());

                        if (Directory.Exists(thumbnailDir))
                        {
                            var files = Directory.GetFiles(thumbnailDir);
                            foreach (var file in files)
                            {
                                try
                                {
                                    System.IO.File.Delete(file);
                                }
                                catch (Exception ex)
                                {
                                    // Handle exceptions (log or throw)
                                    Console.WriteLine($"Error deleting file {file}: {ex.Message}");
                                }
                            }
                        }
                        Directory.CreateDirectory($"../MVC/wwwroot/BlogImages/Thumbnails/{blogpost.c_blog_id}");

                        var filePath = System.IO.Path.Combine($"../MVC/wwwroot/BlogImages/Thumbnails/{blogpost.c_blog_id}", fileName);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            blogpost.ThumbnailFile.CopyTo(stream);
                        }
                    }

                    // If User hits 'Publish' after draft. 
                    if (blogpost.c_blog_id > 0)
                    {
                        var result = await _blogRepo.PublishBlog(blogpost);
                        if (result)
                        {
                            return Ok(new
                            {
                                success = true,
                                message = "Successfully Published the blog.",
                                blog_id = blogpost.c_blog_id,
                                blog_url = $"{blogpost.c_source_url}",
                                return_url = "instructor"
                            });
                        }
                        else
                        {
                            return StatusCode(500, new { success = false, message = "An unexpected error occurred while publishing your blog." });
                        }
                    }
                    else
                    {
                        return StatusCode(500, new { success = false, message = "An unexpected error occurred while saving your blog as draft." });
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    return StatusCode(500, new { success = false, message = "An unexpected error occurred." });
                }
            }
            else
            {
                return BadRequest(new { success = false, message = "Invalid Blog Data" });
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
            if (instructor_id != null)
            {
                try
                {
                    var blog_list = await _blogRepo.GetBlogsByInstructorId(Convert.ToInt32(instructor_id));

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

                }
                catch
                {
                    return StatusCode(500, new { success = false, message = "Something went wrong fetching your blogs, please try again later." });
                }
            }
            else
            {
                return BadRequest(new { success = false, message = "Instructor Id is required" });
            }
        }

        [HttpGet]
        [Route("GetBlogsForUser")]

        public async Task<IActionResult> GetBlogsForUser()
        {
            try
            {
                var blog_list = await _blogRepo.GetBlogsForUser();

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

            }
            catch
            {
                return StatusCode(500, new { success = false, message = "Something went wrong fetching your blogs, please try again later." });
            }
        }

        [HttpPost]
        [Route("fetchBookmarkedBlogsForUser")]

        public async Task<IActionResult> FetchBookmarkedBlogsForUser(string user_id)
        {
            if (Convert.ToInt32(user_id) != null)
            {
                try
                {
                    var blog_list = await _blogRepo.FetchBookmarkedBlogsForUser(Convert.ToInt32(user_id), "user");

                    if (blog_list.Count == 0)
                    {
                        return BadRequest(new { success = false, message = "You Haven't added any blog to you bookmark list.", data = blog_list });
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

                }
                catch
                {
                    return StatusCode(500, new { success = false, message = "Something went wrong fetching your blogs, please try again later." });
                }
            }
            else
            {
                return BadRequest(new { success = false, message = "Instructor Id is required" });
            }
        }



        [HttpPost]
        [Route("GetBlogById")]

        public async Task<IActionResult> GetBlogById(string blog_id)
        {
            if (blog_id != null)
            {
                try
                {
                    var blog = await _blogRepo.GetBlogById(Convert.ToInt32(blog_id));

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

                }
                catch
                {
                    return StatusCode(500, new { success = false, message = "Something went wrong fetching your blog, please try again later." });
                }
            }
            else
            {
                return BadRequest(new { success = false, message = "Blog Id is required" });
            }
        }

        [HttpDelete("delete-blog/{blog_id}")]
        public async Task<IActionResult> DeleteBlog(int blog_id)
        {
            try
            {
                int result = await _blogRepo.DeleteBlog(blog_id);

                if (result > 0)
                    return Ok(new { success=true, message = "Blog deleted successfully." });
                else
                    return NotFound(new { success=false, message = "Blog not found or already deleted." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success=false, message = "An error occurred while deleting the blog.", error = ex.Message });
            }
        }


        [HttpPost]
        [Route("AddNewComment")]
        public async Task<IActionResult> AddNewComment(BlogComment comment)
        {
            if(comment.blogId != null && comment.userId != null) {
                try {

                    if (comment.parentCommentId == null || comment.parentCommentId <= 0) {
                        comment.parentCommentId = -1; // Suggest its the Parent Comment itself
                    }
                    var result = await _blogRepo.AddNewComment(comment);

                    if (result.commentId < 0)
                    {
                        return BadRequest(new { success = false, message = "Unable to add comment."});
                    }
                    return Ok(new
                    {
                        success = true,
                        message = "Comment Added.",
                        comment = result
                    });

                } catch {
                    return StatusCode(500, new { success=false, message="Something went wrong fetching your blog, please try again later."});
                }
            } else {
                return BadRequest(new {success=false, message="Blog Id is required"});
            }
        }

        [HttpPost]
        [Route("fetchBlogComments")]
        public async Task<IActionResult> fetchBlogComments(string blogId_)
        {
            var blogId = Convert.ToInt32(blogId_);
            if(blogId != null && blogId > 0) {
                try {
                    var comments = await _blogRepo.fetchBlogComments(blogId);

                    if (comments.Count == 0)
                    {
                        return BadRequest(new { success = false, message = "No comments found.", data = comments });
                    }
                    return Ok(new
                    {
                        success = true,
                        message = "Fetched All comments.",
                        data = new
                        {
                            count = comments.Count,
                            entries = comments
                        }
                    });

                } catch {
                    return StatusCode(500, new { success=false, message="Something went wrong fetching comments, please try again later."});
                }
            } else {
                return BadRequest(new {success=false, message="Blog Id is required"});
            }
        }


        [HttpPost]
        [Route("fetchBlogByUri")]
        public async Task<IActionResult> fetchBlogByUri(string source_uri)
        {
            if(source_uri != null) {
                try {
                    var blog = await _blogRepo.fetchBlogByUri(source_uri);

                    if (blog.c_blog_id == null)
                    {
                        return BadRequest(new { success = false, message = "No blog found on the given URI."});
                    }
                    return Ok(new
                    {
                        success = true,
                        message = "Blog Fetched.",
                        data = blog
                    });

                } catch {
                    return StatusCode(500, new { success=false, message="Something went wrong fetching your blog, please try again later."});
                }
            } else {
                return BadRequest(new {success=false, message="Blog Id is required"});
            }
        }

        [HttpPost]
        [Route("fetchBlogAuthorById")]
        public async Task<IActionResult> fetchBlogAuthorById(string author_id)
        {
            if(author_id != null) {
                try {
                    var author_info = await _blogRepo.fetchBlogAuthorById(Convert.ToInt32(author_id));

                    if (author_info.instructorId == null)
                    {
                        return BadRequest(new { success = false, message = "Unable to fetch author info"});
                    }
                    return Ok(new
                    {
                        success = true,
                        message = "Author Info Fetched.",
                        data = author_info
                    });

                } catch {
                    return StatusCode(500, new { success=false, message="Something went wrong fetching author info, please try again later."});
                }
            } else {
                return BadRequest(new {success=false, message="Author Id is required"});
            }
        }

        [HttpPost]
        [Route("RegisterLike")]
        public async Task<IActionResult> RegisterLike([FromBody] vm_RegisterLike like_req)
        {
            if(like_req.blogId != null && like_req.userId != null && like_req.liked != null) {
                try {

                    var result = await _blogRepo.RegisterLike(like_req);

                    if (result <= 0)
                    {
                        return BadRequest(new { success = false, message = "Unable to register your like at this moment, Please try again later."});
                    }
                    return Ok(new
                    {
                        success = true,
                        message = "Like Preference Updated.",
                    });

                } catch {
                    return StatusCode(500, new { success=false, message="Something went wrong, please try again later."});
                }
            } else {
                return BadRequest(new {success=false, message="Invalid Data Provided."});
            }
        }
        #endregion

        [HttpPost]
        [Route("fetchLikeStatusForBlog")]
        public async Task<IActionResult> fetchLikeStatusForBlog(vm_RegisterLike like_info)
        {
            if(like_info.blogId != null && like_info.userId != null && like_info.userRole != null) {
                try {

                    var result = await _blogRepo.fetchLikeStatusForBlog(like_info);

                    if (result.likeId <0 )
                    {
                        return BadRequest(new { success = false, message = "Unable to fetch like status, Please try again later.", data=result});
                    }
                    return Ok(new
                    {
                        success = true,
                        message = "successfully fetched your like status for this blog.",
                        data = result
                    });

                } catch {
                    return StatusCode(500, new { success=false, message="Something went wrong, please try again later."});
                }
            } else {
                return BadRequest(new {success=false, message="Invalid Data Provided."});
            }
        }

        [HttpPost]
        [Route("RegisterBookmark")]
        public async Task<IActionResult> RegisterBookmark([FromBody] vm_RegisterBookmark bookmark_req)
        {
            if (bookmark_req.blogId != 0 && bookmark_req.userId != 0)
            {
                try
                {
                    var result = await _blogRepo.RegisterBookmark(bookmark_req);

                    if (result <= 0)
                    {
                        return BadRequest(new
                        {
                            success = false,
                            message = "Unable to register your bookmark at this moment. Please try again later."
                        });
                    }

                    return Ok(new
                    {
                        success = true,
                        message = "Bookmark status updated."
                    });
                }
                catch
                {
                    return StatusCode(500, new
                    {
                        success = false,
                        message = "Something went wrong, please try again later."
                    });
                }
            }
            else
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid data provided."
                });
            }
        }

        [HttpPost]
        [Route("fetchBookmarkStatusForBlog")]
        public async Task<IActionResult> FetchBookmarkStatusForBlog([FromBody] vm_RegisterBookmark bookmark_info)
        {
            if (bookmark_info.blogId != 0 && bookmark_info.userId != 0 && !string.IsNullOrEmpty(bookmark_info.userRole))
            {
                try
                {
                    var result = await _blogRepo.FetchBookmarkStatusForBlog(bookmark_info);

                    if (result.bookmarkId < 0)
                    {
                        return BadRequest(new
                        {
                            success = false,
                            message = "Unable to fetch bookmark status. Please try again later.",
                            data = result
                        });
                    }

                    return Ok(new
                    {
                        success = true,
                        message = "Successfully fetched your bookmark status for this blog.",
                        data = result
                    });
                }
                catch
                {
                    return StatusCode(500, new
                    {
                        success = false,
                        message = "Something went wrong, please try again later."
                    });
                }
            }
            else
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid data provided."
                });
            }
        }

    }
}
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Repo;

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

        // DRY: Centralized API response handler
        private IActionResult ApiResponse(bool success, string message, object data = null, int statusCode = 200)
        {
            var result = new { success, message, data };
            return statusCode switch
            {
                200 => Ok(result),
                400 => BadRequest(result),
                404 => NotFound(result),
                _ => StatusCode(statusCode, result)
            };
        }

        #region Blog Draft & Publish

        [HttpPost("SaveDraft")]
        public async Task<IActionResult> SaveDraft(BlogPost blogpost)
        {
            if (blogpost.c_blog_author_id <= 0)
                return ApiResponse(false, "Invalid Blog Data", statusCode: 400);

            try
            {
                // Set Thumbnail Name
                var fileName = "";
                if (blogpost.ThumbnailFile != null && blogpost.ThumbnailFile.Length > 0)
                {
                    fileName = Guid.NewGuid() + Path.GetExtension(blogpost.ThumbnailFile.FileName);
                    blogpost.c_thumbnail = fileName;
                }
                else if (blogpost.c_blog_id < 0)
                {
                    blogpost.c_thumbnail = "default.png";
                }

                // Convert c_content to Base64
                if (!string.IsNullOrEmpty(blogpost.c_content))
                    blogpost.c_content = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(blogpost.c_content));

                var returnDict = new Dictionary<string, object>();
                bool isUpdate = blogpost.c_blog_id > 0;
                if (isUpdate)
                {
                    var updateResult = await _blogRepo.UpdateBlogDraft(blogpost);
                    if (!updateResult)
                        return ApiResponse(false, "An unexpected error occurred while updating your blog.", statusCode: 500);
                    returnDict["message"] = "Successfully updated the blog as draft.";
                    returnDict["blog_id"] = blogpost.c_blog_id;
                }
                else
                {
                    if (blogpost.c_blog_id <= 0)
                    {
                        blogpost.c_source_url = $"blog-post-{Guid.NewGuid()}";
                        var draftSaveResult = await _blogRepo.SaveBlogDraft(blogpost);
                        if (draftSaveResult <= 0)
                            return ApiResponse(false, "An unexpected error occurred while saving your blog.", statusCode: 500);
                        blogpost.c_blog_id = draftSaveResult;
                    }
                    blogpost.c_source_url = $"blog-post-{Guid.NewGuid()}";
                    var draftSaveResult2 = await _blogRepo.SaveBlogDraft(blogpost);
                    if (draftSaveResult2 <= 0)
                        return ApiResponse(false, "An unexpected error occurred while saving your blog as draft.", statusCode: 500);
                    blogpost.c_blog_id = draftSaveResult2;
                    returnDict["message"] = "Successfully Saved the blog as draft.";
                    returnDict["blog_id"] = blogpost.c_blog_id;
                }

                // Handle thumbnail file
                if (blogpost.ThumbnailFile != null && blogpost.ThumbnailFile.Length > 0 && blogpost.c_blog_id > 0)
                {
                    // Use explicit conversion for non-nullable int parameter
                    SaveThumbnail(blogpost.c_blog_id.Value, fileName, blogpost.ThumbnailFile);
                }

                // FIX FOR LINE 88: Only call the method if c_blog_id is not null and use .Value
                if (blogpost.c_blog_id.HasValue)
                {
                    var blog = await _blogRepo.GetBlogById(blogpost.c_blog_id.Value);
                }

                // FIX: Use explicit Value property for nullable int
                if (blogpost.c_blog_author_id.HasValue)
                {
                    await _blogRepo.GetBlogsByInstructorId(blogpost.c_blog_author_id.Value);
                }

                return ApiResponse(true, "Draft saved successfully", returnDict);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return ApiResponse(false, "An unexpected error occurred.", statusCode: 500);
            }
        }

        [HttpPost("PublishBlog")]
        public async Task<IActionResult> PublishBlog(BlogPost blogpost)
        {
            if (blogpost.c_blog_author_id <= 0)
                return ApiResponse(false, "Invalid Blog Data", statusCode: 400);

            try
            {
                var fileName = "";
                if (blogpost.ThumbnailFile != null && blogpost.ThumbnailFile.Length > 0)
                {
                    fileName = Guid.NewGuid() + Path.GetExtension(blogpost.ThumbnailFile.FileName);
                    blogpost.c_thumbnail = fileName;
                }
                else if (blogpost.c_blog_id < 0)
                {
                    blogpost.c_thumbnail = "default.png";
                }

                if (!string.IsNullOrEmpty(blogpost.c_content))
                    blogpost.c_content = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(blogpost.c_content));

                // If new blog, save as draft first
                if (blogpost.c_blog_id <= 0)
                {
                    blogpost.c_source_url = $"blog-post-{Guid.NewGuid()}";
                    var draftResult = await _blogRepo.SaveBlogDraft(blogpost);
                    if (draftResult <= 0)
                        return ApiResponse(false, "An unexpected error occurred while saving your blog.", statusCode: 500);
                    blogpost.c_blog_id = draftResult;
                }

                if (blogpost.ThumbnailFile != null && blogpost.ThumbnailFile.Length > 0 && blogpost.c_blog_id > 0)
                {
                    SaveThumbnail(blogpost.c_blog_id.Value, fileName, blogpost.ThumbnailFile);
                }

                var publishResult = await _blogRepo.PublishBlog(blogpost);
                if (!publishResult)
                    return ApiResponse(false, "An unexpected error occurred while publishing your blog.", statusCode: 500);

                if (blogpost.c_blog_id.HasValue)
                {
                    await _blogRepo.GetBlogById(blogpost.c_blog_id.Value);
                }

                // FIX FOR LINE 140: Use .Value to unwrap nullable int
                if (blogpost.c_blog_author_id.HasValue)
                {
                    var instructorBlogs = await _blogRepo.GetBlogsByInstructorId(blogpost.c_blog_author_id.Value);
                }

                return ApiResponse(true, "Successfully Published the blog.", new
                {
                    blog_id = blogpost.c_blog_id,
                    blog_url = blogpost.c_source_url,
                    return_url = "instructor"
                });
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return ApiResponse(false, "An unexpected error occurred.", statusCode: 500);
            }
        }

        private void SaveThumbnail(int blogId, string fileName, IFormFile thumbnailFile)
        {
            var webRootPath = Path.Combine("../MVC", "wwwroot");
            var thumbnailDir = Path.Combine(webRootPath, "BlogImages", "Thumbnails", blogId.ToString());

            if (Directory.Exists(thumbnailDir))
            {
                foreach (var file in Directory.GetFiles(thumbnailDir))
                {
                    try { System.IO.File.Delete(file); }
                    catch (Exception ex) { Console.WriteLine($"Error deleting file {file}: {ex.Message}"); }
                }
            }
            Directory.CreateDirectory(thumbnailDir);

            var filePath = Path.Combine(thumbnailDir, fileName);
            using var stream = new FileStream(filePath, FileMode.Create);
            thumbnailFile.CopyTo(stream);
        }

        #endregion

        [HttpPost("SaveImage")]
        public IActionResult SaveImage(vm_blog_image image)
        {
            if (image.BlogImageFile == null || image.BlogImageFile.Length == 0)
                return ApiResponse(false, "No image provided", statusCode: 400);

            Directory.CreateDirectory("../MVC/wwwroot/BlogImages/TempImages");
            var fileName = Guid.NewGuid() + Path.GetExtension(image.BlogImageFile.FileName);
            var filePath = Path.Combine("../MVC/wwwroot/BlogImages/TempImages", fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
                image.BlogImageFile.CopyTo(stream);

            return ApiResponse(true, "Image saved", new { Path = $"http://localhost:8081/BlogImages/TempImages/{fileName}" });
        }

        [HttpPost("GetInstructorBlogsById")]
        public async Task<IActionResult> GetInstructorBlogsById(string instructor_id)
        {
            if (string.IsNullOrEmpty(instructor_id))
                return ApiResponse(false, "Instructor Id is required", statusCode: 400);

            try
            {
                int instructorId = Convert.ToInt32(instructor_id);
                var blogList = await _blogRepo.GetBlogsByInstructorId(instructorId);
                if (blogList.Count == 0)
                    return ApiResponse(false, "No blogs found.", blogList, 404);

                return ApiResponse(true, "Fetched All blogs.", new { count = blogList.Count, entries = blogList });
            }
            catch (Exception ex)
            {
                return ApiResponse(false, $"Something went wrong: {ex.Message}", statusCode: 500);
            }
        }

        [HttpGet("GetBlogsForUser")]
        public async Task<IActionResult> GetBlogsForUser()
        {
            try
            {
                var blogList = await _blogRepo.GetBlogsForUser();
                if (blogList.Count == 0)
                    return ApiResponse(false, "No blogs found.", blogList, 404);

                return ApiResponse(true, "Fetched All blogs.", new { count = blogList.Count, entries = blogList });
            }
            catch (Exception ex)
            {
                return ApiResponse(false, $"Something went wrong: {ex.Message}", statusCode: 500);
            }
        }

        [HttpPost("fetchBookmarkedBlogsForUser")]
        public async Task<IActionResult> FetchBookmarkedBlogsForUser(string user_id)
        {
            if (string.IsNullOrEmpty(user_id))
                return ApiResponse(false, "User Id is required", statusCode: 400);

            try
            {
                int userId = Convert.ToInt32(user_id);
                var blogList = await _blogRepo.FetchBookmarkedBlogsForUser(userId, "user");
                if (blogList.Count == 0)
                    return ApiResponse(false, "You haven't added any blog to your bookmark list.", blogList, 404);

                return ApiResponse(true, "Fetched All blogs.", new { count = blogList.Count, entries = blogList });
            }
            catch (Exception ex)
            {
                return ApiResponse(false, $"Something went wrong: {ex.Message}", statusCode: 500);
            }
        }

        [HttpPost("GetBlogById")]
        public async Task<IActionResult> GetBlogById(string blog_id)
        {
            if (string.IsNullOrEmpty(blog_id))
                return ApiResponse(false, "Blog Id is required", statusCode: 400);

            try
            {
                int blogId = Convert.ToInt32(blog_id);
                var blog = await _blogRepo.GetBlogById(blogId);
                if (blog == null)
                    return ApiResponse(false, "No blog found for the given id.", blog, 404);

                return ApiResponse(true, "Fetched blog.", new { count = 1, entries = blog });
            }
            catch (Exception ex)
            {
                return ApiResponse(false, $"Something went wrong: {ex.Message}", statusCode: 500);
            }
        }

        [HttpDelete("delete-blog/{blog_id}")]
        public async Task<IActionResult> DeleteBlog(int blog_id)
        {
            try
            {
                int result = await _blogRepo.DeleteBlog(blog_id);
                if (result > 0)
                    return ApiResponse(true, "Blog deleted successfully.");
                else
                    return ApiResponse(false, "Blog not found or already deleted.", statusCode: 404);
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "An error occurred while deleting the blog.", ex.Message, 500);
            }
        }

        [HttpPost("AddNewComment")]
        public async Task<IActionResult> AddNewComment(BlogComment comment)
        {
            if (comment.blogId == null || comment.userId == null)
                return ApiResponse(false, "Blog Id is required", statusCode: 400);

            try
            {
                if (comment.parentCommentId == null || comment.parentCommentId <= 0)
                    comment.parentCommentId = -1; // Parent Comment

                var result = await _blogRepo.AddNewComment(comment);
                if (result.commentId < 0)
                    return ApiResponse(false, "Unable to add comment.", statusCode: 400);

                return ApiResponse(true, "Comment Added.", result);
            }
            catch (Exception ex)
            {
                return ApiResponse(false, $"Something went wrong: {ex.Message}", statusCode: 500);
            }
        }

        [HttpPost("fetchBlogComments")]
        public async Task<IActionResult> fetchBlogComments(string blogId_)
        {
            if (!int.TryParse(blogId_, out var blogId) || blogId <= 0)
                return ApiResponse(false, "Blog Id is required", statusCode: 400);

            try
            {
                var comments = await _blogRepo.fetchBlogComments(blogId);
                if (comments.Count == 0)
                    return ApiResponse(false, "No comments found.", comments, 404);

                return ApiResponse(true, "Fetched All comments.", new { count = comments.Count, entries = comments });
            }
            catch (Exception ex)
            {
                return ApiResponse(false, $"Something went wrong: {ex.Message}", statusCode: 500);
            }
        }

        [HttpPost("fetchBlogByUri")]
        public async Task<IActionResult> fetchBlogByUri(string source_uri)
        {
            if (string.IsNullOrEmpty(source_uri))
                return ApiResponse(false, "Blog URI is required", statusCode: 400);

            try
            {
                var blog = await _blogRepo.fetchBlogByUri(source_uri);
                if (blog == null || blog.c_blog_id == null)
                    return ApiResponse(false, "No blog found on the given URI.", blog, 404);

                return ApiResponse(true, "Blog Fetched.", blog);
            }
            catch (Exception ex)
            {
                return ApiResponse(false, $"Something went wrong: {ex.Message}", statusCode: 500);
            }
        }

        [HttpPost("fetchBlogAuthorById")]
        public async Task<IActionResult> fetchBlogAuthorById(string author_id)
        {
            if (string.IsNullOrEmpty(author_id))
                return ApiResponse(false, "Author Id is required", statusCode: 400);

            try
            {
                int authorId = Convert.ToInt32(author_id);
                var authorInfo = await _blogRepo.fetchBlogAuthorById(authorId);
                if (authorInfo == null || authorInfo.instructorId == null)
                    return ApiResponse(false, "Unable to fetch author info", authorInfo, 404);

                return ApiResponse(true, "Author Info Fetched.", authorInfo);
            }
            catch (Exception ex)
            {
                return ApiResponse(false, $"Something went wrong: {ex.Message}", statusCode: 500);
            }
        }

        [HttpPost("RegisterLike")]
        public async Task<IActionResult> RegisterLike([FromBody] vm_RegisterLike like_req)
        {
            if (like_req.blogId == null || like_req.userId == null || like_req.liked == null)
                return ApiResponse(false, "Invalid Data Provided.", statusCode: 400);

            try
            {
                var result = await _blogRepo.RegisterLike(like_req);
                if (result <= 0)
                    return ApiResponse(false, "Unable to register your like at this moment, Please try again later.", statusCode: 400);

                return ApiResponse(true, "Like Preference Updated.");
            }
            catch (Exception ex)
            {
                return ApiResponse(false, $"Something went wrong: {ex.Message}", statusCode: 500);
            }
        }

        [HttpPost("fetchLikeStatusForBlog")]
        public async Task<IActionResult> fetchLikeStatusForBlog(vm_RegisterLike like_info)
        {
            if (like_info.blogId == null || like_info.userId == null || like_info.userRole == null)
                return ApiResponse(false, "Invalid Data Provided.", statusCode: 400);

            try
            {
                var result = await _blogRepo.fetchLikeStatusForBlog(like_info);
                if (result.likeId < 0)
                    return ApiResponse(false, "Unable to fetch like status, Please try again later.", result, 404);

                return ApiResponse(true, "Successfully fetched your like status for this blog.", result);
            }
            catch (Exception ex)
            {
                return ApiResponse(false, $"Something went wrong: {ex.Message}", statusCode: 500);
            }
        }

        [HttpPost("RegisterBookmark")]
        public async Task<IActionResult> RegisterBookmark([FromBody] vm_RegisterBookmark bookmark_req)
        {
            if (bookmark_req.blogId == 0 || bookmark_req.userId == 0)
                return ApiResponse(false, "Invalid data provided.", statusCode: 400);

            try
            {
                var result = await _blogRepo.RegisterBookmark(bookmark_req);
                if (result <= 0)
                    return ApiResponse(false, "Unable to register your bookmark at this moment. Please try again later.", statusCode: 400);

                return ApiResponse(true, "Bookmark status updated.");
            }
            catch (Exception ex)
            {
                return ApiResponse(false, $"Something went wrong: {ex.Message}", statusCode: 500);
            }
        }

        [HttpPost("fetchBookmarkStatusForBlog")]
        public async Task<IActionResult> FetchBookmarkStatusForBlog([FromBody] vm_RegisterBookmark bookmark_info)
        {
            if (bookmark_info.blogId == 0 || bookmark_info.userId == 0 || string.IsNullOrEmpty(bookmark_info.userRole))
                return ApiResponse(false, "Invalid data provided.", statusCode: 400);

            try
            {
                var result = await _blogRepo.FetchBookmarkStatusForBlog(bookmark_info);
                if (result.bookmarkId < 0)
                    return ApiResponse(false, "Unable to fetch bookmark status. Please try again later.", result, 404);

                return ApiResponse(true, "Successfully fetched your bookmark status for this blog.", result);
            }
            catch (Exception ex)
            {
                return ApiResponse(false, $"Something went wrong: {ex.Message}", statusCode: 500);
            }
        }
    }
}
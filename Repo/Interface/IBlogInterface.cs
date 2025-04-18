namespace Repo;

public interface IBlogInterface
{

	

    #region BlogPost    
        Task<int> SaveBlogDraft(BlogPost blogpost);
        Task<bool> UpdateBlogDraft(BlogPost blogpost);
        Task<bool> PublishBlog(BlogPost blogpost);
        Task<List<BlogPost>> GetBlogsByInstructorId(int instructor_id);
        Task<List<BlogPost>> GetBlogsForUser();
        Task<List<BlogPost>> FetchBookmarkedBlogsForUser(int user_id, string user_role);
        Task<BlogPost> GetBlogById(int blog_id);

        Task<BlogComment> AddNewComment(BlogComment comment);
        Task<List<BlogComment>> fetchBlogComments(int blog_id);
        Task<BlogPost> fetchBlogByUri(string source_uri);
        Task<Instructor> fetchBlogAuthorById(int author_id);
        Task<int> DeleteBlog(int blogId);
        Task<int> RegisterLike(vm_RegisterLike like_req);
        Task<vm_RegisterLike> fetchLikeStatusForBlog(vm_RegisterLike like_info);
        Task<int> RegisterBookmark(vm_RegisterBookmark bookmark_req);
        Task<vm_RegisterBookmark> FetchBookmarkStatusForBlog(vm_RegisterBookmark bookmark_info);

    #endregion
}
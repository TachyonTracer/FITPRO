namespace Repo;

public interface IInstructorInterface
{

	#region Edit Profile Region By Paras
        public Task<int> EditProfileBasic(Instructor instructor);
        public Task<Instructor?> GetOneInstructorByIdForProfile(int instructorId);
	#endregion

    #region User Story: List Instructors
        Task<List<Instructor>> GetAllInstructors();
        Task<Instructor> GetOneInstructor(string instructorId);
        Task<List<Instructor>> GetVerifiedInstructors();
        Task<List<Instructor>> GetApprovedInstructors();
    #endregion

    #region  User Stroy : Update Instructor (Admin Dashboard)
    Task<bool> ApproveInstructor(string instructorId);
     Task<bool> DisapproveInstructor(string instructorId, string reason);
    Task<bool> SuspendInstructor(string instructorId,string reason);
    Task<bool> ActivateInstructor(string instructorId);
    #endregion

	#region User Story: Instructor Dashboard View
	Task<int> ClassCountByInstructor(string instructorId);
	Task<int> UpcomingClassCountByInstructor(string instructorId);
	Task<int> UserCountByInstructor(string instructorId);
	Task<List<Class>> UpcomingClassDetailsByInstructor(string instructorId);
    Task<List<KeyValuePair<string, int>>> GetTypewiseClassCount(string instructorId);
        Task<bool> ApproveInstructor(string instructorId);
        Task<bool> DisapproveInstructor(string instructorId);
        Task<bool> SuspendInstructor(string instructorId);
    #endregion

	#region User Story: Instructor Dashboard View
        Task<int> ClassCountByInstructor(string instructorId);
        Task<int> UpcomingClassCountByInstructor(string instructorId);
        Task<int> UserCountByInstructor(string instructorId);
        Task<List<Class>> UpcomingClassDetailsByInstructor(string instructorId);
	#endregion

    #region BlogPost    
        Task<int> SaveBlogDraft(BlogPost blogpost);
        Task<bool> UpdateBlogDraft(BlogPost blogpost);
        Task<bool> PublishBlog(BlogPost blogpost);
        Task<List<BlogPost>> GetBlogsByInstructorId(int instructor_id);
        Task<BlogPost> GetBlogById(int blog_id);

        Task<BlogComment> AddNewComment(BlogComment comment);
        Task<List<BlogComment>> fetchBlogComments(int blog_id);
        Task<BlogPost> fetchBlogByUri(string source_uri);
        Task<Instructor> fetchBlogAuthorById(int author_id);
        Task<int> DeleteBlog(int blogId);
    #endregion
}
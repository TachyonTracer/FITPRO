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
    Task<bool> SuspendInstructor(string instructorId);
    #endregion

	#region User Story: Instructor Dashboard View
	Task<int> ClassCountByInstructor(string instructorId);
	Task<int> UpcomingClassCountByInstructor(string instructorId);
	Task<int> UserCountByInstructor(string instructorId);
	Task<List<Class>> UpcomingClassDetailsByInstructor(string instructorId);
	#endregion
}
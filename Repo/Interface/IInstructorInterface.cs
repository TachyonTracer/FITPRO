namespace Repo;

public interface IInstructorInterface
{

	#region Edit Profile Region By Paras

	public Task<int> EditProfileBasic(Instructor instructor);

	public Task<Instructor?> GetOneInstructorByIdForProfile(int instructorId);


	#endregion

    #region User Story: List Instructors
    Task<List<Instructor>> GetAllInstructors();
    #endregion
}
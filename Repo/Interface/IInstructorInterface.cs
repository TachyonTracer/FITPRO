namespace Repo;


public interface IInstructorInterface
{
    #region User Story: List Instructors
    Task<List<Instructor>> GetAllInstructors();
    Task<Instructor> GetOneInstructor(string instructorId);
    #endregion

    #region  User Stroy : Update Instructor (Admin Dashboard)
    Task<bool> ApproveInstructor(string instructorId);
    Task<bool> DisapproveInstructor(string instructorId);
    Task<bool> SuspendInstructor(string instructorId);
    #endregion

   
}
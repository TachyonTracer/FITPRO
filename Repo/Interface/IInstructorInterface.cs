using Repo;

public interface IInstructorInterface
{
    #region User Story: List Instructors
    Task<List<Instructor>> GetAllInstructors();
    Task<Instructor> GetOneInstructor(string instructorId);
    #endregion
}
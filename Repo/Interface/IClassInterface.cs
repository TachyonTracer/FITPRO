namespace Repo;
public interface IClassInterface
{
    #region User Story: List Class
    Task<List<Class>> GetAllClasses();
    Task<List<Class>> GetClassById(string id);
    Task<Class> GetOne(string id);
    Task<Response> BookClass(Booking request);
    Task<bool> SoftDeleteClass(int classId);

    Task<int> ScheduleClass( Class classData);

    Task<Response> UpdateClass(Class updatedClass);
    #endregion
}
using Repo;
public interface IClassInterface
{
    Task<List<Class>> GetAllClasses();
    Task<List<Class>> GetClassById(string id);
    Task<Class> GetOne(string id);
    Task<Response> BookClass(Booking request);
    Task<bool> SoftDeleteClass(int classId);
}
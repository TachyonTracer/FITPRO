using Repo;
public interface IClassInterface
{
    Task<List<Class>> GetAllClasses();
    Task<List<Class>> GetClassById(string id);
     Task <Class> GetOne(string id);
}
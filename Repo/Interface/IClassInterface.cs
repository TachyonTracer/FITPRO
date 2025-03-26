namespace Repo;
public interface IClassInterface
{
    #region User Story: List Class
    Task<List<Class>> GetAllClasses();
    Task<List<Class>> GetClassById(string id);
     Task <Class> GetOne(string id);
     #endregion
}
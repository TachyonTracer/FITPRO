using Elastic.Clients.Elasticsearch.Security;
namespace Repo;

public interface IUserInterface
{
	#region User Story: List Users
	Task<List<User>> GetAllUsers();
	Task<User> GetAllUsersById(int userId);

	Task<List<User>> GetAllUsersByClassId(int classId);

	public Task<List<User>> GetAllUsersByInstructorId(int instructorId);

	#endregion

	#region User Story: List Users Desgin
	 Task<bool> SuspendUser(string userId,string reason);
	#endregion

	public Task<bool> UpdateUserProfileAsync(User user);
    Task<User> GetUserByIdAsync(int userId);

}
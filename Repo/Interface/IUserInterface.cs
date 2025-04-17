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
	Task<bool> SuspendUser(string userId, string reason);
	Task<bool> ActivateUser(string userId);
	#endregion

	#region User Story: Wallet TopUp
	Task<User> GetUserBalanceById(int userId);
	#endregion

	Task<bool> UpdateUserProfileAsync(User user);
	Task<User> GetUserByIdAsync(int userId);
	Task<int> UpcomingClassCountByUser(string userId);
	Task<int> CompletedClassCountByUser(string userId);
	Task<int> EnrolledClassCountByUser(string userId);


	#region User Balance

	Task<int> AddBalance(Balance balance);
	Task<int> DebitBalance(Balance balance);
	#endregion



}
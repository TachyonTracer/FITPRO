namespace Repo;

public interface IAdminInterface {

	#region Analytics related By Paras
	public Task<IEnumerable<dynamic>> GetTopSpecialization();

	public Task<int> CountClasses();

	public Task<int> CountInstructors();

	public Task<int> CountUsers();

	Task<int> TotalRevenue();

	Task<(int activeUsers, int inactiveUsers)> CountActiveInactiveUsers();

	Task<List<KeyValuePair<string, int>>> GetUserActivityLast7Days();

	#endregion

}
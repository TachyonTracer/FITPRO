public interface IAdminInterface {

	#region Analytics related By Paras
	public Task<IEnumerable<dynamic>> GetTopUserGoalsAsync();

	public Task<IEnumerable<dynamic>> GetTopSpecialization();

	public Task<int> CountClasses();

	public Task<int> CountInstructors();

	public Task<int> CountUsers();


	#endregion

}
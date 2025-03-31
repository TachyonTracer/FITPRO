using System.Data;
using Npgsql;
namespace Repo;

public class AdminRepo : IAdminInterface
{
	private readonly NpgsqlConnection _conn;


	public AdminRepo(NpgsqlConnection conn)
	{
		_conn = conn;

	}	

	#region Analytics Related Method By Paras

	#region GetTopUserGoalsAsync
	public async Task<IEnumerable<dynamic>> GetTopUserGoalsAsync()
	{
		List<dynamic> goals = new List<dynamic>();
		var query = @"
            SELECT unnest(string_to_array(c_goal, ',')) AS goal, COUNT(*) AS goal_count
			FROM t_User
			WHERE c_goal IS NOT NULL AND c_goal <> ''
			GROUP BY goal
			ORDER BY goal_count DESC
			LIMIT 10";

		if (_conn.State != ConnectionState.Open)
		{
			await _conn.OpenAsync();
		}


		try
		{

			using (var cmd = new NpgsqlCommand(query, _conn))
			using (var reader = await cmd.ExecuteReaderAsync())
			{
				while (await reader.ReadAsync())
				{
					var goal = new
					{
						Goal = reader.GetString(0),
						GoalCount = reader.GetInt32(1)
					};
					goals.Add(goal);
				}
			}

		}
		catch (Exception ex)
		{

			Console.WriteLine($"Exception Message : {ex.Message}");

		}
		finally
		{
			if (_conn.State != ConnectionState.Closed)
			{
				await _conn.CloseAsync();
			}
		}
		return goals;

	}

	#endregion

	#region GetTopSpecialization
	public async Task<IEnumerable<dynamic>> GetTopSpecialization()
	{
		List<dynamic> specializations = new List<dynamic>();
		var query = @"
           SELECT unnest(string_to_array(c_specialization, ',')) AS specialization, COUNT(*) AS specialization_count
			FROM t_Instructor
			WHERE c_specialization IS NOT NULL AND c_specialization <> ''
			GROUP BY specialization
			ORDER BY specialization_count DESC
			LIMIT 5";

		if (_conn.State != ConnectionState.Open)
		{
			await _conn.OpenAsync();
		}


		try
		{

			using (var cmd = new NpgsqlCommand(query, _conn))
			using (var reader = await cmd.ExecuteReaderAsync())
			{
				while (await reader.ReadAsync())
				{
					var specialization = new
					{
						Specialization = reader.GetString(0),
						SpecializationGoalCount = reader.GetInt32(1)
					};
					specializations.Add(specialization);
				}
			}

		}
		catch (Exception ex)
		{

			Console.WriteLine($"Exception Message : {ex.Message}");

		}
		finally
		{
			if (_conn.State != ConnectionState.Closed)
			{
				await _conn.CloseAsync();
			}
		}
		return specializations;
	}

	#endregion

	#region CountUsers
	public async Task<int> CountUsers()
	{
		var query = @"SELECT COUNT(*) FROM t_User";

		if (_conn.State != ConnectionState.Open)
		{
			await _conn.OpenAsync();
		}

		try
		{
			using (var cmd = new NpgsqlCommand(query, _conn))
			{
				var count = await cmd.ExecuteScalarAsync();
				return Convert.ToInt32(count);
			}
		}
		catch (Exception ex)
		{
			Console.WriteLine($"Exception: {ex.Message}");
			return -1;
		}
		finally
		{
			if (_conn.State != ConnectionState.Closed)
			{
				await _conn.CloseAsync();
			}
		}
	}

	#endregion

	#region CountClasses

	public async Task<int> CountClasses()
	{
		var query = @"SELECT COUNT(*) FROM t_class";

		if (_conn.State != ConnectionState.Open)
		{
			await _conn.OpenAsync();
		}

		try
		{
			using (var cmd = new NpgsqlCommand(query, _conn))
			{
				var count = await cmd.ExecuteScalarAsync();
				return Convert.ToInt32(count);
			}
		}
		catch (Exception ex)
		{
			Console.WriteLine($"Exception: {ex.Message}");
			return -1;
		}
		finally
		{
			if (_conn.State != ConnectionState.Closed)
			{
				await _conn.CloseAsync();
			}
		}
	}

	#endregion

	#region CountInstructors
	public async Task<int> CountInstructors()
	{
		var query = @"SELECT COUNT(*) FROM t_instructor";

		if (_conn.State != ConnectionState.Open)
		{
			await _conn.OpenAsync();
		}

		try
		{
			using (var cmd = new NpgsqlCommand(query, _conn))
			{
				var count = await cmd.ExecuteScalarAsync();
				return Convert.ToInt32(count);
			}
		}
		catch (Exception ex)
		{
			Console.WriteLine($"Exception: {ex.Message}");
			return -1;
		}
		finally
		{
			if (_conn.State != ConnectionState.Closed)
			{
				await _conn.CloseAsync();
			}
		}
	}

	#endregion

	#endregion


}
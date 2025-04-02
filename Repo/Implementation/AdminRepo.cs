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
		var query = @"SELECT COUNT(*) FROM t_instructor WHERE c_status LIKE 'Approve'";

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


	#region TotalRevenue
	public async Task<int> TotalRevenue()
	{
		var query = @"SELECT SUM((c_maxcapacity- c_availablecapacity) * c_fees) AS total_revenue 
						FROM t_class
						WHERE EXTRACT(MONTH FROM c_startdate) = EXTRACT(MONTH FROM CURRENT_DATE);";

		if (_conn.State != ConnectionState.Open)
		{
			await _conn.OpenAsync();
		}

		try
		{
			using (var cmd = new NpgsqlCommand(query, _conn))
			{
				var sum = await cmd.ExecuteScalarAsync();
				return Convert.ToInt32(sum);
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

	#region CountActiveInactiveUsers
	public async Task<(int activeUsers, int inactiveUsers)> CountActiveInactiveUsers()
	{
		var query = @"
        SELECT 
            COUNT(CASE WHEN c_status = true THEN 1 END) AS active_users,
            COUNT(CASE WHEN c_status = false THEN 1 END) AS inactive_users
        FROM t_user";

		if (_conn.State != ConnectionState.Open)
		{
			await _conn.OpenAsync();
		}

		try
		{
			using (var cmd = new NpgsqlCommand(query, _conn))
			{
				var reader = await cmd.ExecuteReaderAsync();

				if (await reader.ReadAsync())
				{
					int activeUsers = reader.IsDBNull("active_users") ? 0 : reader.GetInt32("active_users");
					int inactiveUsers = reader.IsDBNull("inactive_users") ? 0 : reader.GetInt32("inactive_users");

					return (activeUsers, inactiveUsers);
				}

				return (0, 0); // Return (0,0) if no data is found
			}
		}
		catch (Exception ex)
		{
			Console.WriteLine($"Exception: {ex.Message}");
			return (0, 0); // Return (0,0) if an error occurs
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


	#region GetUserActivityLast7Days
	public async Task<List<KeyValuePair<string, int>>> GetUserActivityLast7Days()
	{
		var query = @"
			SELECT 
				DATE_TRUNC('day', c_createdat) AS activity_day, 
				COUNT(*) AS user_count
			FROM t_User
			WHERE c_createdat >= CURRENT_DATE - INTERVAL '7 days'
			GROUP BY activity_day
			ORDER BY activity_day ASC";

		if (_conn.State != ConnectionState.Open)
		{
			await _conn.OpenAsync();
		}

		try
		{
			using (var cmd = new NpgsqlCommand(query, _conn))
			{
				var reader = await cmd.ExecuteReaderAsync();
				var result = new List<KeyValuePair<string, int>>();

				while (await reader.ReadAsync())
				{
					var activityDay = reader.GetDateTime("activity_day").ToString("yyyy-MM-dd");
					var userCount = reader.GetInt32("user_count");
					
					result.Add(new KeyValuePair<string, int>(activityDay, userCount));
				}

				return result;
			}
		}
		catch (Exception ex)
		{
			Console.WriteLine($"Exception: {ex.Message}");
			return new List<KeyValuePair<string, int>>(); // Return empty list on error
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
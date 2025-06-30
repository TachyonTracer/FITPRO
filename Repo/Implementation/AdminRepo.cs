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

    // DRY: Centralized method for executing scalar queries
    private async Task<T> ExecuteScalarAsync<T>(string query)
    {
        if (_conn.State != ConnectionState.Open)
            await _conn.OpenAsync();

        try
        {
            using var cmd = new NpgsqlCommand(query, _conn);
            var result = await cmd.ExecuteScalarAsync();
            return result != null ? (T)Convert.ChangeType(result, typeof(T)) : default;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception: {ex.Message}");
            return default;
        }
        finally
        {
            if (_conn.State != ConnectionState.Closed)
                await _conn.CloseAsync();
        }
    }

    // DRY: Centralized method for executing reader queries
    private async Task<List<T>> ExecuteReaderAsync<T>(string query, Func<NpgsqlDataReader, T> map)
    {
        var resultList = new List<T>();
        if (_conn.State != ConnectionState.Open)
            await _conn.OpenAsync();

        try
        {
            using var cmd = new NpgsqlCommand(query, _conn);
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                resultList.Add(map(reader));
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception: {ex.Message}");
        }
        finally
        {
            if (_conn.State != ConnectionState.Closed)
                await _conn.CloseAsync();
        }
        return resultList;
    }

    #region Analytics Related Method By Paras

    #region GetTopSpecialization
    public async Task<IEnumerable<dynamic>> GetTopSpecialization()
    {
        string query = @"
            SELECT unnest(string_to_array(c_specialization, ',')) AS specialization, COUNT(*) AS specialization_count
            FROM t_Instructor
            WHERE c_specialization IS NOT NULL AND c_specialization <> ''
            GROUP BY specialization
            ORDER BY specialization_count DESC
            LIMIT 10";

        return await ExecuteReaderAsync(query, reader => new
        {
            Specialization = reader.GetString(0),
            SpecializationGoalCount = reader.GetInt32(1)
        });
    }
    #endregion

    #region CountUsers
    public async Task<int> CountUsers()
    {
        return await ExecuteScalarAsync<int>(@"SELECT COUNT(*) FROM t_User");
    }
    #endregion

    #region CountClasses
    public async Task<int> CountClasses()
    {
        return await ExecuteScalarAsync<int>(@"SELECT COUNT(*) FROM t_class");
    }
    #endregion

    #region CountInstructors
    public async Task<int> CountInstructors()
    {
        return await ExecuteScalarAsync<int>(@"SELECT COUNT(*) FROM t_instructor WHERE c_status LIKE 'Approved'");
    }
    #endregion

    #region TotalRevenue
    public async Task<int> TotalRevenue()
    {
        string query = @"SELECT SUM((c_maxcapacity- c_availablecapacity) * c_fees) AS total_revenue 
                         FROM t_class
                         WHERE EXTRACT(MONTH FROM c_startdate) = EXTRACT(MONTH FROM CURRENT_DATE);";
        return await ExecuteScalarAsync<int>(query);
    }
    #endregion

    #region CountActiveInactiveUsers
    public async Task<(int activeUsers, int inactiveUsers)> CountActiveInactiveUsers()
    {
        string query = @"
            SELECT 
                COUNT(CASE WHEN c_status = true THEN 1 END) AS active_users,
                COUNT(CASE WHEN c_status = false THEN 1 END) AS inactive_users
            FROM t_user";

        if (_conn.State != ConnectionState.Open)
            await _conn.OpenAsync();

        try
        {
            using var cmd = new NpgsqlCommand(query, _conn);
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                int activeUsers = reader.IsDBNull(0) ? 0 : reader.GetInt32(0);
                int inactiveUsers = reader.IsDBNull(1) ? 0 : reader.GetInt32(1);
                return (activeUsers, inactiveUsers);
            }
            return (0, 0);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception: {ex.Message}");
            return (0, 0);
        }
        finally
        {
            if (_conn.State != ConnectionState.Closed)
                await _conn.CloseAsync();
        }
    }
    #endregion

    #region GetUserActivityLast7Days
    public async Task<List<KeyValuePair<string, int>>> GetUserActivityLast7Days()
    {
        string query = @"
            SELECT 
                DATE_TRUNC('day', c_createdat) AS activity_day, 
                COUNT(*) AS user_count
            FROM t_User
            WHERE c_createdat >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY activity_day
            ORDER BY activity_day ASC";

        var result = await ExecuteReaderAsync(query, reader =>
            new KeyValuePair<string, int>(
                reader.GetDateTime(0).ToString("yyyy-MM-dd"),
                reader.GetInt32(1)
            )
        );
        return result;
    }
    #endregion

    #endregion
}
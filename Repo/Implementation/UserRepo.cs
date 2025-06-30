using System.Data;
using Npgsql;

namespace Repo;

public class UserRepo : IUserInterface
{
    private readonly NpgsqlConnection _conn;
    private readonly IEmailInterface _email;

    public UserRepo(NpgsqlConnection conn, IEmailInterface email)
    {
        _conn = conn;
        _email = email;
    }

    // DRY: Centralized connection open/close helpers
    private async Task EnsureOpenAsync()
    {
        if (_conn.State != ConnectionState.Open)
            await _conn.OpenAsync();
    }
    private async Task EnsureClosedAsync()
    {
        if (_conn.State != ConnectionState.Closed)
            await _conn.CloseAsync();
    }

    // DRY: Centralized method for executing a reader and mapping results
    private async Task<List<T>> ExecuteReaderAsync<T>(string query, Action<NpgsqlCommand> paramSetter, Func<NpgsqlDataReader, T> map)
    {
        var result = new List<T>();
        await EnsureOpenAsync();
        try
        {
            using var cmd = new NpgsqlCommand(query, _conn);
            paramSetter?.Invoke(cmd);
            using var dr = await cmd.ExecuteReaderAsync();
            while (await dr.ReadAsync())
                result.Add(map(dr));
        }
        finally
        {
            await EnsureClosedAsync();
        }
        return result;
    }

    // DRY: Centralized method for executing a scalar query
    private async Task<T> ExecuteScalarAsync<T>(string query, Action<NpgsqlCommand> paramSetter)
    {
        await EnsureOpenAsync();
        try
        {
            using var cmd = new NpgsqlCommand(query, _conn);
            paramSetter?.Invoke(cmd);
            var result = await cmd.ExecuteScalarAsync();
            return (result == null || result is DBNull) ? default : (T)Convert.ChangeType(result, typeof(T));
        }
        finally
        {
            await EnsureClosedAsync();
        }
    }

    // DRY: User mapping helper
    private User MapUser(NpgsqlDataReader dr)
    {
        return new User
        {
            userId = dr.GetInt32(dr.GetOrdinal("c_userid")),
            userName = dr["c_username"] as string,
            email = dr["c_email"] as string,
            password = dr["c_password"] as string,
            mobile = dr["c_mobile"] as string,
            gender = dr["c_gender"] as string,
            dob = dr["c_dob"] == DBNull.Value ? null : dr.GetDateTime(dr.GetOrdinal("c_dob")),
            height = dr["c_height"] == DBNull.Value ? (int?)null : dr.GetInt32(dr.GetOrdinal("c_height")),
            weight = dr["c_weight"] == DBNull.Value ? (decimal?)null : dr.GetDecimal(dr.GetOrdinal("c_weight")),
            goal = dr["c_goal"] as string,
            medicalCondition = dr["c_medicalcondition"] as string,
            profileImage = dr["c_profileimage"] as string,
            createdAt = dr.GetDateTime(dr.GetOrdinal("c_createdat")),
            status = dr.GetBoolean(dr.GetOrdinal("c_status")),
            activationToken = dr["c_activationtoken"] as string,
            activatedOn = dr["c_activatedon"] == DBNull.Value ? null : dr.GetDateTime(dr.GetOrdinal("c_activatedon")),
            balance = dr.HasColumn("c_balance") && dr["c_balance"] != DBNull.Value ? Convert.ToDecimal(dr["c_balance"]) : (decimal?)null,
            reason = dr.HasColumn("c_reason") && dr["c_reason"] != DBNull.Value ? dr["c_reason"].ToString() : null
        };
    }

    #region Get All Users
    public async Task<List<User>> GetAllUsers()
    {
        string query = @"SELECT * FROM t_user";
        return await ExecuteReaderAsync(query, null, MapUser);
    }
    #endregion

    #region Get One User By Id
    public async Task<User> GetAllUsersById(int userId)
    {
        string query = @"SELECT * FROM t_user WHERE c_userid = @userId";
        var users = await ExecuteReaderAsync(query, cmd => cmd.Parameters.AddWithValue("@userId", userId), MapUser);
        return users.FirstOrDefault();
    }
    #endregion

    #region Get All Users By ClassId
    public async Task<List<User>> GetAllUsersByClassId(int classId)
    {
        string query = @"
            SELECT u.* FROM t_bookings b
            JOIN t_user u ON b.c_userid = u.c_userid
            WHERE b.c_classid = @c_classid
            ORDER BY b.c_classid";
        return await ExecuteReaderAsync(query, cmd => cmd.Parameters.AddWithValue("@c_classid", classId), MapUser);
    }
    #endregion

    #region Get All Users By InstructorId
    public async Task<List<User>> GetAllUsersByInstructorId(int instructorId)
    {
        string query = @"
            SELECT u.* FROM t_bookings b
            JOIN t_class c ON b.c_classid = c.c_classid
            JOIN t_user u ON b.c_userid = u.c_userid
            WHERE c.c_instructorid = @c_instructorid
            ORDER BY c.c_instructorid";
        return await ExecuteReaderAsync(query, cmd => cmd.Parameters.AddWithValue("@c_instructorid", instructorId), MapUser);
    }
    #endregion

    #region Suspend User
    public async Task<bool> SuspendUser(string userId, string reason)
    {
        string updateQuery = "UPDATE t_user SET c_status = false, c_reason = @c_reason WHERE c_userid = @c_userid";
        int rowsAffected = await ExecuteScalarAsync<int>(
            $"WITH updated AS ({updateQuery} RETURNING 1) SELECT COUNT(*) FROM updated;", cmd =>
        {
            cmd.Parameters.AddWithValue("@c_userid", Convert.ToInt32(userId));
            cmd.Parameters.AddWithValue("@c_reason", reason);
        });

        if (rowsAffected > 0)
        {
            string selectQuery = @"SELECT c_username, c_email, c_reason FROM t_user WHERE c_userid = @c_userid";
            var users = await ExecuteReaderAsync(selectQuery, cmd => cmd.Parameters.AddWithValue("@c_userid", Convert.ToInt32(userId)), dr => new { 
                Name = dr["c_username"].ToString(), 
                Email = dr["c_email"].ToString(), 
                Reason = dr["c_reason"].ToString() 
            });
            var user = users.FirstOrDefault();
            if (user != null)
                await _email.SendSuspendUserEmail(user.Email, user.Name, user.Reason);
        }
        return rowsAffected > 0;
    }
    #endregion

    #region Activate User
    public async Task<bool> ActivateUser(string userId)
    {
        string updateQuery = "UPDATE t_user SET c_status = true WHERE c_userid = @c_userid";
        int rowsAffected = await ExecuteScalarAsync<int>(
            $"WITH updated AS ({updateQuery} RETURNING 1) SELECT COUNT(*) FROM updated;", cmd =>
        {
            cmd.Parameters.AddWithValue("@c_userid", Convert.ToInt32(userId));
        });

        if (rowsAffected > 0)
        {
            string selectQuery = @"SELECT c_username, c_email FROM t_user WHERE c_userid = @c_userid";
            var users = await ExecuteReaderAsync(selectQuery, cmd => cmd.Parameters.AddWithValue("@c_userid", Convert.ToInt32(userId)), dr => new { 
                Name = dr["c_username"].ToString(), 
                Email = dr["c_email"].ToString() 
            });
            var user = users.FirstOrDefault();
            if (user != null)
                await _email.SendActivateUserEmail(user.Email, user.Name);
        }
        return rowsAffected > 0;
    }
    #endregion

    #region Update User Profile
    public async Task<bool> UpdateUserProfileAsync(User user)
    {
        string query = @"UPDATE t_user 
                            SET c_username = @username,                                
                                c_height = @height,
                                c_mobile = @mobile,
                                c_weight = @weight,
                                c_goal = @goal,
                                c_medicalcondition = @medicalCondition,
                                c_profileimage = @profileImage
                            WHERE c_userid = @userId";
        int rowsAffected = await ExecuteScalarAsync<int>(
            $"WITH updated AS ({query} RETURNING 1) SELECT COUNT(*) FROM updated;", cmd =>
        {
            cmd.Parameters.AddWithValue("@userId", user.userId);
            cmd.Parameters.AddWithValue("@username", user.userName);
            cmd.Parameters.AddWithValue("@mobile", user.mobile);
            cmd.Parameters.AddWithValue("@height", user.height ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@weight", user.weight ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@goal", user.goal ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@medicalCondition", user.medicalCondition ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@profileImage", user.profileImage ?? (object)DBNull.Value);
        });
        return rowsAffected > 0;
    }
    #endregion

    #region GetUserById
    public async Task<User> GetUserByIdAsync(int userId)
    {
        string query = @"SELECT c_userid, c_username, c_email, c_mobile, c_gender, 
                         c_dob, c_height, c_weight, c_goal, c_medicalcondition, 
                         c_profileimage, c_status, c_createdat, c_activatedon 
                         FROM t_user 
                         WHERE c_userid = @userId";
        var users = await ExecuteReaderAsync(query, cmd => cmd.Parameters.AddWithValue("@userId", userId), dr => new User
        {
            userId = Convert.ToInt32(dr["c_userid"]),
            userName = Convert.ToString(dr["c_username"]),
            email = Convert.ToString(dr["c_email"]),
            mobile = Convert.ToString(dr["c_mobile"]),
            gender = Convert.ToString(dr["c_gender"]),
            dob = dr["c_dob"] != DBNull.Value ? Convert.ToDateTime(dr["c_dob"]) : (DateTime?)null,
            height = dr["c_height"] != DBNull.Value ? Convert.ToInt32(dr["c_height"]) : (int?)null,
            weight = dr["c_weight"] != DBNull.Value ? Convert.ToDecimal(dr["c_weight"]) : (decimal?)null,
            goal = Convert.ToString(dr["c_goal"]),
            medicalCondition = Convert.ToString(dr["c_medicalcondition"]),
            profileImage = Convert.ToString(dr["c_profileimage"]),
            status = Convert.ToBoolean(dr["c_status"]),
            createdAt = Convert.ToDateTime(dr["c_createdat"]),
            activatedOn = dr["c_activatedon"] != DBNull.Value ? Convert.ToDateTime(dr["c_activatedon"]) : (DateTime?)null
        });
        return users.FirstOrDefault();
    }
    #endregion

    #region GetUserBalanceById
    public async Task<User> GetUserBalanceById(int userId)
    {
        string query = @"SELECT c_userid, c_balance FROM t_user WHERE c_userid = @userId";
        var users = await ExecuteReaderAsync(query, cmd => cmd.Parameters.AddWithValue("@userId", userId), dr => new User
        {
            userId = Convert.ToInt32(dr["c_userid"]),
            balance = dr["c_balance"] != DBNull.Value ? Convert.ToDecimal(dr["c_balance"]) : 0
        });
        return users.FirstOrDefault();
    }
    #endregion

    #region Upcoming Class Count By User
    public async Task<int> UpcomingClassCountByUser(string userId)
    {
        string query = @"SELECT COUNT(*)
                         FROM t_bookings B
                         JOIN t_class C ON B.c_classid = C.c_classid
                         WHERE c_userid = @c_userid
                         AND C.c_startdate > @date";
        return await ExecuteScalarAsync<int>(query, cmd =>
        {
            cmd.Parameters.AddWithValue("@c_userid", Convert.ToInt32(userId));
            cmd.Parameters.AddWithValue("@date", DateTime.Now);
        });
    }
    #endregion

    #region Completed Class Count By User
    public async Task<int> CompletedClassCountByUser(string userId)
    {
        string query = @"SELECT COUNT(*)
                         FROM t_bookings B
                         JOIN t_class C ON B.c_classid = C.c_classid
                         WHERE c_userid = @c_userid
                         AND C.c_enddate < @date";
        return await ExecuteScalarAsync<int>(query, cmd =>
        {
            cmd.Parameters.AddWithValue("@c_userid", Convert.ToInt32(userId));
            cmd.Parameters.AddWithValue("@date", DateTime.Now);
        });
    }
    #endregion

    #region Enrolled Class Count By User
    public async Task<int> EnrolledClassCountByUser(string userId)
    {
        string query = @"SELECT COUNT(*)
                         FROM t_bookings B
                         JOIN t_class C ON B.c_classid = C.c_classid
                         WHERE c_userid = @c_userid";
        return await ExecuteScalarAsync<int>(query, cmd =>
        {
            cmd.Parameters.AddWithValue("@c_userid", Convert.ToInt32(userId));
        });
    }
    #endregion

    #region AddBalance 
    public async Task<int> AddBalance(Balance balance)
    {
        string query = @"UPDATE t_user SET c_balance = c_balance + @amount WHERE c_userid = @Userid";
        int rowsAffected = await ExecuteScalarAsync<int>(
            $"WITH updated AS ({query} RETURNING 1) SELECT COUNT(*) FROM updated;", cmd =>
        {
            cmd.Parameters.AddWithValue("@Userid", balance.userId);
            cmd.Parameters.AddWithValue("@amount", balance.amount);
        });
        return rowsAffected > 0 ? 1 : 0;
    }
    #endregion

    #region DebitBalance 
    public async Task<int> DebitBalance(Balance balance)
    {
        // Check current balance
        string balanceQuery = @"SELECT c_balance FROM t_user WHERE c_userid = @Userid";
        decimal currentBalance = await ExecuteScalarAsync<decimal>(balanceQuery, cmd =>
        {
            cmd.Parameters.AddWithValue("@Userid", balance.userId);
        });

        if (currentBalance < balance.amount)
            return -1;

        // Perform the debit
        string updateQuery = @"UPDATE t_user SET c_balance = c_balance - @Amount WHERE c_userid = @Userid";
        int rowsAffected = await ExecuteScalarAsync<int>(
            $"WITH updated AS ({updateQuery} RETURNING 1) SELECT COUNT(*) FROM updated;", cmd =>
        {
            cmd.Parameters.AddWithValue("@Amount", balance.amount);
            cmd.Parameters.AddWithValue("@Userid", balance.userId);
        });
        return rowsAffected > 0 ? 1 : 0;
    }
    #endregion
}

// Add this somewhere in your project (e.g., a static helper class)
public static class DataReaderExtensions
{
    public static bool HasColumn(this IDataRecord dr, string columnName)
    {
        for (int i = 0; i < dr.FieldCount; i++)
            if (dr.GetName(i).Equals(columnName, StringComparison.InvariantCultureIgnoreCase))
                return true;
        return false;
    }
}

using System;
using System.Data;
using System.Threading.Tasks;
using Npgsql;
namespace Repo;
public class UserRepo : IUserInterface
{
    private readonly NpgsqlConnection _conn;

    public UserRepo(NpgsqlConnection connection)
    {
        _conn = connection;
    }

    #region Update User Profile
    public async Task<bool> UpdateUserProfileAsync(User user)
    {
        string query = @"UPDATE t_user 
                            SET c_username = @username,                                
                                c_height = @height,
                                c_weight = @weight,
                                c_goal = @goal,
                                c_medicalcondition = @medicalCondition,
                                c_profileimage = @profileImage
                            WHERE c_userid = @userId";

        try
        {
            if (_conn.State == System.Data.ConnectionState.Open)
                await _conn.CloseAsync();

            await _conn.OpenAsync();

            using (var command = new NpgsqlCommand(query, _conn))
            {
                command.Parameters.AddWithValue("@userId", user.userId);
                command.Parameters.AddWithValue("@username", user.userName);
                command.Parameters.AddWithValue("@mobile", user.mobile);
                command.Parameters.AddWithValue("@gender", user.gender);
                command.Parameters.AddWithValue("@dob", user.dob ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@height", user.height ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@weight", user.weight ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@goal", user.goal ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@medicalCondition", user.medicalCondition ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@profileImage", user.profileImage ?? (object)DBNull.Value);

                int rowsAffected = await command.ExecuteNonQueryAsync();
                return rowsAffected > 0;
            }
        }
        finally
        {
            if (_conn.State == System.Data.ConnectionState.Open)
                await _conn.CloseAsync();
        }

    }
    #endregion

    #region GetUserById
    public async Task<User> GetUserByIdAsync(int userId)
    {
        User user = null;

        try
        {
            if (_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }

            using (var cmd = new NpgsqlCommand(@"SELECT c_userid, c_username, c_email, c_mobile, c_gender, 
                                             c_dob, c_height, c_weight, c_goal, c_medicalcondition, 
                                             c_profileimage, c_status, c_createdat, c_activatedon 
                                             FROM t_user 
                                             WHERE c_userid = @userId", _conn))
            {
                cmd.Parameters.AddWithValue("@userId", userId);

                using (var dr = await cmd.ExecuteReaderAsync())
                {
                    if (dr.Read())
                    {
                        user = new User()
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
                        };
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error fetching user: " + ex.Message);
        }
        finally
        {
            if (_conn.State != ConnectionState.Closed)
            {
                await _conn.CloseAsync();
            }
        }

        return user;
    }

    #endregion



}

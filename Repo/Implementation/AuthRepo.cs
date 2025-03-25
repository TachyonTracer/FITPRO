using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Npgsql;

namespace Repo
{
    public class UserRepository : IAuthInterface
    {
        private readonly NpgsqlConnection _conn;

        public UserRepository(NpgsqlConnection connection)
        {
            _conn = connection;
        }

        public async Task<bool> RegisterUser(User user)
        {
            string query = @"INSERT INTO t_user 
                            (c_username, c_email, c_password, c_mobile, c_gender, c_dob, c_height, c_weight, c_goal, c_medicalcondition, 
                            c_profileimage, c_createdat, c_status, c_activationtoken) 
                            VALUES 
                            (@username, @email, @password, @mobile, @gender, @dob, @height, @weight, @goal, @medicalCondition, 
                            @profileImage, @createdAt, @status, @activationToken)";

            await _conn.OpenAsync();
            using (var command = new NpgsqlCommand(query, _conn))
            {
                command.Parameters.AddWithValue("@username", user.username);
                command.Parameters.AddWithValue("@email", user.email);
                command.Parameters.AddWithValue("@password", user.password);
                command.Parameters.AddWithValue("@mobile", user.mobile);
                command.Parameters.AddWithValue("@gender", user.gender ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@dob", user.dob ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@height", user.height ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@weight", user.weight ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@goal", user.goal ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@medicalCondition", user.medicalCondition ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@profileImage", user.profileImage ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@createdAt", DateTime.UtcNow);
                command.Parameters.AddWithValue("@status", false);
                command.Parameters.AddWithValue("@activationToken", Guid.NewGuid().ToString());

                int rowsAffected = await command.ExecuteNonQueryAsync();
                return rowsAffected > 0;
            }
        }

        public async Task<bool> IsEmailExists(string email)
        {
            string query = "SELECT COUNT(*) FROM t_user WHERE c_email = @Email";

                await _conn.OpenAsync();
                using (var command = new NpgsqlCommand(query, _conn))
                {
                    command.Parameters.AddWithValue("@Email", email);
                    int count = Convert.ToInt32(await command.ExecuteScalarAsync());
                    return count > 0;
                }
            }
        }

    }


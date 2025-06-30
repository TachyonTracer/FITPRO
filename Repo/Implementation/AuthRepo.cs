using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Npgsql;

namespace Repo
{
    public class AuthRepo : IAuthInterface
    {
        private readonly NpgsqlConnection _conn;

        public AuthRepo(NpgsqlConnection conn)
        {
            _conn = conn;
        }

        // DRY: Centralized method for executing scalar queries with parameters
        private async Task<T> ExecuteScalarAsync<T>(string query, Action<NpgsqlCommand> paramSetter)
        {
            if (_conn.State != ConnectionState.Open)
                await _conn.OpenAsync();

            try
            {
                using var cmd = new NpgsqlCommand(query, _conn);
                paramSetter(cmd);
                var result = await cmd.ExecuteScalarAsync();
                return (result == null || result is DBNull) ? default : (T)Convert.ChangeType(result, typeof(T));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error (scalar): {ex.Message}");
                return default;
            }
            finally
            {
                if (_conn.State != ConnectionState.Closed)
                    await _conn.CloseAsync();
            }
        }

        // DRY: Centralized method for executing reader queries with parameters
        private async Task<T> ExecuteReaderSingleAsync<T>(string query, Action<NpgsqlCommand> paramSetter, Func<NpgsqlDataReader, T> map)
        {
            if (_conn.State != ConnectionState.Open)
                await _conn.OpenAsync();

            try
            {
                using var cmd = new NpgsqlCommand(query, _conn);
                paramSetter(cmd);
                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    var result = map(reader);
                    return result != null ? result : default;
                }
                return default;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error (reader): {ex.Message}");
                return default;
            }
            finally
            {
                if (_conn.State != ConnectionState.Closed)
                    await _conn.CloseAsync();
            }
        }

        #region Login

        public async Task<User> LoginUser(LoginVM credentials)
        {
            string query = @"SELECT * FROM t_user WHERE c_email = @Email AND c_password = @Password";
            return await ExecuteReaderSingleAsync(query, cmd =>
            {
                cmd.Parameters.AddWithValue("@Email", credentials.email);
                cmd.Parameters.AddWithValue("@Password", credentials.password);
            }, reader => new User
            {
                userId = Convert.ToInt32(reader["c_userid"]),
                email = reader["c_email"].ToString(),
                password = reader["c_password"].ToString(),
                userName = reader["c_username"].ToString(),
                status = Convert.ToBoolean(reader["c_status"]),
                // Map other fields as needed
            });
        }

        public async Task<Instructor> LoginInstructor(LoginVM credentials)
        {
            string query = @"SELECT * FROM t_instructor WHERE c_email = @Email AND c_password = @Password";
            return await ExecuteReaderSingleAsync(query, cmd =>
            {
                cmd.Parameters.AddWithValue("@Email", credentials.email);
                cmd.Parameters.AddWithValue("@Password", credentials.password);
            }, reader => new Instructor
            {
                instructorId = Convert.ToInt32(reader["c_instructorid"]),
                email = reader["c_email"].ToString(),
                password = reader["c_password"].ToString(),
                status = reader["c_status"].ToString(),
                // Map other fields as needed
            });
        }

        public async Task<User> LoginAdmin(LoginVM credentials)
        {
            string query = @"SELECT * FROM t_admin WHERE c_email = @Email AND c_password = @Password";
            return await ExecuteReaderSingleAsync(query, cmd =>
            {
                cmd.Parameters.AddWithValue("@Email", credentials.email);
                cmd.Parameters.AddWithValue("@Password", credentials.password);
            }, reader => new User
            {
                userId = Convert.ToInt32(reader["c_adminid"]),
                email = reader["c_email"].ToString(),
                password = reader["c_password"].ToString(),
                userName = reader["c_adminname"].ToString(),
                status = true // Admin is always active
            });
        }

        #endregion

        #region Reset Password

        public async Task<int> dispatchOtp(string email)
        {
            string query = @"SELECT COUNT(*) FROM t_user WHERE c_email = @Email";
            int exists = await ExecuteScalarAsync<int>(query, cmd =>
            {
                cmd.Parameters.AddWithValue("@Email", email);
            });
            if (exists == 0)
                return 0;

            // Generate OTP and store in DB (pseudo-code, implement as needed)
            int otp = new Random().Next(100000, 999999);
            string insertQuery = @"INSERT INTO t_otp (c_email, c_otp, c_createdat) VALUES (@Email, @Otp, NOW())";
            await ExecuteScalarAsync<object>(insertQuery, cmd =>
            {
                cmd.Parameters.AddWithValue("@Email", email);
                cmd.Parameters.AddWithValue("@Otp", otp);
            });
            // Send OTP via email (handled elsewhere)
            return 1;
        }

        public async Task<int> verifyOtp(string email, int OTP)
        {
            string query = @"SELECT c_otp, c_createdat FROM t_otp WHERE c_email = @Email ORDER BY c_createdat DESC LIMIT 1";
            var result = await ExecuteReaderSingleAsync<int?>(query, cmd =>
            {
                cmd.Parameters.AddWithValue("@Email", email);
            }, reader =>
            {
                int storedOtp = Convert.ToInt32(reader["c_otp"]);
                DateTime createdAt = Convert.ToDateTime(reader["c_createdat"]);
                if (storedOtp != OTP)
                    return -2; // Incorrect OTP
                if ((DateTime.UtcNow - createdAt).TotalMinutes > 10)
                    return -3; // OTP expired
                return 1; // OTP verified
            });
            return result ?? -1; // No OTP found
        }

        public async Task<int> updatePassword(string email, string newPassword, int OTP)
        {
            int otpResult = await verifyOtp(email, OTP);
            if (otpResult != 1)
                return otpResult;

            string updateQuery = @"UPDATE t_user SET c_password = @Password WHERE c_email = @Email";
            int rows = await ExecuteScalarAsync<int>(@$"
                WITH updated AS (
                    {updateQuery}
                    RETURNING 1
                )
                SELECT COUNT(*) FROM updated;", cmd =>
            {
                cmd.Parameters.AddWithValue("@Password", newPassword);
                cmd.Parameters.AddWithValue("@Email", email);
            });
            return rows > 0 ? 1 : 0;
        }

        #endregion

        #region Register

        public async Task<bool> RegisterUserAsync(User user)
        {
            string query = @"INSERT INTO t_user (c_email, c_password, c_username, c_status) VALUES (@Email, @Password, @UserName, false)";
            int rows = await ExecuteScalarAsync<int>(@$"
                WITH inserted AS (
                    {query}
                    RETURNING 1
                )
                SELECT COUNT(*) FROM inserted;", cmd =>
            {
                cmd.Parameters.AddWithValue("@Email", user.email);
                cmd.Parameters.AddWithValue("@Password", user.password);
                cmd.Parameters.AddWithValue("@UserName", user.userName);
            });
            return rows > 0;
        }

        public async Task<bool> RegisterInstructorAsync(Instructor instructor)
        {
            string query = @"INSERT INTO t_instructor (c_email, c_password, c_status) VALUES (@Email, @Password, 'Unverified')";
            int rows = await ExecuteScalarAsync<int>(@$"
                WITH inserted AS (
                    {query}
                    RETURNING 1
                )
                SELECT COUNT(*) FROM inserted;", cmd =>
            {
                cmd.Parameters.AddWithValue("@Email", instructor.email);
                cmd.Parameters.AddWithValue("@Password", instructor.password);
            });
            return rows > 0;
        }

        public async Task<bool> IsEmailExists(string email)
        {
            string query = @"SELECT COUNT(*) FROM t_user WHERE c_email = @Email";
            int count = await ExecuteScalarAsync<int>(query, cmd =>
            {
                cmd.Parameters.AddWithValue("@Email", email);
            });
            if (count > 0) return true;

            string instructorQuery = @"SELECT COUNT(*) FROM t_instructor WHERE c_email = @Email";
            int instructorCount = await ExecuteScalarAsync<int>(instructorQuery, cmd =>
            {
                cmd.Parameters.AddWithValue("@Email", email);
            });
            return instructorCount > 0;
        }

        #endregion

        #region Activation User/Instructor

        public async Task<int> ActivateUser(string token)
        {
            string query = @"UPDATE t_user SET c_status = true WHERE c_activationtoken = @Token RETURNING 1";
            int rows = await ExecuteScalarAsync<int>(query, cmd =>
            {
                cmd.Parameters.AddWithValue("@Token", token);
            });
            if (rows > 0)
                return 1;
            // Add more logic for invalid/expired/already activated as needed
            return -2;
        }

        public async Task<Dictionary<int, string>> ActivateInstructor(string token)
        {
            string query = @"UPDATE t_instructor SET c_status = 'Verified' WHERE c_activationtoken = @Token RETURNING c_instructorid, c_username";
            var result = new Dictionary<int, string>();
            if (_conn.State != ConnectionState.Open)
                await _conn.OpenAsync();

            try
            {
                using var cmd = new NpgsqlCommand(query, _conn);
                cmd.Parameters.AddWithValue("@Token", token);
                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    int id = Convert.ToInt32(reader["c_instructorid"]);
                    string name = reader["c_username"].ToString();
                    result.Add(1, name);
                }
                else
                {
                    result.Add(-2, "Invalid Activation Token");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error (ActivateInstructor): {ex.Message}");
                result.Add(-6, "Internal Error Try Again Later");
            }
            finally
            {
                if (_conn.State != ConnectionState.Closed)
                    await _conn.CloseAsync();
            }
            return result != null ? result : new Dictionary<int, string> { { -1, "Error" } };
        }

        #endregion
    }
}

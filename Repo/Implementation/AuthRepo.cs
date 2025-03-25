using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Npgsql;

namespace Repo
{
    public class Auth : IAuthInterface
    {
        private readonly NpgsqlConnection _conn;

        public Auth (NpgsqlConnection connection)
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

        public async Task<User> LoginUser(LoginVM userCredentials)
        {
            string query = @"SELECT c_userid, c_username, c_email, c_mobile, c_gender, c_dob, 
                    c_height, c_weight, c_goal, c_medicalcondition, c_profileimage, 
                    c_createdat, c_status, c_activationtoken, c_activatedon 
                 FROM t_user 
                 WHERE c_email = @Email AND c_password = @Password AND c_activatedon IS NOT NULL;";

            try
            {
            await _conn.OpenAsync();
            using (var command = new NpgsqlCommand(query, _conn))
            {
                command.Parameters.AddWithValue("@Email", userCredentials.email);
                command.Parameters.AddWithValue("@Password", userCredentials.password);

                using (var reader = await command.ExecuteReaderAsync())
                {
                if (await reader.ReadAsync())
                {
                    return new User
                    {
                    userId = reader["c_userid"] != DBNull.Value ? Convert.ToInt32(reader["c_userid"]) : 0,
                    username = reader["c_username"]?.ToString(),
                    email = reader["c_email"]?.ToString(),
                    mobile = reader["c_mobile"]?.ToString(),
                    gender = reader["c_gender"]?.ToString(),
                    dob = reader["c_dob"] != DBNull.Value ? Convert.ToDateTime(reader["c_dob"]) : null,
                    height = reader["c_height"] != DBNull.Value ? Convert.ToInt32(reader["c_height"]) : null,
                    weight = reader["c_weight"] != DBNull.Value ? Convert.ToDecimal(reader["c_weight"]) : null,
                    goal = reader["c_goal"]?.ToString(),
                    medicalCondition = reader["c_medicalcondition"]?.ToString(),
                    profileImage = reader["c_profileimage"]?.ToString(),
                    createdAt = reader["c_createdat"] != DBNull.Value ? Convert.ToDateTime(reader["c_createdat"]) : DateTime.UtcNow,
                    status = reader["c_status"] != DBNull.Value && Convert.ToBoolean(reader["c_status"]),
                    activationToken = reader["c_activationtoken"]?.ToString(),
                    activatedOn = reader["c_activatedon"] != DBNull.Value ? Convert.ToDateTime(reader["c_activatedon"]) : null
                    };
                }
                }
            }
            }
            catch (Exception ex)
            {
            Console.WriteLine($"Error during user login: {ex.Message}");
            }
            finally
            {
            if (_conn.State == System.Data.ConnectionState.Open)
                await _conn.CloseAsync();
            }

            return null; // Return null if no user is found
        }

        #region Login Admin
           public async Task<User> LoginAdmin(LoginVM userCredentials)
        {
            string query = @"SELECT c_userid, c_username, c_email, c_mobile, c_gender, c_dob, 
                    c_height, c_weight, c_goal, c_medicalcondition, c_profileimage, 
                    c_createdat, c_status, c_activationtoken, c_activatedon 
                 FROM t_user 
                 WHERE c_email = @Email AND c_password = @Password AND c_activatedon IS NOT NULL;";

            try
            {
            await _conn.OpenAsync();
            using (var command = new NpgsqlCommand(query, _conn))
            {
                command.Parameters.AddWithValue("@Email", userCredentials.email);
                command.Parameters.AddWithValue("@Password", userCredentials.password);

                using (var reader = await command.ExecuteReaderAsync())
                {
                if (await reader.ReadAsync())
                {
                    return new User
                    {
                    userId = reader["c_userid"] != DBNull.Value ? Convert.ToInt32(reader["c_userid"]) : 0,
                    username = reader["c_username"]?.ToString(),
                    email = reader["c_email"]?.ToString(),
                    mobile = reader["c_mobile"]?.ToString(),
                    gender = reader["c_gender"]?.ToString(),
                    dob = reader["c_dob"] != DBNull.Value ? Convert.ToDateTime(reader["c_dob"]) : null,
                    height = reader["c_height"] != DBNull.Value ? Convert.ToInt32(reader["c_height"]) : null,
                    weight = reader["c_weight"] != DBNull.Value ? Convert.ToDecimal(reader["c_weight"]) : null,
                    goal = reader["c_goal"]?.ToString(),
                    medicalCondition = reader["c_medicalcondition"]?.ToString(),
                    profileImage = reader["c_profileimage"]?.ToString(),
                    createdAt = reader["c_createdat"] != DBNull.Value ? Convert.ToDateTime(reader["c_createdat"]) : DateTime.UtcNow,
                    status = reader["c_status"] != DBNull.Value && Convert.ToBoolean(reader["c_status"]),
                    activationToken = reader["c_activationtoken"]?.ToString(),
                    activatedOn = reader["c_activatedon"] != DBNull.Value ? Convert.ToDateTime(reader["c_activatedon"]) : null
                    };
                }
                }
            }
            }
            catch (Exception ex)
            {
            Console.WriteLine($"Error during user login: {ex.Message}");
            }
            finally
            {
            if (_conn.State == System.Data.ConnectionState.Open)
                await _conn.CloseAsync();
            }

            return null; // Return null if no user is found
        }
        #endregion

        public async Task<Instructor> LoginInstructor(LoginVM userCredentials)
        {
            string query = @"SELECT c_id, c_name, c_email, c_mobile, c_gender, c_dob, 
                            c_specialization, c_certificates, c_profileimage, c_association, 
                            c_createdat, c_status, c_idproof, c_activationtoken, c_activatedon 
                     FROM t_instructor 
                     WHERE c_email = @Email AND c_password = @Password AND c_activatedon IS NOT NULL;";

            try
            {
                await _conn.OpenAsync();
                using (var command = new NpgsqlCommand(query, _conn))
                {
                    command.Parameters.AddWithValue("@Email", userCredentials.email);
                    command.Parameters.AddWithValue("@Password", userCredentials.password);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new Instructor
                            {
                                instructorId = reader["c_id"] != DBNull.Value ? Convert.ToInt32(reader["c_id"]) : 0,
                                instructorName = reader["c_name"]?.ToString(),
                                email = reader["c_email"]?.ToString(),
                                mobile = reader["c_mobile"]?.ToString(),
                                gender = reader["c_gender"]?.ToString(),
                                dob = reader["c_dob"] != DBNull.Value ? Convert.ToDateTime(reader["c_dob"]) : null,
                                specialization = reader["c_specialization"]?.ToString(),
                                certificates = reader["c_certificates"] != DBNull.Value ? JsonDocument.Parse(reader["c_certificates"].ToString()) : null,
                                profileImage = reader["c_profileimage"]?.ToString(),
                                association = reader["c_association"]?.ToString(),
                                createdAt = reader["c_createdat"] != DBNull.Value ? Convert.ToDateTime(reader["c_createdat"]) : DateTime.UtcNow,
                                status = reader["c_status"]?.ToString(),
                                idProof = reader["c_idproof"]?.ToString(),
                                activationToken = reader["c_activationtoken"]?.ToString(),
                                activatedOn = reader["c_activatedon"] != DBNull.Value ? Convert.ToDateTime(reader["c_activatedon"]) : null
                            };
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during instructor login: {ex.Message}");
            }
            finally
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();
            }

            return null; // Return null if no instructor is found
        }



    }
}

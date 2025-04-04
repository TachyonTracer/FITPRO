
using System.Security.Cryptography;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;


namespace Repo
{
    public class AuthRepo : IAuthInterface
    {
        private readonly NpgsqlConnection _conn;
        private readonly IEmailInterface _email;
        public AuthRepo(NpgsqlConnection conn, IEmailInterface email)
        {
            _conn = conn;
            _email = email;
        }

        #region Reset Password

        #region Dispatch OTP
        public async Task<int> dispatchOtp(string email)
        {
            // six digit otp

            int OTP = RandomNumberGenerator.GetInt32(100000, 999999);
            int result = 0;
            int userID = 0;
            string userName = null;
            string role = null;
            try
            {
                if (_conn.State == System.Data.ConnectionState.Closed)
                {
                    await _conn.OpenAsync();
                }

                string userQuery = "SELECT c_userid,c_username, 'User' FROM t_User WHERE c_email = @Email and c_status = TRUE";
                using (var cmd = new NpgsqlCommand(userQuery, _conn))
                {
                    cmd.Parameters.AddWithValue("@Email", email);
                    using var reader = await cmd.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        userID = reader.GetInt32(0);
                        userName = reader.GetString(1);
                        role = reader.GetString(2);
                    }
                }

                // If not found in t_User, check in t_Instructor
                if (userID == 0)
                {
                    string instructorQuery = "SELECT c_instructorid, c_instructorname, 'Instructor' FROM t_Instructor WHERE c_email = @Email and c_status = 'Approved'";
                    using (var cmd = new NpgsqlCommand(instructorQuery, _conn))
                    {
                        cmd.Parameters.AddWithValue("@Email", email);
                        using var reader = await cmd.ExecuteReaderAsync();
                        if (await reader.ReadAsync())
                        {
                            userID = reader.GetInt32(0);
                            userName = reader.GetString(1);
                            role = reader.GetString(2);
                        }
                    }
                }

                // If not found, return 0
                if (userID == 0)
                {
                    // not found any user
                    return 0;
                }

                string insertQuery = @"
            INSERT INTO t_reset_password (c_userid, c_otp, c_expiry_at, c_role, c_created_at)
            VALUES (@UserId, @Otp, @ExpiryAt, @Role, NOW())";

                using (var cmd = new NpgsqlCommand(insertQuery, _conn))
                {
                    cmd.Parameters.AddWithValue("@UserId", userID);
                    cmd.Parameters.AddWithValue("@Otp", OTP);
                    cmd.Parameters.AddWithValue("@ExpiryAt", DateTime.Now.AddMinutes(10)); // Expiry in 10 minutes
                    cmd.Parameters.AddWithValue("@Role", role);

                    await cmd.ExecuteNonQueryAsync();
                }

                // send email (email,usernmae, otp)
                await _email.SendOtpEmail(userName, email, OTP.ToString());
                result = 1;
            }
            catch (System.Exception ex)
            {
                System.Console.WriteLine("Disptach OTP--->" + ex.Message);
                throw;
            }
            finally
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                {
                    await _conn.CloseAsync();
                }
            }
            return result;
        }
        #endregion


        #region Verify OTP
        public async Task<int> verifyOtp(string email, int OTP)
        {

            int result = 0;
            bool is_OTPUsed = false;
            try
            {
                if (_conn.State == System.Data.ConnectionState.Closed)
                {
                    await _conn.OpenAsync();
                }
                int userId = 0;

                // Check in t_User
                string userQuery = "SELECT c_userid FROM t_User WHERE c_email = @Email";
                using (var cmd = new NpgsqlCommand(userQuery, _conn))
                {
                    cmd.Parameters.AddWithValue("@Email", email);
                    using var reader = await cmd.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        userId = reader.GetInt32(0);
                    }
                }

                // If not found in t_User, check in t_Instructor
                if (userId == 0)
                {
                    string instructorQuery = "SELECT c_instructorid FROM t_Instructor WHERE c_email = @Email";
                    using (var cmd = new NpgsqlCommand(instructorQuery, _conn))
                    {
                        cmd.Parameters.AddWithValue("@Email", email);
                        using var reader = await cmd.ExecuteReaderAsync();
                        if (await reader.ReadAsync())
                        {
                            userId = reader.GetInt32(0);
                        }
                    }
                }

                // If email not found, return 0
                if (userId == 0)
                {
                    return 0; // Email not registered
                }
                string otpQuery = @"
                    SELECT c_otp, c_expiry_at,c_isused FROM t_reset_password 
                    WHERE c_userid = @UserId 
                    ORDER BY c_created_at DESC 
                    LIMIT 1";

                using (var cmd = new NpgsqlCommand(otpQuery, _conn))
                {
                    cmd.Parameters.AddWithValue("@UserId", userId);
                    using var reader = await cmd.ExecuteReaderAsync();

                    if (!await reader.ReadAsync())
                    {
                        return -1; // No OTP found for this user
                    }

                    int storedOtp = reader.GetInt32(0);
                    DateTime expiryAt = reader.GetDateTime(1);
                    is_OTPUsed = reader.GetBoolean(2);

                    if (storedOtp != OTP)
                    {
                        return -2; // Incorrect OTP
                    }

                    if (expiryAt < DateTime.Now)
                    {
                        return -3; // OTP expired
                    }

                    if (is_OTPUsed)
                    {
                        return -3; // opt is used
                    }

                }

                return 1;
            }
            catch (System.Exception ex)
            {
                System.Console.WriteLine("Error in verfying otp" + ex.Message);

            }
            finally
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                {
                    await _conn.CloseAsync();
                }
            }
            return result;
        }
        #endregion



        #region Update password
        public async Task<int> updatePassword(string email, string newPassword, int OTP)
        {
            int result = 0;

            try
            {
                if (_conn.State == System.Data.ConnectionState.Closed)
                {
                    await _conn.OpenAsync();
                }
                int userId = 0;
                string role = null;
                string tableName = null;
                string idColumn = null;
                string passwordColumn = "c_password";
                bool is_OTPUsed = false;

                // Check in t_User
                string userQuery = "SELECT c_userid, 'User' FROM t_User WHERE c_email = @Email";
                using (var cmd = new NpgsqlCommand(userQuery, _conn))
                {
                    cmd.Parameters.AddWithValue("@Email", email);
                    using var reader = await cmd.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        userId = reader.GetInt32(0);
                        role = reader.GetString(1);
                        tableName = "t_User";
                        idColumn = "c_userid";
                    }
                }

                // If not found in t_User, check in t_Instructor
                if (userId == 0)
                {
                    string instructorQuery = "SELECT c_instructorid, 'Instructor' FROM t_Instructor WHERE c_email = @Email";
                    using (var cmd = new NpgsqlCommand(instructorQuery, _conn))
                    {
                        cmd.Parameters.AddWithValue("@Email", email);
                        using var reader = await cmd.ExecuteReaderAsync();
                        if (await reader.ReadAsync())
                        {
                            userId = reader.GetInt32(0);
                            role = reader.GetString(1);
                            tableName = "t_Instructor";
                            idColumn = "c_instructorid";
                        }
                    }
                }

                // If email not found, return -1
                if (userId == 0)
                {
                    return -1; // Email not registered
                }

                // Verify OTP
                string otpQuery = @"
                    SELECT c_otp, c_expiry_at, c_isused FROM t_reset_password 
                    WHERE c_userid = @UserId 
                    ORDER BY c_created_at DESC 
                    LIMIT 1";

                using (var cmd = new NpgsqlCommand(otpQuery, _conn))
                {
                    cmd.Parameters.AddWithValue("@UserId", userId);
                    using var reader = await cmd.ExecuteReaderAsync();

                    if (!await reader.ReadAsync())
                    {
                        return -2; // No OTP found
                    }

                    int storedOtp = reader.GetInt32(0);
                    DateTime expiryAt = reader.GetDateTime(1);
                    is_OTPUsed = reader.GetBoolean(2);

                    if (storedOtp != OTP)
                    {
                        return -3; // Incorrect OTP
                    }

                    if (expiryAt < DateTime.Now)
                    {
                        return -4; // OTP expired
                    }
                    if (is_OTPUsed)
                    {
                        return -4; // otp is used
                    }


                }

                string updateOtpQuery = @"
                UPDATE t_reset_password 
                SET c_isused = TRUE 
                WHERE c_userid = @UserId AND c_otp = @OTP";
                using (var cmd = new NpgsqlCommand(updateOtpQuery, _conn))
                {
                    cmd.Parameters.AddWithValue("@UserId", userId);
                    cmd.Parameters.AddWithValue("@OTP", OTP);
                    await cmd.ExecuteNonQueryAsync();
                }



                // Update password in t_User or t_Instructor
                string updateQuery = $@"
                    UPDATE {tableName} 
                    SET {passwordColumn} = @NewPassword 
                    WHERE {idColumn} = @UserId";

                using (var cmd = new NpgsqlCommand(updateQuery, _conn))
                {
                    cmd.Parameters.AddWithValue("@NewPassword", newPassword);
                    cmd.Parameters.AddWithValue("@UserId", userId);

                    int rowsAffected = await cmd.ExecuteNonQueryAsync();
                    return rowsAffected > 0 ? 1 : -5; // -5 if update failed for some reason
                }
            }
            catch (System.Exception ex)
            {

                System.Console.WriteLine("Error at updating the password -->" + ex.Message);
            }
            return result;
        }
        #endregion

        #endregion


        #region Register User
        public async Task<bool> RegisterUserAsync(User user)
        {
            string email = null;
            string username = null;
            string activationURL = "http://localhost:8080/api/AuthApi/activateuser?token=";
            string activationToken = Guid.NewGuid().ToString();
            string query = @"INSERT INTO t_user 
                            (c_username, c_email, c_password, c_mobile, c_gender, c_dob, c_height, c_weight, 
                             c_goal, c_medicalcondition, c_profileimage, c_createdat, c_status, c_activationtoken) 
                            VALUES 
                            (@username, @email, @password, @mobile, @gender, @dob, @height, @weight, 
                             @goal, @medicalCondition, @profileImage, @createdAt, @status, @activationToken)";

            try
            {
                // Ensure connection is closed before opening
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();

                await _conn.OpenAsync();




                using (var command = new NpgsqlCommand(query, _conn))
                {
                    command.Parameters.AddWithValue("@username", user.userName);
                    command.Parameters.AddWithValue("@email", user.email);
                    command.Parameters.AddWithValue("@password", user.password);
                    command.Parameters.AddWithValue("@mobile", user.mobile);
                    command.Parameters.AddWithValue("@gender", user.gender);
                    command.Parameters.AddWithValue("@dob", user.dob ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@height", user.height ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@weight", user.weight ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@goal", user.goal ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@medicalCondition", user.medicalCondition ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@profileImage", user.profileImage ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@createdAt", DateTime.UtcNow);
                    command.Parameters.AddWithValue("@status", user.status);
                    command.Parameters.AddWithValue("@activationToken", activationToken);

                    username = user.userName;
                    email = user.email;
                    activationURL += activationToken;
                    int rowsAffected = await command.ExecuteNonQueryAsync();
                    await _email.SendActivationLink(email, username, activationURL);
                    return rowsAffected > 0;
                }
            }
            finally
            {
                // Always close the connection in finally block
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }
        #endregion

        #region  Register Instructor
        public async Task<bool> RegisterInstructorAsync(Instructor instructor)
        {

            string email = null;
            string username = null;
            string activationURL = "http://localhost:8080/api/AuthApi/activateinstructor?token=";
            string activationToken = Guid.NewGuid().ToString();
            string query = @"INSERT INTO t_instructor 
                            (c_instructorname, c_email, c_password, c_mobile, c_gender, c_dob, c_specialization, 
                             c_certificates, c_profileimage, c_association, c_createdat, c_status, c_idproof, c_activationtoken) 
                            VALUES 
                            (@instructorName, @email, @password, @mobile, @gender, @dob, @specialization, 
                             @certificates, @profileImage, @association, @createdAt, @status, @idProof, @activationToken)";

            try
            {
                // Ensure connection is closed before opening
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();

                await _conn.OpenAsync();
                instructor.status = "Unverified";
                Console.WriteLine(activationToken);

                using (var command = new NpgsqlCommand(query, _conn))
                {
                    command.Parameters.AddWithValue("@instructorName", instructor.instructorName);
                    command.Parameters.AddWithValue("@email", instructor.email);
                    command.Parameters.AddWithValue("@password", instructor.password);
                    command.Parameters.AddWithValue("@mobile", instructor.mobile);
                    command.Parameters.AddWithValue("@gender", instructor.gender);
                    command.Parameters.AddWithValue("@dob", instructor.dob);
                    command.Parameters.AddWithValue("@specialization", instructor.specialization ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@certificates", instructor.certificates ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@profileImage", instructor.profileImage ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@association", instructor.association ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@idProof", instructor.idProof ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@createdAt", DateTime.UtcNow);
                    command.Parameters.AddWithValue("@status", instructor.status);
                    command.Parameters.AddWithValue("@activationToken", activationToken);

                    int rowsAffected = await command.ExecuteNonQueryAsync();
                    username = instructor.instructorName;
                    email = instructor.email;
                    activationURL += activationToken;
                    await _email.SendActivationLink(email, username, activationURL);
                    return rowsAffected > 0;
                }
            }
            finally
            {
                // Always close the connection in finally block
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }
        #endregion

        #region Check Email
        public async Task<bool> IsEmailExists(string email)
        {
            string query = "SELECT COUNT(*) FROM (SELECT c_email FROM t_user UNION SELECT c_email FROM t_instructor) AS combined WHERE c_email = @Email";

            try
            {
                // Ensure connection is closed before opening
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();

                await _conn.OpenAsync();

                using (var command = new NpgsqlCommand(query, _conn))
                {
                    command.Parameters.AddWithValue("@Email", email);
                    int count = Convert.ToInt32(await command.ExecuteScalarAsync());
                    return count > 0;
                }
            }
            finally
            {
                // Always close the connection in finally block
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }


        #endregion

        #region Login Repo

        #region Login User

        public async Task<User> LoginUser(LoginVM userCredentials)
        {
            string query = @"SELECT c_userid, c_username, c_email, c_mobile, c_gender, c_dob, 
                    c_height, c_weight, c_goal, c_medicalcondition, c_profileimage, 
                    c_createdat, c_status, c_activationtoken, c_activatedon 
                 FROM t_user 
                 WHERE c_email = @Email AND c_password = @Password AND c_status IS NOT NULL;";

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
                                userName
                             = reader["c_username"]?.ToString(),
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
                {
                    await _conn.CloseAsync();
                }
            }
            return null;
        }
        #endregion




        #endregion

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
                                userName = reader["c_username"]?.ToString(),
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
                {
                    await _conn.CloseAsync();
                }
            }
            return null;
        }

        #endregion

        #region Login Instructor
        public async Task<Instructor> LoginInstructor(LoginVM userCredentials)
        {
            string query = @"SELECT c_instructorid, c_instructorname, c_email, c_mobile, c_gender, c_dob, 
                            c_specialization, c_certificates, c_profileimage, c_association, 
                            c_createdat, c_status, c_idproof, c_activationtoken, c_activatedon 
                     FROM t_instructor 
                     WHERE c_email = @Email AND c_password = @Password AND c_status IS NOT NULL;";

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
                                instructorId = reader["c_instructorid"] != DBNull.Value ? Convert.ToInt32(reader["c_instructorid"]) : 0,
                                instructorName = reader["c_instructorname"]?.ToString(),
                                email = reader["c_email"]?.ToString(),
                                mobile = reader["c_mobile"]?.ToString(),
                                gender = reader["c_gender"]?.ToString(),
                                dob = Convert.ToDateTime(reader["c_dob"]),
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
        #endregion



        #region Activation user/Instructor
        #region Activate User

        public async Task<int> ActivateUser(string token)
        {
            try
            {
                if (string.IsNullOrEmpty(token))
                    return -1; // No token provided

                if (_conn.State == System.Data.ConnectionState.Closed)
                {
                    await _conn.OpenAsync();
                }

                string query = "SELECT c_userid, c_status FROM t_User WHERE c_activationtoken = @Token";
                int userId = 0;
                bool isActivated = false;

                using (var cmd = new NpgsqlCommand(query, _conn))
                {
                    cmd.Parameters.AddWithValue("Token", token);

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        if (!reader.Read())
                            return -2; // Token not found

                        userId = reader.GetInt32(0);
                        isActivated = reader.GetBoolean(1);
                    }
                }

                if (isActivated)
                    return -3; // User already activated

                string updateQuery = "UPDATE t_User SET c_status = TRUE, c_activatedon = NOW(), c_activationtoken = NULL WHERE c_userid = @UserId";

                using (var updateCmd = new NpgsqlCommand(updateQuery, _conn))
                {
                    updateCmd.Parameters.AddWithValue("UserId", userId);
                    await updateCmd.ExecuteNonQueryAsync();
                }

                return 1; // Activation successful
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error at activation user ---> " + ex.Message);
                return -4; // Internal error
            }
            finally
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                {
                    await _conn.CloseAsync();
                }
            }
        }
        #endregion


        #region Activate Instructor

        public async Task<Dictionary<int, string>> ActivateInstructor(string token)
        {
            try
            {
                var result = new Dictionary<int, string>();

                if (string.IsNullOrEmpty(token))
                {
                    result.Add(-1, "No token provided");
                    return result;
                }

                if (_conn.State == System.Data.ConnectionState.Closed)
                {
                    await _conn.OpenAsync();
                }

                string query = "SELECT c_instructorid, c_instructorname, c_status FROM t_Instructor WHERE c_activationtoken = @Token";
                int instructorId = 0;
                string instructorName = "";
                string status = "";

                using (var cmd = new NpgsqlCommand(query, _conn))
                {
                    cmd.Parameters.AddWithValue("@Token", token);

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        if (!reader.Read())
                        {
                            result.Add(-2, "Token not found");
                            return result;
                        }

                        instructorId = reader.GetInt32(0);
                        instructorName = reader.GetString(1);
                        status = reader.GetString(2);
                    }
                }

                if (status == "Verified")
                {
                    result.Add(-3, instructorName); // Already activated
                    return result;
                }

                if (status != "Unverified")
                {
                    result.Add(-4, instructorName); // Invalid status (should never happen)
                    return result;
                }

                string updateQuery = "UPDATE t_Instructor SET c_status = 'Verified', c_activatedon = NOW(), c_activationtoken = NULL WHERE c_instructorid = @InstructorId AND c_status = 'Unverified'";

                using (var updateCmd = new NpgsqlCommand(updateQuery, _conn))
                {
                    updateCmd.Parameters.AddWithValue("InstructorId", instructorId);
                    int rowsAffected = await updateCmd.ExecuteNonQueryAsync();

                    if (rowsAffected == 0)
                    {
                        result.Add(-5, instructorName); // Instructor was already verified before updating
                        return result;
                    }
                }

                result.Add(1, instructorName); // Activation successful
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error at activating instructor ---> " + ex.Message);
                return new Dictionary<int, string> { { -6, "Internal error" } }; // Internal error
            }
            finally
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                {
                    await _conn.CloseAsync();
                }
            }
        }

        #endregion

        #endregion
    }
}

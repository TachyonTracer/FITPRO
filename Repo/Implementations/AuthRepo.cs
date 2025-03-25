
using System.Security.Cryptography;
using Npgsql;

public class AuthRepo : IAuthInterface
{

    public readonly NpgsqlConnection _conn;
    public AuthRepo(NpgsqlConnection npgsqlConnection)
    {
        _conn = npgsqlConnection;
    }

    #region Reset Password
    public async Task<int> dispatchOtp(string email)
    {
        int OTP = RandomNumberGenerator.GetInt32(10000000, 99999999);
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

            string userQuery = "SELECT c_userid,c_username, 'User' FROM t_User WHERE c_email = @Email";
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
                string instructorQuery = "SELECT c_instructorid, c_instructorname, 'Instructor' FROM t_Instructor WHERE c_email = @Email";
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
    public async Task<int> verifyOtp(string email, int OTP)
    {

        int result = 0;
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
                    SELECT c_otp, c_expiry_at FROM t_reset_password 
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

                if (storedOtp != OTP)
                {
                    return -2; // Incorrect OTP
                }

                if (expiryAt < DateTime.Now)
                {
                    return -3; // OTP expired
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
                    SELECT c_otp, c_expiry_at FROM t_reset_password 
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

                if (storedOtp != OTP)
                {
                    return -3; // Incorrect OTP
                }

                if (expiryAt < DateTime.Now)
                {
                    return -4; // OTP expired
                }
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

}
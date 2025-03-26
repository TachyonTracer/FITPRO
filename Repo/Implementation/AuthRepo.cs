using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Npgsql;

namespace Repo
{
    public class AuthRepo : IAuthInterface
    {
        private readonly NpgsqlConnection _conn;

        public AuthRepo(NpgsqlConnection connection)
        {
            _conn = connection;
        }

        public async Task<bool> RegisterUserAsync(User user)
        {
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

                    int rowsAffected = await command.ExecuteNonQueryAsync();
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

        public async Task<bool> RegisterInstructorAsync(Instructor instructor)
        {
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
                
                using (var command = new NpgsqlCommand(query, _conn))
                {
                    command.Parameters.AddWithValue("@instructorName", instructor.instructorName);
                    command.Parameters.AddWithValue("@email", instructor.email);
                    command.Parameters.AddWithValue("@password", instructor.password);
                    command.Parameters.AddWithValue("@mobile", instructor.mobile);
                    command.Parameters.AddWithValue("@gender", instructor.gender);
                    command.Parameters.AddWithValue("@dob", instructor.dob );
                    command.Parameters.AddWithValue("@specialization", instructor.specialization ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@certificates", instructor.certificates ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@profileImage", instructor.profileImage ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@association", instructor.association ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@idProof", instructor.idProof ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@createdAt", DateTime.UtcNow);
                    command.Parameters.AddWithValue("@status", instructor.status);
                    command.Parameters.AddWithValue("@activationToken", activationToken);

                    int rowsAffected = await command.ExecuteNonQueryAsync();
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
    }
}

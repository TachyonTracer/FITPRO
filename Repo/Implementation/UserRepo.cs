using System;
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
    

   
}

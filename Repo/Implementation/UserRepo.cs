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

	#region Get All Users
	public async Task<List<User>> GetAllUsers()
	{
		var userList = new List<User>();

		try
		{
			if (_conn.State != ConnectionState.Open)
			{
				await _conn.OpenAsync();
			}

			using (var cmd = new NpgsqlCommand(@"SELECT * FROM t_user", _conn))
			{
				using (var dr = await cmd.ExecuteReaderAsync())
				{
					while (dr.Read())
					{
						userList.Add(new User()
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
							activatedOn = dr["c_activatedon"] == DBNull.Value ? null : dr.GetDateTime(dr.GetOrdinal("c_activatedon"))
						});
					}
				}
			}
		}
		catch (Exception ex)
		{
			Console.WriteLine("------>Error while Fetching All Instructors" + ex.Message);
		}
		finally
		{
			if (_conn.State != ConnectionState.Closed)
			{
				await _conn.CloseAsync();
			}
		}
		return userList;
	}

	#endregion

	#region Get One User By Id
	public async Task<User> GetAllUsersById(int userId)
	{
		User user = null;

		try
		{
			if (_conn.State != ConnectionState.Open)
			{
				await _conn.OpenAsync();
			}

			using (var cmd = new NpgsqlCommand(@"SELECT * FROM t_user WHERE c_userid = @userId", _conn))
			{
				cmd.Parameters.AddWithValue("@userId", userId);

				using (var dr = await cmd.ExecuteReaderAsync())
				{
					if (await dr.ReadAsync())
					{
						user = new User()
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
							activatedOn = dr["c_activatedon"] == DBNull.Value ? null : dr.GetDateTime(dr.GetOrdinal("c_activatedon"))
						};
					}
				}
			}
		}
		catch (Exception ex)
		{
			Console.WriteLine("Error while fetching user by ID: " + ex.Message);
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

	#region Get All Users By ClassId
	public async Task<List<User>> GetAllUsersByClassId(int classId)
	{
		var userList = new List<User>();

		string qry = @"
		SELECT b.c_classid,u.*
		FROM t_bookings b
		JOIN t_user u ON b.c_userid = u.c_userid
		WHERE b.c_classid=@c_classid ORDER BY b.c_classid
		";

		try
		{
			if (_conn.State != ConnectionState.Open)
			{
				await _conn.OpenAsync();
			}

			using (var cmd = new NpgsqlCommand(qry, _conn))
			{
				cmd.Parameters.AddWithValue("@c_classid", classId);
				using (var dr = await cmd.ExecuteReaderAsync())
				{
					while (dr.Read())
					{
						userList.Add(new User()
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
							activatedOn = dr["c_activatedon"] == DBNull.Value ? null : dr.GetDateTime(dr.GetOrdinal("c_activatedon"))
						});
					}
				}
			}
		}
		catch (Exception ex)
		{
			Console.WriteLine("------>Error while Fetching All Users By ClassId" + ex.Message);
		}
		finally
		{
			if (_conn.State != ConnectionState.Closed)
			{
				await _conn.CloseAsync();
			}
		}
		return userList;
	}

	#endregion

	#region Get All Users By InstructorId
	public async Task<List<User>> GetAllUsersByInstructorId(int instructorId)
	{
		var userList = new List<User>();

		string qry = @"
		SELECT c.c_instructorid,u.*
		FROM t_bookings b
		JOIN t_class c ON b.c_classid = c.c_classid
		JOIN t_user u ON b.c_userid = u.c_userid
		WHERE c.c_instructorid = @c_instructorid 
		ORDER BY c.c_instructorid
		";

		try
		{
			if (_conn.State != ConnectionState.Open)
			{
				await _conn.OpenAsync();
			}

			using (var cmd = new NpgsqlCommand(qry, _conn))
			{
				cmd.Parameters.AddWithValue("@c_instructorid", instructorId);
				using (var dr = await cmd.ExecuteReaderAsync())
				{
					while (dr.Read())
					{
						userList.Add(new User()
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
							activatedOn = dr["c_activatedon"] == DBNull.Value ? null : dr.GetDateTime(dr.GetOrdinal("c_activatedon"))
						});
					}
				}
			}
		}
		catch (Exception ex)
		{
			Console.WriteLine("------>Error while Fetching All Users By Instructor" + ex.Message);
		}
		finally
		{
			if (_conn.State != ConnectionState.Closed)
			{
				await _conn.CloseAsync();
			}
		}
		return userList;
	}

	#endregion

	#region Suspend User
	public async Task<bool> SuspendUser(string userId, string reason)
	{
		bool isSuccess = false;
		try
		{
			if (_conn.State != ConnectionState.Open)
			{
				await _conn.OpenAsync();
			}

			using (var cmd = new NpgsqlCommand("UPDATE t_user SET c_status ='false',c_reason = @c_reason WHERE c_userid = @c_userid", _conn))
			{
				cmd.Parameters.AddWithValue("@c_userid", Convert.ToInt32(userId));
				cmd.Parameters.AddWithValue("@c_reason", reason);


				int rowsAffected = await cmd.ExecuteNonQueryAsync();
				isSuccess = rowsAffected > 0;
				using (var readcmd = new NpgsqlCommand(@"SELECT 
                                            c_userid,
                                            c_username,
                                            c_email,
                                            c_reason
                                            FROM t_user 
											WHERE c_userid = @c_userid", _conn))
                                           
				{
					readcmd.Parameters.AddWithValue("@c_userid", Convert.ToInt32(userId));

					var reader = await readcmd.ExecuteReaderAsync();
					if (reader.Read())
					{
						var instructorName = Convert.ToString(reader["c_username"]);
						var email = Convert.ToString(reader["c_email"]);
						var reasons = Convert.ToString(reader["c_reason"]);

						await _email.SendSuspendUserEmail(email, instructorName, reasons);
					}
				}
			}
		}
		catch (Exception ex)
		{
			Console.WriteLine($"Error while Suspending User: {ex.Message}");
		}
		finally
		{
			if (_conn.State != ConnectionState.Closed)
			{
				await _conn.CloseAsync();
			}
		}
		return isSuccess;
	}
	#endregion

	#region Update User Profile
	public async Task<bool> UpdateUserProfileAsync(User user)
	{
		System.Console.WriteLine("UpdateUserProfileAsync" + user.userId + " image path is " + user.profileImage);
		string query = @"UPDATE t_user 
                            SET c_username = @username,                                
                                c_height = @height,
                                c_mobile=@mobile,
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

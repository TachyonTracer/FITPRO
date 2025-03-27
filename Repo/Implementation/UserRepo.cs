using System.Data;
using Npgsql;
namespace Repo;

public class UserRepo : IUserInterface
{
	private readonly NpgsqlConnection _conn;

	public UserRepo(NpgsqlConnection conn)
	{
		_conn = conn;
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

}


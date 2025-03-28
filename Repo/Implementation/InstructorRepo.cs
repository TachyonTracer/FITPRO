using System.Text.Json;
using Npgsql;
using Repo;

public class InstructorRepo : IInstructorInterface
{

	private readonly NpgsqlConnection _conn;

	public InstructorRepo(NpgsqlConnection conn)
	{
		_conn = conn;

	}

	#region Edit Profile By Paras

	#region Edit Profile Basic
	public async Task<int> EditProfileBasic(Instructor instructor)
	{

		string query = @"
					UPDATE t_instructor SET 
						c_instructorname = @c_instructorname,
						c_mobile = @c_mobile,
						c_gender = @c_gender,
						c_dob = @c_dob,
						c_profileimage = @c_profileimage
					WHERE c_instructorid = @c_instructorid";

		if (_conn.State != System.Data.ConnectionState.Open)
		{
			await _conn.OpenAsync();
		}

		try
		{

			using (NpgsqlCommand cmd = new NpgsqlCommand(query, _conn))
			{

				cmd.Parameters.AddWithValue("@c_instructorid", instructor.instructorId);
				cmd.Parameters.AddWithValue("@c_instructorname", instructor.instructorName ?? (object)DBNull.Value);
				cmd.Parameters.AddWithValue("@c_mobile", instructor.mobile ?? (object)DBNull.Value);
				cmd.Parameters.AddWithValue("@c_gender", instructor.gender ?? (object)DBNull.Value);
				cmd.Parameters.AddWithValue("@c_dob", NpgsqlTypes.NpgsqlDbType.Date,instructor.dob );
				cmd.Parameters.AddWithValue("@c_profileimage", instructor.profileImage ?? (object)DBNull.Value);


				int rowsAffected = await cmd.ExecuteNonQueryAsync();
				return rowsAffected;

			}

		}
		catch (Exception ex)
		{
			Console.WriteLine("Error While Updating Profile Basic : " + ex.Message);
			return -1;

		}
		finally
		{

			await _conn.CloseAsync();

		}

	}

	#endregion

	#region Get One Instrctor

	public async Task<Instructor?> GetOneInstructorByIdForProfile(int instructorId)
	{
		string query = @"
					 SELECT 
						c_instructorid, c_instructorname, c_email, c_mobile, c_gender, c_dob, 
						c_specialization, c_certificates, c_profileimage, c_association, 
						c_createdat, c_status, c_idproof, c_activationtoken, c_activatedon 
					FROM t_instructor
						WHERE c_instructorid = @InstructorId";

		if (_conn.State != System.Data.ConnectionState.Open)
		{
			_conn.Open();
		}

		try
		{

			using (NpgsqlCommand cmd = new NpgsqlCommand(query, _conn))
			{

				cmd.Parameters.AddWithValue("@InstructorId", instructorId);

				using var reader = await cmd.ExecuteReaderAsync();
				if (await reader.ReadAsync())
				{
					return new Instructor
					{
						instructorId = reader.GetInt32(reader.GetOrdinal("c_instructorid")),
						instructorName = reader.GetString(reader.GetOrdinal("c_instructorname")),
						email = reader.GetString(reader.GetOrdinal("c_email")),
						password = null,  // Do not return password for security reasons
						confirmPassword = null,
						mobile = reader.GetString(reader.GetOrdinal("c_mobile")),
						gender = reader.GetString(reader.GetOrdinal("c_gender")),
						dob = reader.GetDateTime(reader.GetOrdinal("c_dob")),
						specialization = reader.GetString(reader.GetOrdinal("c_specialization")),
						certificates = reader.IsDBNull(reader.GetOrdinal("c_certificates"))
							? null
							: JsonDocument.Parse(reader.GetString(reader.GetOrdinal("c_certificates"))),
						profileImage = reader.IsDBNull(reader.GetOrdinal("c_profileimage")) ? null : reader.GetString(reader.GetOrdinal("c_profileimage")),
						association = reader.IsDBNull(reader.GetOrdinal("c_association")) ? null : reader.GetString(reader.GetOrdinal("c_association")),
						createdAt = reader.GetDateTime(reader.GetOrdinal("c_createdat")),
						status = reader.GetString(reader.GetOrdinal("c_status")),
						idProof = reader.IsDBNull(reader.GetOrdinal("c_idproof")) ? null : reader.GetString(reader.GetOrdinal("c_idproof")),
						activationToken = reader.IsDBNull(reader.GetOrdinal("c_activationtoken")) ? null : reader.GetString(reader.GetOrdinal("c_activationtoken")),
						activatedOn = reader.IsDBNull(reader.GetOrdinal("c_activatedon")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("c_activatedon")),
						profileImageFile = null,
						idProofFile = null,
						certificateFiles = null
					};
				}


			}

		}
		catch (Exception ex)
		{
			Console.WriteLine("Error While Updating Profile Basic : " + ex.Message);
			return null;

		}
		finally
		{
			_conn.Close();
		}

		return null;
	}

	#endregion

	#endregion


}
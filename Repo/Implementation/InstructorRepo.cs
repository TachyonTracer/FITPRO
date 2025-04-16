using System.Data;
using System.Text.Json;
using Npgsql;
namespace Repo;


public class InstructorRepo : IInstructorInterface
{
    private readonly NpgsqlConnection _conn;
    private readonly IEmailInterface _email;

    #region Constructor
    public InstructorRepo(NpgsqlConnection conn, IEmailInterface email)
    {
        _conn = conn;
        _email = email;
    }
    #endregion

    #region Admin Dashboard
    #region Get One Instructor
    public async Task<Instructor> GetOneInstructor(string instructorId)
    {
        Instructor instructor = null;

        try
        {
            if (_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }

            using (var cmd = new NpgsqlCommand(@"SELECT 
                                            c_instructorid,
                                            c_instructorname,
                                            c_email,
                                            c_password, 
                                            c_mobile,
                                            c_gender,
                                            c_dob,
                                            c_specialization,
                                            c_certificates,
                                            c_profileimage,
                                            c_association,
                                            c_status,
                                            c_idproof
                                            FROM t_instructor
                                            WHERE c_instructorid = @c_instructorid", _conn))
            {
                cmd.Parameters.AddWithValue("@c_instructorid", Convert.ToInt32(instructorId));

                using (var dr = await cmd.ExecuteReaderAsync())
                {
                    if (dr.Read())
                    {
                        instructor = new Instructor()
                        {
                            instructorId = Convert.ToInt32(dr["c_instructorid"]),
                            instructorName = Convert.ToString(dr["c_instructorname"]),
                            email = Convert.ToString(dr["c_email"]),
                            password = Convert.ToString(dr["c_password"]),
                            mobile = Convert.ToString(dr["c_mobile"]),
                            gender = Convert.ToString(dr["c_gender"]),
                            dob = Convert.ToDateTime(dr["c_dob"]).Date,
                            specialization = Convert.ToString(dr["c_specialization"]),
                            certificates = JsonDocument.Parse(Convert.ToString(dr["c_certificates"])),
                            profileImage = Convert.ToString(dr["c_profileimage"]),
                            association = Convert.ToString(dr["c_association"]),
                            status = Convert.ToString(dr["c_status"]),
                            idProof = Convert.ToString(dr["c_idproof"])
                        };
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("------>Error while Fetching One Instructor" + ex.Message);
        }
        finally
        {
            if (_conn.State != ConnectionState.Closed)
            {
                await _conn.CloseAsync();
            }
        }
        return instructor;
    }
    #endregion

    #region Get Verified Instructors
    public async Task<List<Instructor>> GetVerifiedInstructors()
    {
        var instructorList = new List<Instructor>();

        try
        {
            if (_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }

            using (var cmd = new NpgsqlCommand(@"SELECT 
                                            c_instructorid,
                                            c_instructorname,
                                            c_email,
                                            c_password, 
                                            c_mobile,
                                            c_gender,
                                            c_dob,
                                            c_specialization,
                                            c_certificates,
                                            c_profileimage,
                                            c_association,
                                            c_status,
                                            c_idproof
                                            FROM t_instructor
                                            WHERE c_status = 'Verified'", _conn))
            {
                using (var dr = await cmd.ExecuteReaderAsync())
                {
                    while (dr.Read())
                    {
                        instructorList.Add(new Instructor()
                        {
                            instructorId = Convert.ToInt32(dr["c_instructorid"]),
                            instructorName = Convert.ToString(dr["c_instructorname"]),
                            email = Convert.ToString(dr["c_email"]),
                            password = Convert.ToString(dr["c_password"]),
                            mobile = Convert.ToString(dr["c_mobile"]),
                            gender = Convert.ToString(dr["c_gender"]),
                            dob = Convert.ToDateTime(dr["c_dob"]).Date,
                            specialization = Convert.ToString(dr["c_specialization"]),
                            certificates = JsonDocument.Parse(Convert.ToString(dr["c_certificates"])),
                            profileImage = Convert.ToString(dr["c_profileimage"]),
                            association = Convert.ToString(dr["c_association"]),
                            status = Convert.ToString(dr["c_status"]),
                            idProof = Convert.ToString(dr["c_idproof"])
                        });
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("------>Error while Fetching Verified Instructors" + ex.Message);
        }
        finally
        {
            if (_conn.State != ConnectionState.Closed)
            {
                await _conn.CloseAsync();
            }
        }
        return instructorList;
    }
    #endregion

    #region Get Approved Instructors
    public async Task<List<Instructor>> GetApprovedInstructors()
    {
        var instructorList = new List<Instructor>();

        try
        {
            if (_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }

            using (var cmd = new NpgsqlCommand(@"SELECT 
                                            c_instructorid,
                                            c_instructorname,
                                            c_email,
                                            c_password, 
                                            c_mobile,
                                            c_gender,
                                            c_dob,
                                            c_specialization,
                                            c_certificates,
                                            c_profileimage,
                                            c_association,
                                            c_status,
                                            c_idproof
                                            FROM t_instructor
                                            WHERE c_status = 'Approved' OR c_status = 'Suspended' ", _conn))
            {
                using (var dr = await cmd.ExecuteReaderAsync())
                {
                    while (dr.Read())
                    {
                        instructorList.Add(new Instructor()
                        {
                            instructorId = Convert.ToInt32(dr["c_instructorid"]),
                            instructorName = Convert.ToString(dr["c_instructorname"]),
                            email = Convert.ToString(dr["c_email"]),
                            password = Convert.ToString(dr["c_password"]),
                            mobile = Convert.ToString(dr["c_mobile"]),
                            gender = Convert.ToString(dr["c_gender"]),
                            dob = Convert.ToDateTime(dr["c_dob"]).Date,
                            specialization = Convert.ToString(dr["c_specialization"]),
                            certificates = JsonDocument.Parse(Convert.ToString(dr["c_certificates"])),
                            profileImage = Convert.ToString(dr["c_profileimage"]),
                            association = Convert.ToString(dr["c_association"]),
                            status = Convert.ToString(dr["c_status"]),
                            idProof = Convert.ToString(dr["c_idproof"])
                        });
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("------>Error while Fetching Approved Instructors" + ex.Message);
        }
        finally
        {
            if (_conn.State != ConnectionState.Closed)
            {
                await _conn.CloseAsync();
            }
        }
        return instructorList;
    }
    #endregion

    #region Approve Instructor
    public async Task<bool> ApproveInstructor(string instructorId)
    {
        bool isSuccess = false;
        try
        {
            if (_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }

            using (var cmd = new NpgsqlCommand("UPDATE t_instructor SET c_status = 'Approved' WHERE c_instructorid = @InstructorId", _conn))
            {
                cmd.Parameters.AddWithValue("@InstructorId", Convert.ToInt32(instructorId));

                // Execute the command and check affected rows
                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                isSuccess = rowsAffected > 0;

                using (var readcmd = new NpgsqlCommand(@"SELECT 
                                            c_instructorid,
                                            c_instructorname,
                                            c_email
                                            FROM t_instructor
                                            WHERE c_instructorid = @c_instructorid", _conn))
                {
                    readcmd.Parameters.AddWithValue("@c_instructorid", Convert.ToInt32(instructorId));

                    var reader = await readcmd.ExecuteReaderAsync();
                    if (reader.Read())
                    {
                        var instructorName = Convert.ToString(reader["c_instructorname"]);
                        var email = Convert.ToString(reader["c_email"]);

                        await _email.SendApproveInstructorEmail(email, instructorName);
                    }
                }

            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error while approving instructor: {ex.Message}");
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

    #region Suspend Intructor
    public async Task<bool> SuspendInstructor(string instructorId)
    {
        bool isSuccess = false;
        try
        {
            if (_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }

            using (var cmd = new NpgsqlCommand("UPDATE t_instructor SET c_status = 'Approved' WHERE c_instructorid = @InstructorId", _conn))
            {
                cmd.Parameters.AddWithValue("@InstructorId", Convert.ToInt32(instructorId));

                // Execute the command and check affected rows
                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                isSuccess = rowsAffected > 0;

                using (var readcmd = new NpgsqlCommand(@"SELECT 
                                            c_instructorid,
                                            c_instructorname,
                                            c_email
                                            FROM t_instructor
                                            WHERE c_instructorid = @c_instructorid", _conn))
                {
                    readcmd.Parameters.AddWithValue("@c_instructorid", Convert.ToInt32(instructorId));

                    var reader = await readcmd.ExecuteReaderAsync();
                    if (reader.Read())
                    {
                        var instructorName = Convert.ToString(reader["c_instructorname"]);
                        var email = Convert.ToString(reader["c_email"]);

                        await _email.SendApproveInstructorEmail(email, instructorName);
                    }
                }

            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error while approving instructor: {ex.Message}");
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

    #region Disapprove Instructor
    public async Task<bool> DisapproveInstructor(string instructorId, string reason)
    {
        bool isSuccess = false;
        try
        {
            if (_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }

            using (var cmd = new NpgsqlCommand("UPDATE t_instructor SET c_status = 'Disapproved',c_reason = @c_reason WHERE c_instructorid = @InstructorId", _conn))
            {
                cmd.Parameters.AddWithValue("@InstructorId", Convert.ToInt32(instructorId));
                cmd.Parameters.AddWithValue("@c_reason", reason);

                // Execute the command and check affected rows
                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                isSuccess = rowsAffected > 0;
                using (var readcmd = new NpgsqlCommand(@"SELECT 
                                            c_instructorid,
                                            c_instructorname,
                                            c_email,
                                            c_reason
                                            FROM t_instructor
                                            WHERE c_instructorid = @c_instructorid", _conn))
                {
                    readcmd.Parameters.AddWithValue("@c_instructorid", Convert.ToInt32(instructorId));

                    var reader = await readcmd.ExecuteReaderAsync();
                    if (reader.Read())
                    {
                        var instructorName = Convert.ToString(reader["c_instructorname"]);
                        var email = Convert.ToString(reader["c_email"]);
                        var reasons = Convert.ToString(reader["c_reason"]);

                        await _email.SendDisapproveInstructorEmail(email, instructorName, reasons);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error while disapproving instructor: {ex.Message}");
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

    #region Suspend Intructor
    public async Task<bool> SuspendInstructor(string instructorId, string reason)
    {
        bool isSuccess = false;
        try
        {
            if (_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }

            using (var cmd = new NpgsqlCommand("UPDATE t_instructor SET c_status = 'Suspended',c_reason = @c_reason WHERE c_instructorid = @InstructorId", _conn))
            {
                cmd.Parameters.AddWithValue("@InstructorId", Convert.ToInt32(instructorId));
                cmd.Parameters.AddWithValue("@c_reason", reason);


                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                isSuccess = rowsAffected > 0;
                using (var readcmd = new NpgsqlCommand(@"SELECT 
                                            c_instructorid,
                                            c_instructorname,
                                            c_email,
                                            c_reason
                                            FROM t_instructor
                                            WHERE c_instructorid = @c_instructorid", _conn))
                {
                    readcmd.Parameters.AddWithValue("@c_instructorid", Convert.ToInt32(instructorId));

                    var reader = await readcmd.ExecuteReaderAsync();
                    if (reader.Read())
                    {
                        var instructorName = Convert.ToString(reader["c_instructorname"]);
                        var email = Convert.ToString(reader["c_email"]);
                        var reasons = Convert.ToString(reader["c_reason"]);

                        await _email.SendSuspendInstructorEmail(email, instructorName, reasons);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error while Suspending instructor: {ex.Message}");
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

    #region Activate Instructor
    public async Task<bool> ActivateInstructor(string Intsructorid)
    {
        bool isSuccess = false;
        try
        {
            if (_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }

            using (var cmd = new NpgsqlCommand("UPDATE t_instructor SET c_status = 'Approved' WHERE c_instructorid = @InstructorId", _conn))
            {
                cmd.Parameters.AddWithValue("@InstructorId", Convert.ToInt32(Intsructorid));

                // Execute the command and check affected rows
                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                isSuccess = rowsAffected > 0;

                using (var readcmd = new NpgsqlCommand(@"SELECT 
                                            c_instructorid,
                                            c_instructorname,
                                            c_email
                                            FROM t_instructor
                                            WHERE c_instructorid = @c_instructorid", _conn))
                {
                    readcmd.Parameters.AddWithValue("@c_instructorid", Convert.ToInt32(Intsructorid));

                    var reader = await readcmd.ExecuteReaderAsync();
                    if (reader.Read())
                    {
                        var instructorName = Convert.ToString(reader["c_instructorname"]);
                        var email = Convert.ToString(reader["c_email"]);

                        await _email.SendActivateInstructorEmail(email, instructorName);
                    }
                }

            }
        }
        catch (Exception ex)
        {
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

    #region Class Count By Instructor
    public async Task<int> ClassCountByInstructor(string instructorId)
    {
        try
        {
            if (_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }

            using (var cmd = new NpgsqlCommand(@"SELECT COUNT(*)
                                                    FROM t_class
                                                    WHERE c_instructorid = @c_instructorid;", _conn))
            {
                cmd.Parameters.AddWithValue("@c_instructorid", Convert.ToInt32(instructorId));

                var count = await cmd.ExecuteScalarAsync();
                return Convert.ToInt32(count);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("------>Error while Fetching Class Count by Instructor: " + ex.Message);
            return -1;
        }
        finally
        {
            if (_conn.State != ConnectionState.Closed)
            {
                await _conn.CloseAsync();
            }
        }
    }
    #endregion

    #region Upcoming Class Count By Instructor
    public async Task<int> UpcomingClassCountByInstructor(string instructorId)
    {
        try
        {
            if (_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }

            using (var cmd = new NpgsqlCommand(@"SELECT COUNT(*)
                                                    FROM t_class
                                                    WHERE c_instructorid = @c_instructorid
                                                    AND c_startdate > @date", _conn))
            {
                cmd.Parameters.AddWithValue("@c_instructorid", Convert.ToInt32(instructorId));
                cmd.Parameters.AddWithValue("@date", DateTime.Now);

                var count = await cmd.ExecuteScalarAsync();
                return Convert.ToInt32(count);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("------>Error while Fetching Upcoming Class Count by Instructor: " + ex.Message);
            return -1;
        }
        finally
        {
            if (_conn.State != ConnectionState.Closed)
            {
                await _conn.CloseAsync();
            }
        }
    }
    #endregion

    #region User Count By Instructor
    public async Task<int> UserCountByInstructor(string instructorId)
    {
        try
        {
            if (_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }

            using (var cmd = new NpgsqlCommand(@"SELECT SUM(c_maxcapacity - c_availablecapacity)
                                                    FROM t_class
                                                    WHERE c_instructorid = @c_instructorid", _conn))
            {
                cmd.Parameters.AddWithValue("@c_instructorid", Convert.ToInt32(instructorId));

                var count = await cmd.ExecuteScalarAsync();
                return count != DBNull.Value ? Convert.ToInt32(count) : 0;
                // return Convert.ToInt32(count);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("------>Error while Fetching user Count by Instructor: " + ex.Message);
            return -1;
        }
        finally
        {
            if (_conn.State != ConnectionState.Closed)
            {
                await _conn.CloseAsync();
            }
        }
    }
    #endregion

    #region Upcoming Class Details By Instructor
    public async Task<List<Class>> UpcomingClassDetailsByInstructor(string instructorId)
    {
        var upcomingClassList = new List<Class>();

        try
        {
            if (_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }

            using (var cmd = new NpgsqlCommand(@"SELECT 
                                                        c_classid, 
                                                        c_classname, 
                                                        c_instructorid,
                                                        c_description,
                                                        c_type,
                                                        c_startdate, 
                                                        c_enddate,
                                                        c_starttime, 
                                                        c_endtime,
                                                        c_duration,
                                                        c_maxcapacity, 
                                                        c_availablecapacity,
                                                        c_requiredequipments,
                                                        c_createdat,
                                                        c_status,
                                                        c_city,
                                                        c_address,
                                                        c_assets,
                                                        c_fees
                                                    FROM t_class
                                                    WHERE c_instructorid = @c_instructorid
                                                    AND c_startdate > @date", _conn))
            {
                cmd.Parameters.AddWithValue("@c_instructorid", Convert.ToInt32(instructorId));
                cmd.Parameters.AddWithValue("@date", DateTime.Now);

                using (var dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        upcomingClassList.Add(new Class()
                        {
                            classId = Convert.ToInt32(dr["c_classid"]),
                            className = Convert.ToString(dr["c_classname"]),
                            instructorId = Convert.ToInt32(dr["c_instructorid"]),
                            description = dr["c_description"] == DBNull.Value ? null : JsonDocument.Parse(Convert.ToString(dr["c_description"])),
                            type = Convert.ToString(dr["c_type"]),
                            startDate = Convert.ToDateTime(dr["c_startdate"]),
                            endDate = Convert.ToDateTime(dr["c_enddate"]),
                            startTime = dr["c_starttime"] == DBNull.Value ? null : TimeSpan.Parse(Convert.ToString(dr["c_starttime"])),
                            endTime = dr["c_endtime"] == DBNull.Value ? null : TimeSpan.Parse(Convert.ToString(dr["c_endtime"])),
                            duration = Convert.ToInt32(dr["c_duration"]),
                            maxCapacity = Convert.ToInt32(dr["c_maxcapacity"]),
                            availableCapacity = Convert.ToInt32(dr["c_availablecapacity"]),
                            requiredEquipments = Convert.ToString(dr["c_requiredequipments"]),
                            createdAt = Convert.ToDateTime(dr["c_createdat"]),
                            status = Convert.ToString(dr["c_status"]),
                            city = Convert.ToString(dr["c_city"]),
                            address = Convert.ToString(dr["c_address"]),
                            assets = dr["c_assets"] == DBNull.Value ? null : JsonDocument.Parse(Convert.ToString(dr["c_assets"])),
                            fee = Convert.ToDecimal(dr["c_fees"])
                        });
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("------>Error while Fetching Upcoming Class Details by Instructor: " + ex.Message);
        }
        finally
        {
            if (_conn.State != ConnectionState.Closed)
            {
                await _conn.CloseAsync();
            }
        }
        return upcomingClassList;
    }
    #endregion

    #region Edit Profile Basic
    public async Task<int> EditProfileBasic(Instructor instructor)
    {
        string query = @"
            UPDATE t_instructor SET 
                c_instructorname = @c_instructorname,
                c_mobile = @c_mobile,
                c_gender = @c_gender,
                c_dob = @c_dob,
                c_profileimage = COALESCE(@c_profileimage, c_profileimage)
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
                cmd.Parameters.AddWithValue("@c_dob", NpgsqlTypes.NpgsqlDbType.Date, instructor.dob);
                cmd.Parameters.AddWithValue("@c_profileimage", (object?)instructor.profileImage ?? DBNull.Value); // Keep existing if null

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

    #region Get All Instructors
    public async Task<List<Instructor>> GetAllInstructors()
    {
        var instructorList = new List<Instructor>();

        try
        {
            if (_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }

            using (var cmd = new NpgsqlCommand(@"SELECT 
                                            c_instructorid,
                                            c_instructorname,
                                            c_email,
                                            c_password, 
                                            c_mobile,
                                            c_gender,
                                            c_dob,
                                            c_specialization,
                                            c_certificates,
                                            c_profileimage,
                                            c_association,
                                            c_status,
                                            c_idproof
                                            FROM t_instructor", _conn))
            {
                using (var dr = await cmd.ExecuteReaderAsync())
                {
                    while (dr.Read())
                    {
                        instructorList.Add(new Instructor()
                        {
                            instructorId = Convert.ToInt32(dr["c_instructorid"]),
                            instructorName = Convert.ToString(dr["c_instructorname"]),
                            email = Convert.ToString(dr["c_email"]),
                            password = Convert.ToString(dr["c_password"]),
                            mobile = Convert.ToString(dr["c_mobile"]),
                            gender = Convert.ToString(dr["c_gender"]),
                            dob = Convert.ToDateTime(dr["c_dob"]).Date,
                            specialization = Convert.ToString(dr["c_specialization"]),
                            certificates = JsonDocument.Parse(Convert.ToString(dr["c_certificates"])),
                            profileImage = Convert.ToString(dr["c_profileimage"]),
                            association = Convert.ToString(dr["c_association"]),
                            status = Convert.ToString(dr["c_status"]),
                            idProof = Convert.ToString(dr["c_idproof"])
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
        return instructorList;
    }
    #endregion

    #region GetTypewiseClassCount
    public async Task<List<KeyValuePair<string, int>>> GetTypewiseClassCount(string instructorId)
    {
        var query = @"
                    SELECT c_type, COUNT(*) AS class_count
                    FROM t_class 
                    WHERE c_instructorid = @instructorId
                    GROUP BY c_type;";

        if (_conn.State != ConnectionState.Open)
        {
            await _conn.OpenAsync();
        }

        try
        {
            using (var cmd = new NpgsqlCommand(query, _conn))
            {
                cmd.Parameters.AddWithValue("@instructorId", Convert.ToInt32(instructorId));

                var reader = await cmd.ExecuteReaderAsync();
                var result = new List<KeyValuePair<string, int>>();

                while (await reader.ReadAsync())
                {
                    var classType = Convert.ToString(reader["c_type"]);
                    var classCount = Convert.ToInt32(reader["class_count"]);

                    result.Add(new KeyValuePair<string, int>(classType, classCount));
                }

                return result;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception: {ex.Message}");
            return new List<KeyValuePair<string, int>>(); // Return empty list on error
        }
        finally
        {
            if (_conn.State != ConnectionState.Closed)
            {
                await _conn.CloseAsync();
            }
        }
    }
    #endregion

    #endregion


    #region Blog

        #region SaveBlogDraft
        public async Task<int> SaveBlogDraft(BlogPost blogpost)
        {
            if (_conn.State == System.Data.ConnectionState.Closed)
            {
                await _conn.OpenAsync();
            }


            string query = @"INSERT INTO t_blogpost 
                                    (c_blog_author_id, c_tags, c_title, c_desc, 
                                    c_content, c_thumbnail, c_created_at, c_published_at,
                                    c_is_published, c_source_url) 
                                VALUES 
                                    (@c_blog_author_id, @c_tags, @c_title, @c_desc,
                                    @c_content, @c_thumbnail, @c_created_at, @c_published_at,
                                    @c_is_published, @c_source_url)
                                RETURNING c_blog_id;";

            try
            {

                using (var command = new NpgsqlCommand(query, _conn))
                {
                    command.Parameters.AddWithValue("@c_blog_author_id", blogpost.c_blog_author_id);
                    command.Parameters.AddWithValue("@c_tags", blogpost.c_tags ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@c_title", blogpost.c_title);
                    command.Parameters.AddWithValue("@c_desc", blogpost.c_desc ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@c_content", blogpost.c_content ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@c_thumbnail", blogpost.c_thumbnail ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@c_created_at", DateTimeOffset.UtcNow.ToUnixTimeSeconds());
                    command.Parameters.AddWithValue("@c_published_at", 1);
                    command.Parameters.AddWithValue("@c_is_published", false);
                    command.Parameters.AddWithValue("@c_source_url", blogpost.c_source_url ?? (object)DBNull.Value);

                    object result = await command.ExecuteScalarAsync();
                    return result != null ? Convert.ToInt32(result) : 0;
                }
            }
            catch (Exception ex)
            {
                System.Console.WriteLine("Error at save draft-->" + ex.Message);
                return 0;
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


        #region UpdateBlogDraft
        public async Task<bool> UpdateBlogDraft(BlogPost blogpost)
        {
            string query = @"UPDATE t_blogpost SET
                                    c_tags = @c_tags,
                                    c_title = @c_title,
                                    c_desc = @c_desc,
                                    c_content = @c_content,
                                    c_thumbnail = @c_thumbnail
                                        WHERE c_blog_id = @c_blog_id";

            try
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();

                await _conn.OpenAsync();

                using (var command = new NpgsqlCommand(query, _conn))
                {
                    command.Parameters.AddWithValue("@c_blog_id", blogpost.c_blog_id);
                    command.Parameters.AddWithValue("@c_tags", blogpost.c_tags ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@c_title", blogpost.c_title);
                    command.Parameters.AddWithValue("@c_desc", blogpost.c_desc ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@c_content", blogpost.c_content ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@c_thumbnail", blogpost.c_thumbnail ?? (object)DBNull.Value);

                    int rowsAffected = await command.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
            }
            catch (Exception ex)
            {
                System.Console.WriteLine("Error at update draft-->" + ex.Message);
                return false;
            }
            finally
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }
        #endregion

        #region PublishBlog
        public async Task<bool> PublishBlog(BlogPost blogpost)
        {
            string query = @"UPDATE t_blogpost SET
                                            c_tags = @c_tags,
                                            c_title = @c_title,
                                            c_desc = @c_desc,
                                            c_content = @c_content,
                                            c_thumbnail = @c_thumbnail,
                                            c_published_at = @c_published_at,
                                            c_is_published = @c_is_published
                                        WHERE c_blog_id = @c_blog_id";

            try
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();

                await _conn.OpenAsync();

                using (var command = new NpgsqlCommand(query, _conn))
                {
                    command.Parameters.AddWithValue("@c_blog_id", blogpost.c_blog_id);
                    command.Parameters.AddWithValue("@c_tags", blogpost.c_tags ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@c_title", blogpost.c_title);
                    command.Parameters.AddWithValue("@c_desc", blogpost.c_desc ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@c_content", blogpost.c_content ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@c_thumbnail", blogpost.c_thumbnail ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@c_published_at", DateTimeOffset.UtcNow.ToUnixTimeSeconds());
                    command.Parameters.AddWithValue("@c_is_published", true);

                    int rowsAffected = await command.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
            }
            catch (Exception ex)
            {
                System.Console.WriteLine("Error at publish blog-->" + ex.Message);
                return false;
            }
            finally
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }
        #endregion

        #region GetBlogsByInstructorId
        public async Task<List<BlogPost>> GetBlogsByInstructorId(int instructor_id)
        {

            var blogList = new List<BlogPost>();

            try
            {

                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();

                string query = @"SELECT * FROM t_blogpost
                                    WHERE c_blog_author_id = @c_blog_author_id";

                using (var cmd = new NpgsqlCommand(query, _conn))
                {
                    cmd.Parameters.AddWithValue("@c_blog_author_id", Convert.ToInt32(instructor_id));
                    await _conn.OpenAsync();
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            BlogPost blog = new BlogPost
                            {
                                c_blog_id = reader.GetInt32(reader.GetOrdinal("c_blog_id")),
                                c_blog_author_id = reader.GetInt32(reader.GetOrdinal("c_blog_author_id")),
                                c_tags = reader.GetString(reader.GetOrdinal("c_tags")),
                                c_title = reader.GetString(reader.GetOrdinal("c_title")),
                                c_desc = reader.GetString(reader.GetOrdinal("c_desc")),
                                c_content = reader.GetString(reader.GetOrdinal("c_content")),
                                c_thumbnail = reader.GetString(reader.GetOrdinal("c_thumbnail")),
                                c_source_url = reader.GetString(reader.GetOrdinal("c_source_url")),
                                c_views = reader.GetInt32(reader.GetOrdinal("c_views")),
                                c_likes = reader.GetInt32(reader.GetOrdinal("c_likes")),
                                c_comments = reader.GetInt32(reader.GetOrdinal("c_comments")),
                                c_created_at = reader.GetInt32(reader.GetOrdinal("c_created_at")),
                                c_published_at = reader.GetInt32(reader.GetOrdinal("c_published_at")),
                                c_is_published = reader.GetBoolean(reader.GetOrdinal("c_is_published")),
                            };
                            blogList.Add(blog);
                        }
                    }
                }
                await _conn.CloseAsync();
                return blogList;
            }

            catch (Exception ex)
            {
                System.Console.WriteLine("Exception at GetBlogsByInstructor-->" + ex.Message);
                return blogList;
            }

            finally
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }
        #endregion

        #region GetBlogById
        public async Task<BlogPost> GetBlogById(int blog_id)
        {

            var blog = new BlogPost();

            try
            {

                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();

                string query = @"SELECT * FROM t_blogpost
                                    WHERE c_blog_id = @c_blog_id";

                using (var cmd = new NpgsqlCommand(query, _conn))
                {
                    cmd.Parameters.AddWithValue("@c_blog_id", Convert.ToInt32(blog_id));
                    await _conn.OpenAsync();
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            BlogPost blog_ = new BlogPost
                            {
                                c_blog_id = reader.GetInt32(reader.GetOrdinal("c_blog_id")),
                                c_blog_author_id = reader.GetInt32(reader.GetOrdinal("c_blog_author_id")),
                                c_tags = reader.GetString(reader.GetOrdinal("c_tags")),
                                c_title = reader.GetString(reader.GetOrdinal("c_title")),
                                c_desc = reader.GetString(reader.GetOrdinal("c_desc")),
                                c_content = reader.GetString(reader.GetOrdinal("c_content")),
                                c_thumbnail = reader.GetString(reader.GetOrdinal("c_thumbnail")),
                                c_source_url = reader.GetString(reader.GetOrdinal("c_source_url")),
                                c_views = reader.GetInt32(reader.GetOrdinal("c_views")),
                                c_likes = reader.GetInt32(reader.GetOrdinal("c_likes")),
                                c_comments = reader.GetInt32(reader.GetOrdinal("c_comments")),
                                c_created_at = reader.GetInt32(reader.GetOrdinal("c_created_at")),
                                c_published_at = reader.GetInt32(reader.GetOrdinal("c_published_at")),
                                c_is_published = reader.GetBoolean(reader.GetOrdinal("c_is_published")),
                            };
                            blog = blog_;
                        }
                    }
                }
                await _conn.CloseAsync();
                return blog;
            }

            catch (Exception ex)
            {
                System.Console.WriteLine("Exception at GetBlogsByInstructor-->" + ex.Message);
                return blog;
            }

            finally
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }
        #endregion

        #region Delete Blog 
        public async Task<int> DeleteBlog(int blog_id)
        {
            try
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();

                string query = @"DELETE FROM t_blogpost WHERE c_blog_id = @c_blog_id";

                using (var cmd = new NpgsqlCommand(query, _conn))
                {
                    cmd.Parameters.AddWithValue("@c_blog_id", blog_id);
                    await _conn.OpenAsync();
                    int rowsAffected = await cmd.ExecuteNonQueryAsync();
                    return rowsAffected; // Should be 1 if the deletion was successful
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception in DeleteBlog --> " + ex.Message);
                return 0;
            }
            finally
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }
        #endregion

        #region AddNewComment
            public async Task<BlogComment> AddNewComment(BlogComment comment)
            {
                var cmt = new BlogComment();
                if (_conn.State == System.Data.ConnectionState.Closed)
                {
                    await _conn.OpenAsync();
                }

                try
                {
                    // Fetch Author Details
                    string userQuery = comment.userRole?.ToLower() == "instructor"
                        ? "SELECT c_instructorname AS name, c_profileimage AS profile FROM t_instructor WHERE c_instructorid = @id"
                        : "SELECT c_username AS name, c_profileimage AS profile FROM t_user WHERE c_userid = @id";

                    using (var userCmd = new NpgsqlCommand(userQuery, _conn))
                    {
                        userCmd.Parameters.AddWithValue("@id", comment.userId ?? 0);
                        using (var reader = await userCmd.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                comment.authorName = reader["name"]?.ToString();
                                comment.authorProfilePicture = reader["profile"]?.ToString();
                            }
                            else
                            {
                                Console.WriteLine("User not found.");
                                return cmt;
                            }
                        }
                    }

                    // Insert Comment
                    string insertQuery = @"
                        INSERT INTO t_blog_comment (
                            c_blog_id, c_user_id, c_commented_at, 
                            c_comment_content, c_parent_comment_id, c_user_role
                        ) 
                        VALUES (
                            @c_blog_id, @c_user_id, @c_commented_at, 
                            @c_comment_content, @c_parent_comment_id, @c_user_role
                        )
                        RETURNING c_comment_id;";

                    using (var insertCmd = new NpgsqlCommand(insertQuery, _conn))
                    {
                        insertCmd.Parameters.AddWithValue("@c_blog_id", comment.blogId ?? (object)DBNull.Value);
                        insertCmd.Parameters.AddWithValue("@c_user_id", comment.userId ?? (object)DBNull.Value);
                        insertCmd.Parameters.AddWithValue("@c_commented_at", DateTimeOffset.UtcNow.ToUnixTimeSeconds());
                        insertCmd.Parameters.AddWithValue("@c_comment_content", comment.commentContent ?? (object)DBNull.Value);
                        insertCmd.Parameters.AddWithValue("@c_parent_comment_id", comment.parentCommentId ?? (object)DBNull.Value);
                        insertCmd.Parameters.AddWithValue("@c_user_role", comment.userRole ?? (object)DBNull.Value);

                        object result = await insertCmd.ExecuteScalarAsync();
                        // return result != null ? Convert.ToInt32(result) : 0;
                        if (result != null)
                        {
                            int commentId = Convert.ToInt32(result);
                            comment.commentId= commentId;

                            // Increment comment count
                            string updateQuery = "UPDATE t_blogpost SET c_comments = c_comments + 1 WHERE c_blog_id = @blogId";
                            using (var updateCmd = new NpgsqlCommand(updateQuery, _conn))
                            {
                                updateCmd.Parameters.AddWithValue("@blogId", comment.blogId ?? (object)DBNull.Value);
                                await updateCmd.ExecuteNonQueryAsync();
                            }
                            return comment;
                        }
                        else
                        {
                            return cmt;
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error saving comment --> " + ex.Message);
                    return cmt;
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

        #region fetchBlogComments
            public async Task<List<BlogComment>> fetchBlogComments(int blog_id)
            {
                var commentList = new List<BlogComment>();

                if (_conn.State == System.Data.ConnectionState.Closed)
                {
                    await _conn.OpenAsync();
                }

                try
                {
                    var query = @"
                        SELECT 
                            c.c_comment_id,
                            c.c_blog_id,
                            c.c_user_id,
                            c.c_user_role,
                            c.c_comment_content,
                            c.c_parent_comment_id,
                            c.c_commented_at,
                            CASE 
                                WHEN c.c_user_role = 'user' THEN u.c_username
                                WHEN c.c_user_role = 'instructor' THEN i.c_instructorname
                                ELSE ''
                            END AS authorName,
                            CASE 
                                WHEN c.c_user_role = 'user' THEN u.c_profileimage
                                WHEN c.c_user_role = 'instructor' THEN i.c_profileimage
                                ELSE ''
                            END AS authorProfilePicture
                        FROM t_blog_comment c
                        LEFT JOIN t_user u ON c.c_user_role = 'user' AND c.c_user_id = u.c_userid
                        LEFT JOIN t_instructor i ON c.c_user_role = 'instructor' AND c.c_user_id = i.c_instructorid
                        WHERE c.c_blog_id = @blog_id
                        ORDER BY c.c_commented_at DESC";

                    using (var cmd = new NpgsqlCommand(query, _conn))
                    {
                        cmd.Parameters.AddWithValue("@blog_id", blog_id);

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var comment = new BlogComment
                                {
                                    commentId = reader.GetInt32(reader.GetOrdinal("c_comment_id")),
                                    blogId = reader.GetInt32(reader.GetOrdinal("c_blog_id")),
                                    userId = reader.GetInt32(reader.GetOrdinal("c_user_id")),
                                    userRole = reader.GetString(reader.GetOrdinal("c_user_role")),
                                    parentCommentId = reader.GetInt32(reader.GetOrdinal("c_parent_comment_id")),
                                    commentContent = reader.GetString(reader.GetOrdinal("c_comment_content")),
                                    commentedAt = reader.GetInt32(reader.GetOrdinal("c_commented_at")),
                                    authorName = reader.GetString(reader.GetOrdinal("authorName")),
                                    authorProfilePicture = reader.GetString(reader.GetOrdinal("authorProfilePicture"))
                                };

                                commentList.Add(comment);
                            }
                        }
                    }

                    return commentList;
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error saving comment --> " + ex.Message);
                    return commentList;
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

        #region fetchBlogByUri
            public async Task<BlogPost> fetchBlogByUri(string source_uri) {
                
                var blog = new BlogPost();

                try {

                    if (_conn.State == System.Data.ConnectionState.Open)
                        await _conn.CloseAsync();

                    string query = @"SELECT * FROM t_blogpost
                                WHERE c_source_url = @c_source_url";
                    
                    using (var cmd = new NpgsqlCommand(query, _conn))
                    {
                        cmd.Parameters.AddWithValue("@c_source_url", source_uri);
                        await _conn.OpenAsync();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                BlogPost blog_ = new BlogPost
                                {
                                    c_blog_id = reader.GetInt32(reader.GetOrdinal("c_blog_id")),
                                    c_blog_author_id = reader.GetInt32(reader.GetOrdinal("c_blog_author_id")),
                                    c_tags = reader.GetString(reader.GetOrdinal("c_tags")),
                                    c_title = reader.GetString(reader.GetOrdinal("c_title")),
                                    c_desc = reader.GetString(reader.GetOrdinal("c_desc")),
                                    c_content = reader.GetString(reader.GetOrdinal("c_content")),
                                    c_thumbnail = reader.GetString(reader.GetOrdinal("c_thumbnail")),
                                    c_source_url = reader.GetString(reader.GetOrdinal("c_source_url")),
                                    c_views = reader.GetInt32(reader.GetOrdinal("c_views")),
                                    c_likes = reader.GetInt32(reader.GetOrdinal("c_likes")),
                                    c_comments = reader.GetInt32(reader.GetOrdinal("c_comments")),
                                    c_created_at = reader.GetInt32(reader.GetOrdinal("c_created_at")),
                                    c_published_at = reader.GetInt32(reader.GetOrdinal("c_published_at")),
                                    c_is_published = reader.GetBoolean(reader.GetOrdinal("c_is_published")),
                                };
                                blog = blog_;
                            }
                        }
                    }
                    await _conn.CloseAsync();
                    return blog;
                } 

                catch (Exception ex)
                {
                    System.Console.WriteLine("Exception at GetBlogsByInstructor-->" + ex.Message);
                    return blog;
                }

                finally {
                    if (_conn.State == System.Data.ConnectionState.Open)
                        await _conn.CloseAsync();
                }
            }
        #endregion

        #region fetchBlogAuthorById
            public async Task<Instructor> fetchBlogAuthorById(int author_id)
            {
                var author = new Instructor();
                string query = @"
                                SELECT 
                                    c_instructorid, c_instructorname,
                                    c_specialization, c_profileimage
                                FROM t_instructor
                                    WHERE c_instructorid = @author_id";

                if (_conn.State != System.Data.ConnectionState.Open)
                {
                    _conn.Open();
                }

                try
                {

                    using (NpgsqlCommand cmd = new NpgsqlCommand(query, _conn))
                    {

                        cmd.Parameters.AddWithValue("@author_id", author_id);

                        using var reader = await cmd.ExecuteReaderAsync();
                        if (await reader.ReadAsync())
                        {
                            return new Instructor
                            {
                                instructorId = reader.GetInt32(reader.GetOrdinal("c_instructorid")),
                                instructorName = reader.GetString(reader.GetOrdinal("c_instructorname")),
                                specialization = reader.GetString(reader.GetOrdinal("c_specialization")),
                                profileImage = reader.IsDBNull(reader.GetOrdinal("c_profileimage")) ? null : reader.GetString(reader.GetOrdinal("c_profileimage")),
                            };
                        }
                    }

                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error While Updating Profile Basic : " + ex.Message);
                    // return author;
                }
                finally
                {
                    _conn.Close();
                }
                return author;
            }
        #endregion
    #endregion
}
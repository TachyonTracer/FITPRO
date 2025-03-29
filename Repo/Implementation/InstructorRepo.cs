using System.Data;
using System.Text.Json;
using Npgsql;
namespace Repo;


public class InstructorRepo : IInstructorInterface
{
    private readonly NpgsqlConnection _conn;

    #region Constructor
    public InstructorRepo(NpgsqlConnection conn)
    {
        _conn = conn;
    }
    #endregion

    #region User Story: List Instructors

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

    #region Get Verifies Instructors
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
                                        WHERE c_status = 'Approve'", _conn))
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
    #endregion

    #region User Story: Update Instructor (Admin Dasboard)
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

            using (var cmd = new NpgsqlCommand("UPDATE t_instructor SET c_status = 'Approve' WHERE c_instructorid = @InstructorId", _conn))
            {
                cmd.Parameters.AddWithValue("@InstructorId", Convert.ToInt32(instructorId));

                // Execute the command and check affected rows
                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                isSuccess = rowsAffected > 0;
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

    #region Disaaprove Instructor
    public async Task<bool> DisapproveInstructor(string instructorId)
    {
        bool isSuccess = false;
        try
        {
            if (_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }

            using (var cmd = new NpgsqlCommand("UPDATE t_instructor SET c_status = 'Disapprove' WHERE c_instructorid = @InstructorId", _conn))
            {
                cmd.Parameters.AddWithValue("@InstructorId", Convert.ToInt32(instructorId));

                // Execute the command and check affected rows
                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                isSuccess = rowsAffected > 0;
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
     public async Task<bool> SuspendInstructor(string instructorId)
    {
        bool isSuccess = false;
        try
        {
            if (_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }

            using (var cmd = new NpgsqlCommand("UPDATE t_instructor SET c_status = 'Suspended' WHERE c_instructorid = @InstructorId", _conn))
            {
                cmd.Parameters.AddWithValue("@InstructorId", Convert.ToInt32(instructorId));

               
                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                isSuccess = rowsAffected > 0;
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

    #endregion
}
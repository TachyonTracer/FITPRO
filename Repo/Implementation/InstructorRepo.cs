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
            if(_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }

            using(var cmd = new NpgsqlCommand(@"SELECT 
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
                using(var dr =  await cmd.ExecuteReaderAsync())
                {
                    while(dr.Read())
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
            if(_conn.State != ConnectionState.Closed)
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
            if(_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }

            using(var cmd = new NpgsqlCommand(@"SELECT 
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

                using(var dr =  await cmd.ExecuteReaderAsync())
                {
                    if(dr.Read())
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
            if(_conn.State != ConnectionState.Closed)
            {
                await _conn.CloseAsync();
            }
        }
        return instructor;
    }
    #endregion
    #endregion
}
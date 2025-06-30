using System.Data;
using System.Text.Json;
using Npgsql;
namespace Repo;

public class InstructorRepo : IInstructorInterface
{
    private readonly NpgsqlConnection _conn;
    private readonly IEmailInterface _email;

    public InstructorRepo(NpgsqlConnection conn, IEmailInterface email)
    {
        _conn = conn;
        _email = email;
    }

    // DRY: Centralized connection open/close helpers
    private async Task EnsureOpenAsync()
    {
        if (_conn.State != ConnectionState.Open)
            await _conn.OpenAsync();
    }
    private async Task EnsureClosedAsync()
    {
        if (_conn.State != ConnectionState.Closed)
            await _conn.CloseAsync();
    }

    // DRY: Centralized method for executing a reader and mapping results
    private async Task<List<T>> ExecuteReaderAsync<T>(string query, Action<NpgsqlCommand> paramSetter, Func<NpgsqlDataReader, T> map)
    {
        var result = new List<T>();
        await EnsureOpenAsync();
        try
        {
            using var cmd = new NpgsqlCommand(query, _conn);
            paramSetter?.Invoke(cmd);
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
                result.Add(map(reader));
        }
        finally
        {
            await EnsureClosedAsync();
        }
        return result;
    }

    // DRY: Centralized method for executing a scalar query
    private async Task<T> ExecuteScalarAsync<T>(string query, Action<NpgsqlCommand> paramSetter)
    {
        await EnsureOpenAsync();
        try
        {
            using var cmd = new NpgsqlCommand(query, _conn);
            paramSetter?.Invoke(cmd);
            var result = await cmd.ExecuteScalarAsync();
            return (result == null || result is DBNull) ? default : (T)Convert.ChangeType(result, typeof(T));
        }
        finally
        {
            await EnsureClosedAsync();
        }
    }

    #region Admin Dashboard

    public async Task<Instructor> GetOneInstructor(string instructorId)
    {
        string query = @"SELECT 
            c_instructorid, c_instructorname, c_email, c_password, c_mobile, c_gender, c_dob,
            c_specialization, c_certificates, c_profileimage, c_association, c_status, c_idproof
            FROM t_instructor WHERE c_instructorid = @c_instructorid";
        var list = await ExecuteReaderAsync(query, cmd =>
        {
            cmd.Parameters.AddWithValue("@c_instructorid", Convert.ToInt32(instructorId));
        }, dr => new Instructor
        {
            instructorId = dr.GetInt32(dr.GetOrdinal("c_instructorid")),
            instructorName = dr.GetString(dr.GetOrdinal("c_instructorname")),
            email = dr.GetString(dr.GetOrdinal("c_email")),
            password = dr.GetString(dr.GetOrdinal("c_password")),
            mobile = dr.GetString(dr.GetOrdinal("c_mobile")),
            gender = dr.GetString(dr.GetOrdinal("c_gender")),
            dob = dr.GetDateTime(dr.GetOrdinal("c_dob")),
            specialization = dr.GetString(dr.GetOrdinal("c_specialization")),
            certificates = JsonDocument.Parse(dr.GetString(dr.GetOrdinal("c_certificates"))),
            profileImage = dr.GetString(dr.GetOrdinal("c_profileimage")),
            association = dr.GetString(dr.GetOrdinal("c_association")),
            status = dr.GetString(dr.GetOrdinal("c_status")),
            idProof = dr.GetString(dr.GetOrdinal("c_idproof"))
        });
        return list.FirstOrDefault();
    }

    public async Task<List<Instructor>> GetVerifiedInstructors()
    {
        string query = @"SELECT * FROM t_instructor WHERE c_status = 'Verified'";
        return await ExecuteReaderAsync(query, null, MapInstructor);
    }

    public async Task<List<Instructor>> GetApprovedInstructors()
    {
        string query = @"SELECT * FROM t_instructor WHERE c_status = 'Approved' OR c_status = 'Suspended'";
        return await ExecuteReaderAsync(query, null, MapInstructor);
    }

    public async Task<bool> ApproveInstructor(string instructorId)
    {
        string updateQuery = "UPDATE t_instructor SET c_status = 'Approved' WHERE c_instructorid = @InstructorId";
        int rowsAffected = await ExecuteScalarAsync<int>(
            $"WITH updated AS ({updateQuery} RETURNING 1) SELECT COUNT(*) FROM updated;", cmd =>
        {
            cmd.Parameters.AddWithValue("@InstructorId", Convert.ToInt32(instructorId));
        });
        if (rowsAffected > 0)
        {
            var instructor = await GetOneInstructor(instructorId);
            if (instructor != null)
                await _email.SendApproveInstructorEmail(instructor.email, instructor.instructorName);
        }
        return rowsAffected > 0;
    }

    public async Task<bool> DisapproveInstructor(string instructorId, string reason)
    {
        string updateQuery = "UPDATE t_instructor SET c_status = 'Disapproved', c_reason = @c_reason WHERE c_instructorid = @InstructorId";
        int rowsAffected = await ExecuteScalarAsync<int>(
            $"WITH updated AS ({updateQuery} RETURNING 1) SELECT COUNT(*) FROM updated;", cmd =>
        {
            cmd.Parameters.AddWithValue("@InstructorId", Convert.ToInt32(instructorId));
            cmd.Parameters.AddWithValue("@c_reason", reason);
        });
        if (rowsAffected > 0)
        {
            var instructor = await GetOneInstructor(instructorId);
            if (instructor != null)
                await _email.SendDisapproveInstructorEmail(instructor.email, instructor.instructorName, reason);
        }
        return rowsAffected > 0;
    }

    public async Task<bool> SuspendInstructor(string instructorId, string reason)
    {
        string updateQuery = "UPDATE t_instructor SET c_status = 'Suspended', c_reason = @c_reason WHERE c_instructorid = @InstructorId";
        int rowsAffected = await ExecuteScalarAsync<int>(
            $"WITH updated AS ({updateQuery} RETURNING 1) SELECT COUNT(*) FROM updated;", cmd =>
        {
            cmd.Parameters.AddWithValue("@InstructorId", Convert.ToInt32(instructorId));
            cmd.Parameters.AddWithValue("@c_reason", reason);
        });
        if (rowsAffected > 0)
        {
            var instructor = await GetOneInstructor(instructorId);
            if (instructor != null)
                await _email.SendSuspendInstructorEmail(instructor.email, instructor.instructorName, reason);
        }
        return rowsAffected > 0;
    }

    public async Task<bool> ActivateInstructor(string instructorId)
    {
        string updateQuery = "UPDATE t_instructor SET c_status = 'Approved' WHERE c_instructorid = @InstructorId";
        int rowsAffected = await ExecuteScalarAsync<int>(
            $"WITH updated AS ({updateQuery} RETURNING 1) SELECT COUNT(*) FROM updated;", cmd =>
        {
            cmd.Parameters.AddWithValue("@InstructorId", Convert.ToInt32(instructorId));
        });
        if (rowsAffected > 0)
        {
            var instructor = await GetOneInstructor(instructorId);
            if (instructor != null)
                await _email.SendActivateInstructorEmail(instructor.email, instructor.instructorName);
        }
        return rowsAffected > 0;
    }

    public async Task<int> ClassCountByInstructor(string instructorId)
    {
        string query = @"SELECT COUNT(*) FROM t_class WHERE c_instructorid = @c_instructorid;";
        return await ExecuteScalarAsync<int>(query, cmd =>
        {
            cmd.Parameters.AddWithValue("@c_instructorid", Convert.ToInt32(instructorId));
        });
    }

    public async Task<int> UpcomingClassCountByInstructor(string instructorId)
    {
        string query = @"SELECT COUNT(*) FROM t_class WHERE c_instructorid = @c_instructorid AND c_startdate > @date";
        return await ExecuteScalarAsync<int>(query, cmd =>
        {
            cmd.Parameters.AddWithValue("@c_instructorid", Convert.ToInt32(instructorId));
            cmd.Parameters.AddWithValue("@date", DateTime.Now);
        });
    }

    public async Task<int> UserCountByInstructor(string instructorId)
    {
        string query = @"SELECT SUM(c_maxcapacity - c_availablecapacity) FROM t_class WHERE c_instructorid = @c_instructorid";
        var result = await ExecuteScalarAsync<object>(query, cmd =>
        {
            cmd.Parameters.AddWithValue("@c_instructorid", Convert.ToInt32(instructorId));
        });
        return result != null && result != DBNull.Value ? Convert.ToInt32(result) : 0;
    }

    public async Task<List<Class>> UpcomingClassDetailsByInstructor(string instructorId)
    {
        string query = @"SELECT * FROM t_class WHERE c_instructorid = @c_instructorid AND c_startdate > @date";
        return await ExecuteReaderAsync(query, cmd =>
        {
            cmd.Parameters.AddWithValue("@c_instructorid", Convert.ToInt32(instructorId));
            cmd.Parameters.AddWithValue("@date", DateTime.Now);
        }, MapClass);
    }

    public async Task<List<Instructor>> GetAllInstructors()
    {
        string query = @"SELECT * FROM t_instructor";
        return await ExecuteReaderAsync(query, null, MapInstructor);
    }

    public async Task<Instructor?> GetOneInstructorByIdForProfile(int instructorId)
    {
        string query = @"SELECT * FROM t_instructor WHERE c_instructorid = @InstructorId";
        var list = await ExecuteReaderAsync(query, cmd =>
        {
            cmd.Parameters.AddWithValue("@InstructorId", instructorId);
        }, MapInstructor);
        return list.FirstOrDefault();
    }

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
        return await ExecuteScalarAsync<int>(
            $"WITH updated AS ({query} RETURNING 1) SELECT COUNT(*) FROM updated;", cmd =>
        {
            cmd.Parameters.AddWithValue("@c_instructorid", instructor.instructorId);
            cmd.Parameters.AddWithValue("@c_instructorname", instructor.instructorName ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@c_mobile", instructor.mobile ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@c_gender", instructor.gender ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@c_dob", NpgsqlTypes.NpgsqlDbType.Date, instructor.dob);
            cmd.Parameters.AddWithValue("@c_profileimage", (object?)instructor.profileImage ?? DBNull.Value);
        });
    }

    public async Task<List<KeyValuePair<string, int>>> GetTypewiseClassCount(string instructorId)
    {
        string query = @"SELECT c_type, COUNT(*) AS class_count FROM t_class WHERE c_instructorid = @instructorId GROUP BY c_type;";
        var result = await ExecuteReaderAsync(query, cmd =>
        {
            cmd.Parameters.AddWithValue("@instructorId", Convert.ToInt32(instructorId));
        }, reader => new KeyValuePair<string, int>(
            reader.GetString(reader.GetOrdinal("c_type")),
            reader.GetInt32(reader.GetOrdinal("class_count"))
        ));
        return result;
    }

    #endregion

    // DRY: Mapping helpers
    private Instructor MapInstructor(NpgsqlDataReader dr)
    {
        return new Instructor
        {
            instructorId = dr.GetInt32(dr.GetOrdinal("c_instructorid")),
            instructorName = dr.GetString(dr.GetOrdinal("c_instructorname")),
            email = dr.GetString(dr.GetOrdinal("c_email")),
            password = dr.IsDBNull(dr.GetOrdinal("c_password")) ? null : dr.GetString(dr.GetOrdinal("c_password")),
            mobile = dr.IsDBNull(dr.GetOrdinal("c_mobile")) ? null : dr.GetString(dr.GetOrdinal("c_mobile")),
            gender = dr.IsDBNull(dr.GetOrdinal("c_gender")) ? null : dr.GetString(dr.GetOrdinal("c_gender")),
            dob = dr.IsDBNull(dr.GetOrdinal("c_dob")) ? DateTime.MinValue : dr.GetDateTime(dr.GetOrdinal("c_dob")),
            specialization = dr.IsDBNull(dr.GetOrdinal("c_specialization")) ? null : dr.GetString(dr.GetOrdinal("c_specialization")),
            certificates = dr.IsDBNull(dr.GetOrdinal("c_certificates")) ? null : JsonDocument.Parse(dr.GetString(dr.GetOrdinal("c_certificates"))),
            profileImage = dr.IsDBNull(dr.GetOrdinal("c_profileimage")) ? null : dr.GetString(dr.GetOrdinal("c_profileimage")),
            association = dr.IsDBNull(dr.GetOrdinal("c_association")) ? null : dr.GetString(dr.GetOrdinal("c_association")),
            status = dr.IsDBNull(dr.GetOrdinal("c_status")) ? null : dr.GetString(dr.GetOrdinal("c_status")),
            idProof = dr.IsDBNull(dr.GetOrdinal("c_idproof")) ? null : dr.GetString(dr.GetOrdinal("c_idproof"))
        };
    }

    private Class MapClass(NpgsqlDataReader dr)
    {
        return new Class
        {
            classId = dr.GetInt32(dr.GetOrdinal("c_classid")),
            className = dr.GetString(dr.GetOrdinal("c_classname")),
            instructorId = dr.GetInt32(dr.GetOrdinal("c_instructorid")),
            description = dr.IsDBNull(dr.GetOrdinal("c_description")) ? null : JsonDocument.Parse(dr.GetString(dr.GetOrdinal("c_description"))),
            type = dr.GetString(dr.GetOrdinal("c_type")),
            startDate = dr.GetDateTime(dr.GetOrdinal("c_startdate")),
            endDate = dr.GetDateTime(dr.GetOrdinal("c_enddate")),
            startTime = dr.IsDBNull(dr.GetOrdinal("c_starttime")) ? null : TimeSpan.Parse(dr.GetString(dr.GetOrdinal("c_starttime"))),
            endTime = dr.IsDBNull(dr.GetOrdinal("c_endtime")) ? null : TimeSpan.Parse(dr.GetString(dr.GetOrdinal("c_endtime"))),
            duration = dr.IsDBNull(dr.GetOrdinal("c_duration")) ? 0 : dr.GetInt32(dr.GetOrdinal("c_duration")),
            maxCapacity = dr.IsDBNull(dr.GetOrdinal("c_maxcapacity")) ? 0 : dr.GetInt32(dr.GetOrdinal("c_maxcapacity")),
            availableCapacity = dr.IsDBNull(dr.GetOrdinal("c_availablecapacity")) ? 0 : dr.GetInt32(dr.GetOrdinal("c_availablecapacity")),
            requiredEquipments = dr.IsDBNull(dr.GetOrdinal("c_requiredequipments")) ? null : dr.GetString(dr.GetOrdinal("c_requiredequipments")),
            createdAt = dr.GetDateTime(dr.GetOrdinal("c_createdat")),
            status = dr.IsDBNull(dr.GetOrdinal("c_status")) ? null : dr.GetString(dr.GetOrdinal("c_status")),
            city = dr.IsDBNull(dr.GetOrdinal("c_city")) ? null : dr.GetString(dr.GetOrdinal("c_city")),
            address = dr.IsDBNull(dr.GetOrdinal("c_address")) ? null : dr.GetString(dr.GetOrdinal("c_address")),
            assets = dr.IsDBNull(dr.GetOrdinal("c_assets")) ? null : JsonDocument.Parse(dr.GetString(dr.GetOrdinal("c_assets"))),
            fee = dr.IsDBNull(dr.GetOrdinal("c_fees")) ? 0 : dr.GetDecimal(dr.GetOrdinal("c_fees"))
        };
    }
}
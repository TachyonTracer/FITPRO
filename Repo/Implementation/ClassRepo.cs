
using Npgsql;
using System.Text.Json;
using System.Data;
namespace Repo;
public class ClassRepo : IClassInterface
{
    public readonly NpgsqlConnection _conn;
    public ClassRepo(NpgsqlConnection conn)
    {
        _conn = conn;
    }


    #region Book:Class
    public async Task<Response> BookClass(Booking req)
    {
        Response response = new Response();
        try
        {
            if (_conn.State == ConnectionState.Closed)
            {
                await _conn.OpenAsync();
            }

            // Start a transaction
            using (var transaction = await _conn.BeginTransactionAsync())
            {
                try
                {
                    // Check if class exists and has available capacity
                    using (var checkCmd = new NpgsqlCommand(
                        "SELECT c_availablecapacity FROM t_Class WHERE c_classid = @classId FOR UPDATE", _conn, transaction))
                    {
                        checkCmd.Parameters.AddWithValue("@classId", req.classId);
                        var result = await checkCmd.ExecuteScalarAsync();

                        if (result == null)
                        {
                            response.message = "Class not found";
                            return response;
                        }

                        int availableCapacity = Convert.ToInt32(result);
                        if (availableCapacity <= 0)
                        {
                            response.message = "No available seats in this class";
                            return response;
                        }
                    }

                    // Create booking
                    using (var bookingCmd = new NpgsqlCommand(
                        "INSERT INTO t_Bookings (c_bookingid, c_userid, c_classid, c_createdat) " +
                        "VALUES (DEFAULT, @userId, @classId, @createdAt) RETURNING c_bookingid", _conn, transaction))
                    {
                        bookingCmd.Parameters.AddWithValue("@userId", req.userId);
                        bookingCmd.Parameters.AddWithValue("@classId", req.classId);
                        bookingCmd.Parameters.AddWithValue("@createdAt", req.createdAt);
                        await bookingCmd.ExecuteScalarAsync();
                    }

                    // Decrease available capacity
                    using (var updateCmd = new NpgsqlCommand(
                        "UPDATE t_Class SET c_availablecapacity = c_availablecapacity - 1 " +
                        "WHERE c_classid = @classId", _conn, transaction))
                    {
                        updateCmd.Parameters.AddWithValue("@classId", req.classId);
                        await updateCmd.ExecuteNonQueryAsync();
                    }

                    // Commit transaction
                    await transaction.CommitAsync();
                    response.message = "Class booked successfully";
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    response.message = $"Booking failed: {ex.Message}";
                    return response;
                }
            }
        }
        catch (Exception ex)
        {
            response.message = $"Error connecting to database: {ex.Message}";
        }
        finally
        {
            if (_conn.State == ConnectionState.Open)
            {
                await _conn.CloseAsync();
            }
        }
        return response;
    }
    #endregion

    #region  User-Story :List Classes
    #region GetAllClasess
    public async Task<List<Class>> GetAllClasses()
    {
        List<Class> classes = new List<Class>();
        try
        {
            using (var cmd = new NpgsqlCommand("SELECT * FROM t_Class", _conn))
            {
                if (_conn.State == System.Data.ConnectionState.Closed)
                {
                    await _conn.OpenAsync();
                }

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var classObj = new Class()
                        {
                            classId = Convert.ToInt32(reader["c_classid"]),
                            className = reader["c_classname"].ToString(),
                            instructorId = Convert.ToInt32(reader["c_instructorid"]),
                            description = reader["c_description"] == DBNull.Value ? null : JsonDocument.Parse(reader["c_description"].ToString()),

                            type = reader["c_type"].ToString(),
                            startDate = Convert.ToDateTime(reader["c_startdate"]),
                            endDate = Convert.ToDateTime(reader["c_enddate"]),
                            startTime = reader["c_starttime"] == DBNull.Value ? null : TimeSpan.Parse(reader["c_starttime"].ToString()),
                            endTime = reader["c_endtime"] == DBNull.Value ? null : TimeSpan.Parse(reader["c_endtime"].ToString()),

                            duration = reader["c_duration"] == DBNull.Value ? 0 : Convert.ToInt32(reader["c_duration"]),
                            maxCapacity = reader["c_maxcapacity"] == DBNull.Value ? 0 : Convert.ToInt32(reader["c_maxcapacity"]),
                            availableCapacity = reader["c_availablecapacity"] == DBNull.Value ? 0 : Convert.ToInt32(reader["c_availablecapacity"]),
                            requiredEquipments = reader["c_requiredequipments"].ToString(),
                            createdAt = Convert.ToDateTime(reader["c_createdat"]),
                            status = reader["c_status"].ToString(),
                            city = reader["c_city"].ToString(),
                            address = reader["c_address"].ToString(),
                            assets = reader["c_assets"] == DBNull.Value ? null : JsonDocument.Parse(reader["c_assets"].ToString()),

                            fee = reader["c_fees"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["c_fees"])
                        };

                        classes.Add(classObj);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
        return classes;
    }
    #endregion

    #region GetClassById
    public async Task<List<Class>> GetClassById(string id)
    {
        List<Class> task = new List<Class>();
        try
        {
            if (_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }
            using (var cmd = new NpgsqlCommand("SELECT * FROM t_Class WHERE c_instructorid = @c_instructorid", _conn))
            {
                cmd.Parameters.AddWithValue("@c_instructorid", int.Parse(id));
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        task.Add(new Class()
                        {
                            classId = Convert.ToInt32(reader["c_classid"]),
                            className = reader["c_classname"].ToString(),
                            instructorId = Convert.ToInt32(reader["c_instructorid"]),
                            description = reader["c_description"] == DBNull.Value ? null : JsonDocument.Parse(reader["c_description"].ToString()),

                            type = reader["c_type"].ToString(),
                            startDate = Convert.ToDateTime(reader["c_startdate"]),
                            endDate = Convert.ToDateTime(reader["c_enddate"]),
                            startTime = reader["c_starttime"] == DBNull.Value ? null : TimeSpan.Parse(reader["c_starttime"].ToString()),
                            endTime = reader["c_endtime"] == DBNull.Value ? null : TimeSpan.Parse(reader["c_endtime"].ToString()),

                            duration = reader["c_duration"] == DBNull.Value ? 0 : Convert.ToInt32(reader["c_duration"]),
                            maxCapacity = reader["c_maxcapacity"] == DBNull.Value ? 0 : Convert.ToInt32(reader["c_maxcapacity"]),
                            availableCapacity = reader["c_availablecapacity"] == DBNull.Value ? 0 : Convert.ToInt32(reader["c_availablecapacity"]),
                            requiredEquipments = reader["c_requiredequipments"].ToString(),
                            createdAt = Convert.ToDateTime(reader["c_createdat"]),
                            status = reader["c_status"].ToString(),
                            city = reader["c_city"].ToString(),
                            address = reader["c_address"].ToString(),
                            assets = reader["c_assets"] == DBNull.Value ? null : JsonDocument.Parse(reader["c_assets"].ToString()),

                            fee = reader["c_fees"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["c_fees"])
                        });
                    }
                }
            }

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }

        return task;
    }
    #endregion

    #region GetOne
    public async Task<Class> GetOne(string id)
    {
        try
        {
            if (_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }
            using (var cmd = new NpgsqlCommand("SELECT * FROM t_Class WHERE c_classid = @c_classid", _conn))
            {
                cmd.Parameters.AddWithValue("@c_classid", int.Parse(id));
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        return new Class
                        {
                            classId = Convert.ToInt32(reader["c_classid"]),
                            className = reader["c_classname"].ToString(),
                            instructorId = Convert.ToInt32(reader["c_instructorid"]),
                            description = reader["c_description"] == DBNull.Value ? null : JsonDocument.Parse(reader["c_description"].ToString()),

                            type = reader["c_type"].ToString(),
                            startDate = Convert.ToDateTime(reader["c_startdate"]),
                            endDate = Convert.ToDateTime(reader["c_enddate"]),
                            startTime = reader["c_starttime"] == DBNull.Value ? null : TimeSpan.Parse(reader["c_starttime"].ToString()),
                            endTime = reader["c_endtime"] == DBNull.Value ? null : TimeSpan.Parse(reader["c_endtime"].ToString()),

                            duration = reader["c_duration"] == DBNull.Value ? 0 : Convert.ToInt32(reader["c_duration"]),
                            maxCapacity = reader["c_maxcapacity"] == DBNull.Value ? 0 : Convert.ToInt32(reader["c_maxcapacity"]),
                            availableCapacity = reader["c_availablecapacity"] == DBNull.Value ? 0 : Convert.ToInt32(reader["c_availablecapacity"]),
                            requiredEquipments = reader["c_requiredequipments"].ToString(),
                            createdAt = Convert.ToDateTime(reader["c_createdat"]),
                            status = reader["c_status"].ToString(),
                            city = reader["c_city"].ToString(),
                            address = reader["c_address"].ToString(),
                            assets = reader["c_assets"] == DBNull.Value ? null : JsonDocument.Parse(reader["c_assets"].ToString()),

                            fee = reader["c_fees"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["c_fees"])
                        };
                    }
                }
            }

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }

        return null;
    }
    #endregion

    #endregion

    #region SoftDeleteClass
    public async Task<bool> SoftDeleteClass(int classId)
    {
        try
        {
            string checkQuery = "SELECT c_status FROM t_class WHERE c_classid = @ClassId";
            string query = "UPDATE t_class SET c_status = 'Suspended' WHERE c_classid = @ClassId";

            await _conn.OpenAsync();

            using (var checkCommand = new NpgsqlCommand(checkQuery, _conn))
            {
                checkCommand.Parameters.AddWithValue("@ClassId", classId);
                string status = checkCommand.ExecuteScalar()?.ToString();

                if (status == "Suspended")
                {
                    return false; 
                }
            }

            using (var command = new NpgsqlCommand(query, _conn))
            {
                command.Parameters.AddWithValue("@ClassId", classId);
                return command.ExecuteNonQuery() > 0;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return false;
        }
        finally
        {
            await _conn.CloseAsync();
        }
    }
    #endregion
}


using Npgsql;
using Newtonsoft.Json;
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

            // First check if user has already booked this class
            using (var checkExistingBooking = new NpgsqlCommand(
                "SELECT COUNT(*) FROM t_Bookings WHERE c_userid = @userId AND c_classid = @classId", _conn))
            {
                checkExistingBooking.Parameters.AddWithValue("@userId", req.userId);
                checkExistingBooking.Parameters.AddWithValue("@classId", req.classId);
                int existingBookings = Convert.ToInt32(await checkExistingBooking.ExecuteScalarAsync());
                
                if (existingBookings > 0)
                {
                    response.success = false;
                    response.message = "You have already booked this class";
                    return response;
                }
            }

            // Start a transaction
            using (var transaction = await _conn.BeginTransactionAsync())
            {
                try
                {
                    // Check if class exists and has available capacity
                    using (var checkCmd = new NpgsqlCommand(
                        "SELECT c_availablecapacity, c_maxcapacity FROM t_Class WHERE c_classid = @classId FOR UPDATE", 
                        _conn, 
                        transaction))
                    {
                        checkCmd.Parameters.AddWithValue("@classId", req.classId);
                        using (var reader = await checkCmd.ExecuteReaderAsync())
                        {
                            if (!await reader.ReadAsync())
                            {
                                response.success = false;
                                response.message = "Class not found";
                                return response;
                            }

                            int availableCapacity = Convert.ToInt32(reader["c_availablecapacity"]);
                            int maxCapacity = Convert.ToInt32(reader["c_maxcapacity"]);

                            if (availableCapacity <= 0)
                            {
                                response.success = false;
                                response.message = "Class is full - no available seats";
                                return response;
                            }
                        }
                    }

                    // Create booking
                    using (var bookingCmd = new NpgsqlCommand(
                        "INSERT INTO t_Bookings (c_bookingid, c_userid, c_classid, c_createdat) " +
                        "VALUES (DEFAULT, @userId, @classId, @createdAt) RETURNING c_bookingid", 
                        _conn, 
                        transaction))
                    {
                        bookingCmd.Parameters.AddWithValue("@userId", req.userId);
                        bookingCmd.Parameters.AddWithValue("@classId", req.classId);
                        bookingCmd.Parameters.AddWithValue("@createdAt", DateTime.UtcNow);
                        await bookingCmd.ExecuteScalarAsync();
                    }

                    // Decrease available capacity
                    using (var updateCmd = new NpgsqlCommand(
                        "UPDATE t_Class SET c_availablecapacity = c_availablecapacity - 1 " +
                        "WHERE c_classid = @classId AND c_availablecapacity > 0", 
                        _conn, 
                        transaction))
                    {
                        updateCmd.Parameters.AddWithValue("@classId", req.classId);
                        int rowsAffected = await updateCmd.ExecuteNonQueryAsync();
                        
                        if (rowsAffected == 0)
                        {
                            throw new Exception("Failed to update class capacity");
                        }
                    }

                    // Commit transaction
                    await transaction.CommitAsync();

                    response.message = "Class booked successfully";
                    
                    
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    response.success = false;
                    response.message = $"Booking failed: {ex.Message}";
                    return response;
                }
            }
        }
        catch (Exception ex)
        {
            response.success = false;
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
            using (var cmd = new NpgsqlCommand("SELECT t1.*,t2.c_instructorname FROM t_Class t1 join t_instructor t2 on t1.c_instructorid = t2.c_instructorid", _conn))
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
                            instructorName = reader["c_instructorname"].ToString(),
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
            using (var cmd = new NpgsqlCommand("SELECT t1.*,t2.c_instructorname FROM t_Class t1 join t_instructor t2 on t1.c_instructorid = t2.c_instructorid WHERE t1.c_instructorid = @c_instructorid", _conn))
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
            using (var cmd = new NpgsqlCommand("SELECT t1.*,t2.c_instructorname FROM t_Class t1 join t_instructor t2 on t1.c_instructorid = t2.c_instructorid WHERE c_classid = @c_classid", _conn))
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
                            instructorName = reader["c_instructorname"].ToString(),
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

    #region GetBookedClassesByUserId

    public async Task<List<Class>> GetBookedClassesByUserId(string userId)
    {
        List<Class> classes = new List<Class>();
        try
        {
            if (_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }

            // Query to get classes booked by a specific user
            using (var cmd = new NpgsqlCommand(
                @"SELECT c.*,i.c_instructorname FROM t_Class c
              INNER JOIN t_Bookings b ON c.c_classid = b.c_classid
              INNER JOIN t_instructor i on i.c_instructorid = c.c_instructorid
              WHERE b.c_userid = @userId", _conn))
            {
                System.Console.WriteLine("user id inside repo is " + userId);
                cmd.Parameters.AddWithValue("@userId", int.Parse(userId));

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
                            instructorName = reader["c_instructorname"].ToString(),

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
        finally
        {
            if (_conn.State == ConnectionState.Open)
            {
                await _conn.CloseAsync();
            }
        }
        return classes;
    }

    #endregion

    public async Task<bool> IsCancellationAllowed(int bookingId, int maxHoursBefore = 24)
    {
        try
        {
            if (_conn.State == ConnectionState.Closed)
            {
                await _conn.OpenAsync();
            }

            using (var cmd = new NpgsqlCommand(
                @"SELECT b.c_createdat, c.c_startdate, c.c_starttime 
              FROM t_bookings b
              JOIN t_class c ON b.c_classid = c.c_classid
              WHERE b.c_bookingid = @bookingId", _conn))
            {
                cmd.Parameters.AddWithValue("@bookingId", bookingId);

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        var bookingTime = Convert.ToDateTime(reader["c_createdat"]);
                        var classDate = Convert.ToDateTime(reader["c_startdate"]);
                        var startTime = reader["c_starttime"] == DBNull.Value
                            ? TimeSpan.Zero
                            : TimeSpan.Parse(reader["c_starttime"].ToString());

                        var classDateTime = classDate.Date.Add(startTime);
                        var timeUntilClass = classDateTime - DateTime.Now;
                        // var timeSinceBooking = DateTime.Now - bookingTime;


                    return timeUntilClass.TotalHours > 24;
                    }
                }
            }
            return false;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error checking cancellation: {ex.Message}");
            return false;
        }
        finally
        {
            if (_conn.State == ConnectionState.Open)
            {
                await _conn.CloseAsync();
            }
        }
    }

    public async Task<(bool success, string message)> CancelBooking(int userId, int classId)
    {

         var bookingId = 0;
        try
        {
            if (_conn.State == ConnectionState.Closed)
            {
                await _conn.OpenAsync();
            }

            // 1. Verify booking exists and belongs to user with JOIN to ensure class exists
            using (var checkCmd = new NpgsqlCommand(
                @"SELECT c_bookingid 
                FROM t_bookings where           
                c_userid = @userId AND
                c_classid = @classId", _conn))
            {
                // checkCmd.Parameters.AddWithValue("@bookingId", bookingId);
                checkCmd.Parameters.AddWithValue("@userId", userId);
                checkCmd.Parameters.AddWithValue("@classId", classId);

                using (var reader = await checkCmd.ExecuteReaderAsync())
                {
                    if (!await reader.ReadAsync())
                    {
                        return (false, "Booking not found or doesn't belong to user/class");
                    }

                    bookingId = Convert.ToInt32(reader["c_bookingid"]);

                }
            }

            // 2. Check cancellation window
            if (!await IsCancellationAllowed(bookingId))
            {
                return (false, "Cancellation is allowed before 24 hours of the start.");
            }

            if (_conn.State == ConnectionState.Closed)
            {
                await _conn.OpenAsync();
            }

            // 3. Delete booking
            using (var deleteCmd = new NpgsqlCommand(
                "DELETE FROM t_bookings WHERE c_userid=@c_userid and c_classid=@c_classid", _conn))
            {
                deleteCmd.Parameters.AddWithValue("@c_userid", userId);
                deleteCmd.Parameters.AddWithValue("@c_classid", classId);
                int rowsAffected = await deleteCmd.ExecuteNonQueryAsync();

                if (rowsAffected == 0)
                {
                    return (false, "Failed to delete booking");
                }
            }

            // 4. Increase class capacity
            using (var updateCmd = new NpgsqlCommand(
                "UPDATE t_class SET c_availablecapacity = c_availablecapacity + 1 " +
                "WHERE c_classid = @classId", _conn))
            {
                updateCmd.Parameters.AddWithValue("@classId", classId);
                await updateCmd.ExecuteNonQueryAsync();
            }

            return (true, "Booking canceled successfully");
        }
        catch (Exception ex)
        {
            return (false, $"Error during cancellation: {ex.Message}");
        }
        finally
        {
            if (_conn.State == ConnectionState.Open)
            {
                await _conn.CloseAsync();
            }
        }
    }

    #endregion
}
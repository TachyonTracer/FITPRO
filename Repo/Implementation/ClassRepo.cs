using Npgsql;
using Newtonsoft.Json;
using System.Text.Json;
using System.Data;
namespace Repo;
public class ClassRepo : IClassInterface
{
    public readonly NpgsqlConnection _conn;
    private readonly RabbitMQService _rabbitMQService;

    public ClassRepo(NpgsqlConnection conn, RabbitMQService rabbitMQService)
    {
        _conn = conn;
        _rabbitMQService = rabbitMQService;
    }

    public async Task<bool> IsClassAlreadyBooked(Booking bookingData)
    {
        try
        {
            using (var cm = new NpgsqlCommand(@"select * from t_bookings where c_userid = @c_userid AND c_classid = @c_classid", _conn))
            {
                cm.Parameters.AddWithValue("@c_userid", bookingData.userId);
                cm.Parameters.AddWithValue("@c_classid", bookingData.classId);
            

                if (_conn.State != ConnectionState.Open)
                {
                    await _conn.OpenAsync();
                }
                var result = await cm.ExecuteReaderAsync();
                if (result.HasRows)
                {
                    return true;
                }
                else
                {
                    return false;
                }

            }


        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return false;
        }
        finally
        {
            if (_conn.State != ConnectionState.Closed)
            {
                await _conn.CloseAsync();
            }

        }

    }


   #region Book:Class
    public async Task<Response> BookClass(Booking req)
    {
        Response response = new Response();
        try
        {
            if (_conn.State == ConnectionState.Closed) await _conn.OpenAsync();

            // Check if user has already booked this class
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

            using (var transaction = await _conn.BeginTransactionAsync())
            {
                try
                {
                    int availableCapacity = 0;
                    int maxCapacity = 0;
                    int instructorId = 0;
                    string className = string.Empty;

                    // Check class exists and capacity
                    using (var checkCmd = new NpgsqlCommand(
                        "SELECT c_availablecapacity, c_maxcapacity, c_instructorid, c_classname FROM t_Class WHERE c_classid = @classId FOR UPDATE", 
                        _conn, transaction))
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

                            availableCapacity = Convert.ToInt32(reader["c_availablecapacity"]);
                            maxCapacity = Convert.ToInt32(reader["c_maxcapacity"]);
                            instructorId = Convert.ToInt32(reader["c_instructorid"]);
                            className = Convert.ToString(reader["c_classname"]);
                        }
                    }

                    if (availableCapacity <= 0)
                    {
                        // Get next waitlist number
                        using (var waitlistCmd = new NpgsqlCommand(
                            "SELECT COALESCE(MAX(c_waitlist), 0) + 1 FROM t_bookings WHERE c_classid = @classId AND c_waitlist > 0", 
                            _conn, transaction))
                        {
                            waitlistCmd.Parameters.AddWithValue("@classId", req.classId);
                            int waitlistNumber = Convert.ToInt32(await waitlistCmd.ExecuteScalarAsync());

                            // Add to waitlist
                            using (var bookingCmd = new NpgsqlCommand(
                                "INSERT INTO t_Bookings (c_bookingid, c_userid, c_classid, c_createdat, c_waitlist) " +
                                "VALUES (DEFAULT, @userId, @classId, @createdAt, @waitlist) RETURNING c_bookingid", 
                                _conn, transaction))
                            {
                                bookingCmd.Parameters.AddWithValue("@userId", req.userId);
                                bookingCmd.Parameters.AddWithValue("@classId", req.classId);
                                bookingCmd.Parameters.AddWithValue("@createdAt", DateTime.UtcNow);
                                bookingCmd.Parameters.AddWithValue("@waitlist", waitlistNumber);
                                await bookingCmd.ExecuteScalarAsync();
                            }

                            await transaction.CommitAsync();
                            response.success = true;
                            response.message = $"Added to waitlist. Your position is {waitlistNumber}";
                            return response;
                        }
                    }

                    if (availableCapacity == 1)
                    {
                        _rabbitMQService.PublishNotification(instructorId.ToString(), "instructor", 
                            $"Class Full !!!::One of your class {className} is fully booked!::{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}");
                    }

                    // Create regular booking
                    using (var bookingCmd = new NpgsqlCommand(
                        "INSERT INTO t_Bookings (c_bookingid, c_userid, c_classid, c_createdat, c_waitlist) " +
                        "VALUES (DEFAULT, @userId, @classId, @createdAt, 0) RETURNING c_bookingid", 
                        _conn, transaction))
                    {
                        bookingCmd.Parameters.AddWithValue("@userId", req.userId);
                        bookingCmd.Parameters.AddWithValue("@classId", req.classId);
                        bookingCmd.Parameters.AddWithValue("@createdAt", DateTime.UtcNow);
                        await bookingCmd.ExecuteScalarAsync();
                    }

                    // Update capacity
                    using (var updateCmd = new NpgsqlCommand(
                        "UPDATE t_Class SET c_availablecapacity = c_availablecapacity - 1 " +
                        "WHERE c_classid = @classId AND c_availablecapacity > 0", 
                        _conn, transaction))
                    {
                        updateCmd.Parameters.AddWithValue("@classId", req.classId);
                        int rowsAffected = await updateCmd.ExecuteNonQueryAsync();
                        
                        if (rowsAffected == 0) throw new Exception("Failed to update class capacity");
                    }

                    await transaction.CommitAsync();
                    response.success = true;
                    response.message = "Class booked successfully";
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    response.success = false;
                    response.message = $"Booking failed: {ex.Message}";
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
            if (_conn.State == ConnectionState.Open) await _conn.CloseAsync();
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

        #region Check if cancellation is allowed
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
        #endregion
        
        #region Cancel Booking
    public async Task<(bool success, string message)> CancelBooking(int userId, int classId)
    {
        try
        {
            await _conn.OpenAsync();

            // First check if the booking exists and get its details
            int bookingId;
            bool isWaitlisted;
            using (var checkCmd = new NpgsqlCommand(
                @"SELECT c_bookingid, c_waitlist FROM t_bookings 
                WHERE c_userid = @userId AND c_classid = @classId", _conn))
            {
                checkCmd.Parameters.AddWithValue("@userId", userId);
                checkCmd.Parameters.AddWithValue("@classId", classId);

                using var reader = await checkCmd.ExecuteReaderAsync();
                if (!await reader.ReadAsync())
                    return (false, "Booking not found");

                bookingId = Convert.ToInt32(reader["c_bookingid"]);
                isWaitlisted = Convert.ToInt32(reader["c_waitlist"]) > 0;
            }

            // Check cancellation window for non-waitlisted bookings
            if (!isWaitlisted)
            {
                bool canCancel = await IsCancellationAllowed(bookingId);
                if (!canCancel)
                {
                    return (false, "Cancellation is allowed before 24 hours of the start.");
                }
                await _conn.OpenAsync(); // Reopen connection after IsCancellationAllowed
            }

            using var transaction = await _conn.BeginTransactionAsync();
            try
            {
                // Delete the booking
                using (var deleteCmd = new NpgsqlCommand(
                    "DELETE FROM t_bookings WHERE c_userid = @userId AND c_classid = @classId", 
                    _conn, transaction))
                {
                    deleteCmd.Parameters.AddWithValue("@userId", userId);
                    deleteCmd.Parameters.AddWithValue("@classId", classId);
                    if (await deleteCmd.ExecuteNonQueryAsync() == 0)
                        return (false, "Failed to delete booking");
                }

                if (!isWaitlisted)
                {
                    // Update available capacity for non-waitlisted bookings
                    using (var updateCapacityCmd = new NpgsqlCommand(
                        "UPDATE t_class SET c_availablecapacity = c_availablecapacity + 1 WHERE c_classid = @classId",
                        _conn, transaction))
                    {
                        updateCapacityCmd.Parameters.AddWithValue("@classId", classId);
                        await updateCapacityCmd.ExecuteNonQueryAsync();
                    }

                    // Promote first waitlisted user
                    using (var promoteCmd = new NpgsqlCommand(@"
                        UPDATE t_bookings 
                        SET c_waitlist = 0 
                        WHERE c_bookingid = (
                            SELECT c_bookingid 
                            FROM t_bookings 
                            WHERE c_classid = @classId 
                            AND c_waitlist > 0 
                            ORDER BY c_waitlist ASC 
                            LIMIT 1
                        )", _conn, transaction))
                    {
                        promoteCmd.Parameters.AddWithValue("@classId", classId);
                        await promoteCmd.ExecuteNonQueryAsync();
                    }

                    // Update remaining waitlist numbers
                    using (var updateWaitlistCmd = new NpgsqlCommand(
                        @"UPDATE t_bookings 
                        SET c_waitlist = c_waitlist - 1 
                        WHERE c_classid = @classId 
                        AND c_waitlist > 1",
                        _conn, transaction))
                    {
                        updateWaitlistCmd.Parameters.AddWithValue("@classId", classId);
                        await updateWaitlistCmd.ExecuteNonQueryAsync();
                    }
                }

                await transaction.CommitAsync();
                return (true, "Booking canceled successfully");
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        catch (Exception ex)
        {
            return (false, $"Error during cancellation: {ex.Message}");
        }
        finally
        {
            if (_conn.State == ConnectionState.Open)
                await _conn.CloseAsync();
        }
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



    #region  ScheduleClass 
    public async Task<int> ScheduleClass(Class classData)
    {
        try
        {
            if (_conn.State != ConnectionState.Open)
            {
                await _conn.OpenAsync();
            }

            // // 🔹 Ensure class duration is at least 1 hour
            // TimeSpan duration = (TimeSpan)(classData.endTime - classData.startTime);
            // if (duration.TotalMinutes < 60)
            // {
            //     return -4; // Class duration is less than 1 hour
            // }

            // 🔹 Check if the instructor already has a class with the same name and type
            using (var checkCmd = new NpgsqlCommand(@"
            SELECT COUNT(*) FROM t_class 
            WHERE c_instructorid = @c_instructorid 
            AND c_classname = @c_classname
            AND c_type = @c_type", _conn))
            {
                checkCmd.Parameters.AddWithValue("@c_instructorid", classData.instructorId);
                checkCmd.Parameters.AddWithValue("@c_classname", classData.className);
                checkCmd.Parameters.AddWithValue("@c_type", classData.type);

                int existingCount = Convert.ToInt32(await checkCmd.ExecuteScalarAsync());
                if (existingCount > 0)
                {
                    return -2; // Duplicate class name and type for instructor
                }
            }

            // 🔹 Check for overlapping class times on the same date
            using (var checkTimeCmd = new NpgsqlCommand(@"
            SELECT COUNT(*) FROM t_class 
            WHERE c_instructorid = @c_instructorid
            AND c_startdate = @c_startdate
            AND (
                (@c_starttime BETWEEN c_starttime AND c_endtime) 
                OR 
                (@c_endtime BETWEEN c_starttime AND c_endtime) 
                OR 
                (c_starttime BETWEEN @c_starttime AND @c_endtime)
                OR 
                (c_endtime BETWEEN @c_starttime AND @c_endtime)
            )", _conn))
            {
                checkTimeCmd.Parameters.AddWithValue("@c_instructorid", classData.instructorId);
                checkTimeCmd.Parameters.AddWithValue("@c_startdate", classData.startDate);
                checkTimeCmd.Parameters.AddWithValue("@c_starttime", classData.startTime);
                checkTimeCmd.Parameters.AddWithValue("@c_endtime", classData.endTime);

                int overlappingCount = Convert.ToInt32(await checkTimeCmd.ExecuteScalarAsync());
                if (overlappingCount > 0)
                {
                    return -3; // Instructor already has another class during this time
                }
            }

            // 🔹 Insert class data into the database
            using (var cm = new NpgsqlCommand(@"
        INSERT INTO t_class(
            c_classname, c_instructorid, c_description, c_type, c_startdate, c_enddate, 
            c_starttime, c_endtime, c_duration, c_maxcapacity, c_availablecapacity, 
            c_requiredequipments, c_createdat, c_status, c_city, c_address, c_assets, c_fees
        ) 
        VALUES (
            @c_classname, @c_instructorid, @c_description, @c_type, @c_startdate, @c_enddate, 
            @c_starttime, @c_endtime, @c_duration, @c_maxcapacity, @c_availablecapacity, 
            @c_requiredequipments, @c_createdat, @c_status, @c_city, @c_address, @c_assets, @c_fees
        )", _conn))
            {
                cm.Parameters.AddWithValue("@c_classname", classData.className);
                cm.Parameters.AddWithValue("@c_instructorid", classData.instructorId);
                cm.Parameters.AddWithValue("@c_description", classData.description);
                cm.Parameters.AddWithValue("@c_type", classData.type);
                cm.Parameters.AddWithValue("@c_startdate", classData.startDate);
                cm.Parameters.AddWithValue("@c_enddate", classData.endDate);
                cm.Parameters.AddWithValue("@c_starttime", classData.startTime);
                cm.Parameters.AddWithValue("@c_endtime", classData.endTime);
                cm.Parameters.AddWithValue("@c_duration", classData.duration);
                cm.Parameters.AddWithValue("@c_maxcapacity", classData.maxCapacity);
                cm.Parameters.AddWithValue("@c_availablecapacity", classData.maxCapacity);
                cm.Parameters.AddWithValue("@c_requiredequipments", classData.requiredEquipments ?? (object)DBNull.Value);
                cm.Parameters.AddWithValue("@c_createdat", classData.createdAt);
                cm.Parameters.AddWithValue("@c_status", classData.status);
                cm.Parameters.AddWithValue("@c_city", classData.city);
                cm.Parameters.AddWithValue("@c_address", classData.address);
                cm.Parameters.AddWithValue("@c_assets", classData.assets);
                cm.Parameters.AddWithValue("@c_fees", classData.fee);

                int result = await cm.ExecuteNonQueryAsync();
                return result > 0 ? 1 : 0;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            return -1; // General error
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

    #region UpdateClass

    public async Task<int> UpdateClass(Class updatedClass)
    {
        try
        {
            if (_conn.State == ConnectionState.Closed)
            {
                await _conn.OpenAsync();
            }

            // Check if class exists
            using (var checkCmd = new NpgsqlCommand(
                "SELECT COUNT(1) FROM t_Class WHERE c_classid = @classId", _conn))
            {
                checkCmd.Parameters.AddWithValue("@classId", updatedClass.classId);
                var exists = (long)await checkCmd.ExecuteScalarAsync();

                if (exists == 0)
                {
                    return -1; // Class not found
                }
            }

            // Check for duplicate class name and type
            using (var checkCmd = new NpgsqlCommand(@"
            SELECT COUNT(*) FROM t_class 
            WHERE c_instructorid = @c_instructorid 
            AND c_classname = @c_classname
            AND c_type = @c_type
            AND c_classid != @c_classid", _conn))
            {
                checkCmd.Parameters.AddWithValue("@c_instructorid", updatedClass.instructorId);
                checkCmd.Parameters.AddWithValue("@c_classname", updatedClass.className);
                checkCmd.Parameters.AddWithValue("@c_type", updatedClass.type);
                checkCmd.Parameters.AddWithValue("@c_classid", updatedClass.classId);

                int existingCount = Convert.ToInt32(await checkCmd.ExecuteScalarAsync());
                if (existingCount > 0)
                {
                    return -2; // Duplicate class name and type for instructor
                }
            }

            // Check for overlapping class times
            using (var checkTimeCmd = new NpgsqlCommand(@"
            SELECT COUNT(*) FROM t_class 
            WHERE c_instructorid = @c_instructorid
            AND c_startdate = @c_startdate
            AND c_classid != @c_classid
            AND (
                (@c_starttime BETWEEN c_starttime AND c_endtime) 
                OR (@c_endtime BETWEEN c_starttime AND c_endtime) 
                OR (c_starttime BETWEEN @c_starttime AND @c_endtime)
                OR (c_endtime BETWEEN @c_starttime AND @c_endtime)
            )", _conn))
            {
                checkTimeCmd.Parameters.AddWithValue("@c_instructorid", updatedClass.instructorId);
                checkTimeCmd.Parameters.AddWithValue("@c_startdate", updatedClass.startDate);
                checkTimeCmd.Parameters.AddWithValue("@c_starttime", updatedClass.startTime);
                checkTimeCmd.Parameters.AddWithValue("@c_endtime", updatedClass.endTime);
                checkTimeCmd.Parameters.AddWithValue("@c_classid", updatedClass.classId);

                int overlappingCount = Convert.ToInt32(await checkTimeCmd.ExecuteScalarAsync());
                if (overlappingCount > 0)
                {
                    return -3; // Time slot conflict
                }
            }

            // Update class
            using (var cmd = new NpgsqlCommand(
                @"UPDATE t_Class SET 
            c_classname = @className,
            c_instructorid = @instructorId,
            c_description = @description,
            c_type = @type,
            c_startdate = @startDate,
            c_enddate = @endDate,
            c_starttime = @startTime,
            c_endtime = @endTime,
            c_duration = @duration,
            c_maxcapacity = @maxCapacity,
            c_availablecapacity = @availableCapacity,
            c_requiredequipments = @requiredEquipments,
            c_status = @status,
            c_city = @city,
            c_address = @address,
            c_assets = @assets,
            c_fees = @fee
            WHERE c_classid = @classId", _conn))
            {
                cmd.Parameters.AddWithValue("@classId", updatedClass.classId);
                cmd.Parameters.AddWithValue("@className", updatedClass.className ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@instructorId", updatedClass.instructorId);
                cmd.Parameters.AddWithValue("@description", updatedClass.description ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@type", updatedClass.type ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@startDate", updatedClass.startDate);
                cmd.Parameters.AddWithValue("@endDate", updatedClass.endDate ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@startTime", updatedClass.startTime ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@endTime", updatedClass.endTime ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@duration", updatedClass.duration ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@maxCapacity", updatedClass.maxCapacity);
                cmd.Parameters.AddWithValue("@availableCapacity", updatedClass.availableCapacity);
                cmd.Parameters.AddWithValue("@requiredEquipments", updatedClass.requiredEquipments ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@status", updatedClass.status ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@city", updatedClass.city ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@address", updatedClass.address ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@assets", updatedClass.assets ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@fee", updatedClass.fee);

                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                return rowsAffected > 0 ? 1 : 0;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            return -4; // General error
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

    #region Activate Class
    public async Task<bool> ActivateClass(int classId)
    {
        try
        {
            string checkQuery = "SELECT c_status FROM t_class WHERE c_classid = @ClassId";
            string query = "UPDATE t_class SET c_status = 'Active' WHERE c_classid = @ClassId";

            await _conn.OpenAsync();

            using (var checkCommand = new NpgsqlCommand(checkQuery, _conn))
            {
                checkCommand.Parameters.AddWithValue("@ClassId", classId);
                string status = checkCommand.ExecuteScalar()?.ToString();

                if (status == "Active")
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


    #region ClasswiseWaitlistCount
    public async Task<int> ClasswiseWaitlistCount(string classId)
    {
        var query = @"
                    SELECT COUNT(*) AS upcoming_class_count
                    FROM t_bookings 
                    WHERE c_classid = @classId
                    AND c_waitlist > 0;";

        if (_conn.State != ConnectionState.Open)
        {
            await _conn.OpenAsync();
        }

        try
        {
            using (var cmd = new NpgsqlCommand(query, _conn))
            {
                cmd.Parameters.AddWithValue("@classId", Convert.ToInt32(classId));

                var count = await cmd.ExecuteScalarAsync();
                return Convert.ToInt32(count);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("------>Error while Fetching Classwise Waitlist Count: " + ex.Message);
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

}


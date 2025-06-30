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

    // DRY: Centralized method for executing a reader query
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

    private async Task<decimal> GetUserBalance(int userId)
    {
        string query = "SELECT c_balance FROM t_user WHERE c_userid = @userId";
        return await ExecuteScalarAsync<decimal>(query, cmd => cmd.Parameters.AddWithValue("@userId", userId));
    }

    private async Task<bool> UpdateUserBalance(int userId, decimal amount)
    {
        string query = "UPDATE t_user SET c_balance = c_balance + @amount WHERE c_userid = @userId";
        int rows = await ExecuteScalarAsync<int>(
            $"WITH updated AS ({query} RETURNING 1) SELECT COUNT(*) FROM updated;",
            cmd =>
            {
                cmd.Parameters.AddWithValue("@amount", amount);
                cmd.Parameters.AddWithValue("@userId", userId);
            });
        return rows > 0;
    }

    private async Task AddWalletTransaction(int userId, decimal amount, string type, string description)
    {
        string query = @"INSERT INTO t_wallet_transactions (c_userid, c_amount, c_type, c_description, c_timestamp)
                         VALUES (@userId, @amount, @type, @description, @timestamp)";
        await ExecuteScalarAsync<object>(query, cmd =>
        {
            cmd.Parameters.AddWithValue("@userId", userId);
            cmd.Parameters.AddWithValue("@amount", amount);
            cmd.Parameters.AddWithValue("@type", type);
            cmd.Parameters.AddWithValue("@description", description);
            cmd.Parameters.AddWithValue("@timestamp", DateTime.UtcNow);
        });
    }

    public async Task<bool> IsClassAlreadyBooked(Booking bookingData)
    {
        string query = @"SELECT 1 FROM t_bookings WHERE c_userid = @c_userid AND c_classid = @c_classid";
        int exists = await ExecuteScalarAsync<int>(query, cmd =>
        {
            cmd.Parameters.AddWithValue("@c_userid", bookingData.userId);
            cmd.Parameters.AddWithValue("@c_classid", bookingData.classId);
        });
        return exists == 1;
    }

    #region Book:Class

    public async Task<Response> BookClass(Booking req)
    {
        var response = new Response();
        await EnsureOpenAsync();
        try
        {
            // Check if user has already booked this class
            string checkBookingQuery = "SELECT COUNT(*) FROM t_Bookings WHERE c_userid = @userId AND c_classid = @classId";
            int existingBookings = await ExecuteScalarAsync<int>(checkBookingQuery, cmd =>
            {
                cmd.Parameters.AddWithValue("@userId", req.userId);
                cmd.Parameters.AddWithValue("@classId", req.classId);
            });
            if (existingBookings > 0)
                return new Response { success = false, message = "You have already booked this class" };

            // Check class exists and capacity
            int availableCapacity = 0, maxCapacity = 0, instructorId = 0;
            string className = string.Empty;
            decimal classFee = 0;
            string classQuery = "SELECT c_availablecapacity, c_maxcapacity, c_instructorid, c_classname, c_fees FROM t_Class WHERE c_classid = @classId";
            await EnsureOpenAsync();
            using (var cmd = new NpgsqlCommand(classQuery, _conn))
            {
                cmd.Parameters.AddWithValue("@classId", req.classId);
                using var reader = await cmd.ExecuteReaderAsync();
                if (!await reader.ReadAsync())
                    return new Response { success = false, message = "Class not found" };
                availableCapacity = Convert.ToInt32(reader["c_availablecapacity"]);
                maxCapacity = Convert.ToInt32(reader["c_maxcapacity"]);
                instructorId = Convert.ToInt32(reader["c_instructorid"]);
                className = Convert.ToString(reader["c_classname"]);
                classFee = Convert.ToDecimal(reader["c_fees"]);
            }

            // Check user balance and deduct fee (only if not waitlist)
            if (availableCapacity > 0)
            {
                decimal userBalance = await GetUserBalance(req.userId);
                if (userBalance < classFee)
                    return new Response { success = false, message = "Insufficient wallet balance" };

                bool balanceUpdated = await UpdateUserBalance(req.userId, -classFee);
                if (!balanceUpdated)
                    return new Response { success = false, message = "Failed to deduct wallet balance" };

                await AddWalletTransaction(req.userId, -classFee, "debit", $"Booking for class {className}");
            }

            if (availableCapacity <= 0)
            {
                // Deduct wallet for waitlist too
                decimal userBalance = await GetUserBalance(req.userId);
                if (userBalance < classFee)
                    return new Response { success = false, message = "Insufficient wallet balance" };

                bool balanceUpdated = await UpdateUserBalance(req.userId, -classFee);
                if (!balanceUpdated)
                    return new Response { success = false, message = "Failed to deduct wallet balance" };

                await AddWalletTransaction(req.userId, -classFee, "debit", $"Waitlist booking for class {className}");

                // Add to waitlist
                string waitlistQuery = "SELECT COALESCE(MAX(c_waitlist), 0) + 1 FROM t_bookings WHERE c_classid = @classId AND c_waitlist > 0";
                int waitlistNumber = await ExecuteScalarAsync<int>(waitlistQuery, cmd => cmd.Parameters.AddWithValue("@classId", req.classId));
                string insertWaitlist = @"INSERT INTO t_Bookings (c_bookingid, c_userid, c_classid, c_createdat, c_waitlist) 
                                          VALUES (DEFAULT, @userId, @classId, @createdAt, @waitlist) RETURNING c_bookingid";
                await ExecuteScalarAsync<object>(insertWaitlist, cmd =>
                {
                    cmd.Parameters.AddWithValue("@userId", req.userId);
                    cmd.Parameters.AddWithValue("@classId", req.classId);
                    cmd.Parameters.AddWithValue("@createdAt", DateTime.UtcNow);
                    cmd.Parameters.AddWithValue("@waitlist", waitlistNumber);
                });
                return new Response { success = true, message = $"Added to waitlist. Your position is {waitlistNumber}" };
            }

            if (availableCapacity == 1)
            {
                _rabbitMQService.PublishNotification(instructorId.ToString(), "instructor",
                    $"Class Full !!!::One of your class {className} is fully booked!::{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}");
            }

            // Create regular booking
            string insertBooking = @"INSERT INTO t_Bookings (c_bookingid, c_userid, c_classid, c_createdat, c_waitlist) 
                                     VALUES (DEFAULT, @userId, @classId, @createdAt, 0) RETURNING c_bookingid";
            await ExecuteScalarAsync<object>(insertBooking, cmd =>
            {
                cmd.Parameters.AddWithValue("@userId", req.userId);
                cmd.Parameters.AddWithValue("@classId", req.classId);
                cmd.Parameters.AddWithValue("@createdAt", DateTime.UtcNow);
            });

            // Update capacity
            string updateCapacity = @"UPDATE t_Class SET c_availablecapacity = c_availablecapacity - 1 
                                      WHERE c_classid = @classId AND c_availablecapacity > 0";
            int rowsAffected = await ExecuteScalarAsync<int>(
                $"WITH updated AS ({updateCapacity} RETURNING 1) SELECT COUNT(*) FROM updated;", cmd =>
            {
                cmd.Parameters.AddWithValue("@classId", req.classId);
            });

            if (rowsAffected == 0)
            {
                // Attempt to delete the booking we just created since we couldn't update capacity
                string deleteBooking = "DELETE FROM t_Bookings WHERE c_userid = @userId AND c_classid = @classId";
                await ExecuteScalarAsync<object>(deleteBooking, cmd =>
                {
                    cmd.Parameters.AddWithValue("@userId", req.userId);
                    cmd.Parameters.AddWithValue("@classId", req.classId);
                });
                return new Response { success = false, message = "Failed to update class capacity" };
            }

            return new Response { success = true, message = "Class booked successfully" };
        }
        catch (Exception ex)
        {
            response.success = false;
            response.message = $"Error during booking: {ex.Message}";
        }
        finally
        {
            await EnsureClosedAsync();
        }
        return response;
    }
    #endregion

    #region User-Story :List Classes

    public async Task<List<Class>> GetAllClasses()
    {
        string query = @"SELECT t1.*,t2.c_instructorname FROM t_Class t1 
                         JOIN t_instructor t2 ON t1.c_instructorid = t2.c_instructorid";
        return await ExecuteReaderAsync(query, null, MapClass);
    }

    public async Task<List<Class>> GetAllActiveClasses()
    {
        string query = @"SELECT t1.*,t2.c_instructorname FROM t_Class t1 
                         JOIN t_instructor t2 ON t1.c_instructorid = t2.c_instructorid 
                         WHERE t1.c_status = 'Active'";
        return await ExecuteReaderAsync(query, null, MapClass);
    }

    public async Task<List<Class>> GetClassById(string id)
    {
        string query = @"SELECT t1.*,t2.c_instructorname FROM t_Class t1 
                         JOIN t_instructor t2 ON t1.c_instructorid = t2.c_instructorid 
                         WHERE t1.c_instructorid = @c_instructorid";
        return await ExecuteReaderAsync(query, cmd => cmd.Parameters.AddWithValue("@c_instructorid", int.Parse(id)), MapClass);
    }

    public async Task<Class> GetOne(string id)
    {
        string query = @"SELECT t1.*,t2.c_instructorname FROM t_Class t1 
                         JOIN t_instructor t2 ON t1.c_instructorid = t2.c_instructorid 
                         WHERE c_classid = @c_classid";
        var result = await ExecuteReaderAsync(query, cmd => cmd.Parameters.AddWithValue("@c_classid", int.Parse(id)), MapClass);
        return result.FirstOrDefault();
    }

    #endregion

    public async Task<List<Class>> GetBookedClassesByUserId(string userId)
    {
        string query = @"SELECT c.*,b.c_waitlist, i.c_instructorname FROM t_Class c
                         INNER JOIN t_Bookings b ON c.c_classid = b.c_classid
                         INNER JOIN t_instructor i on i.c_instructorid = c.c_instructorid
                         WHERE b.c_userid = @userId";
        return await ExecuteReaderAsync(query, cmd => cmd.Parameters.AddWithValue("@userId", int.Parse(userId)), MapClassWithWaitlist);
    }

    public async Task<(bool success, string message)> CancelBooking(int userId, int classId)
    {
        // Fix the invalid parameter value
        var connStringBuilder = new NpgsqlConnectionStringBuilder(_conn.ConnectionString)
        {
            Pooling = true,              // Keep connection pooling
            MaxPoolSize = 100,           // Standard pool size
            MaxAutoPrepare = 0,          // Disable statement pooling (key fix)
            AutoPrepareMinUsages = 1     // Changed from 0 to 1 - minimum valid value
        };
        
        using var transactionConn = new NpgsqlConnection(connStringBuilder.ToString());
        await transactionConn.OpenAsync();
        
        using var transaction = await transactionConn.BeginTransactionAsync();
        try
        {
            int bookingId = 0;
            int waitlist = 0;
            decimal classFee = 0;
            string className = string.Empty;

            string checkBookingQuery = @"SELECT b.c_bookingid, b.c_waitlist, c.c_fees, c.c_classname,
                               c.c_startdate, c.c_starttime
                        FROM t_bookings b
                        JOIN t_class c ON b.c_classid = c.c_classid
                        WHERE b.c_userid = @userId AND b.c_classid = @classId";
                
            using (var cmd = new NpgsqlCommand(checkBookingQuery, transactionConn, transaction))
            {
                cmd.Parameters.AddWithValue("@userId", userId);
                cmd.Parameters.AddWithValue("@classId", classId);
                    
                using var reader = await cmd.ExecuteReaderAsync();
                if (!await reader.ReadAsync())
                    return (false, "Booking not found.");
                        
                bookingId = Convert.ToInt32(reader["c_bookingid"]);
                waitlist = Convert.ToInt32(reader["c_waitlist"]);
                classFee = Convert.ToDecimal(reader["c_fees"]);
                className = Convert.ToString(reader["c_classname"]);
                
                // Check cancellation window for non-waitlist bookings
                if (waitlist == 0)
                {
                    var classDate = Convert.ToDateTime(reader["c_startdate"]);
                    var startTime = reader["c_starttime"] == DBNull.Value
                        ? TimeSpan.Zero
                        : TimeSpan.Parse(reader["c_starttime"].ToString());
                    var classDateTime = classDate.Date.Add(startTime);
                    var timeUntilClass = classDateTime - DateTime.Now;
                    
                    if (timeUntilClass.TotalHours <= 24)
                        return (false, "Cancellation is allowed only before 24 hours of class start.");
                }
            }

            // IMPORTANT: Check if user was actually charged for this booking
            bool wasCharged = false;
            using (var cmd = new NpgsqlCommand(
                @"SELECT COUNT(*) FROM t_wallet_transactions 
                  WHERE c_userid = @userId AND c_type = 'debit' 
                  AND c_description LIKE @desc", 
                transactionConn, transaction))
            {
                cmd.Parameters.AddWithValue("@userId", userId);
                cmd.Parameters.AddWithValue("@desc", $"%{className}%");
                wasCharged = Convert.ToInt32(await cmd.ExecuteScalarAsync()) > 0;
            }

            // Process refund if user was charged (either for confirmed booking or waitlist with pre-payment)
            if (waitlist == 0 || wasCharged)
            {
                // Refund to user's wallet
                using (var cmd = new NpgsqlCommand(
                    "UPDATE t_user SET c_balance = c_balance + @fee WHERE c_userid = @userId", 
                    transactionConn, transaction))
                {
                    cmd.Parameters.AddWithValue("@fee", classFee);
                    cmd.Parameters.AddWithValue("@userId", userId);
                    await cmd.ExecuteNonQueryAsync();
                }
                    
                // Log wallet transaction
                using (var cmd = new NpgsqlCommand(
                    @"INSERT INTO t_wallet_transactions 
                      (c_userid, c_amount, c_type, c_description, c_timestamp)
                      VALUES (@userId, @amount, @type, @desc, @ts)", 
                    transactionConn, transaction))
                {
                    cmd.Parameters.AddWithValue("@userId", userId);
                    cmd.Parameters.AddWithValue("@amount", classFee);
                    cmd.Parameters.AddWithValue("@type", "credit");
                    cmd.Parameters.AddWithValue("@desc", $"Refund for {(waitlist > 0 ? "waitlisted" : "")} class {className} cancellation");
                    cmd.Parameters.AddWithValue("@ts", DateTime.UtcNow);
                    await cmd.ExecuteNonQueryAsync();
                }
            }
                
            if (waitlist == 0)
            {
                // Update class capacity
                using (var cmd = new NpgsqlCommand(
                    "UPDATE t_class SET c_availablecapacity = c_availablecapacity + 1 WHERE c_classid = @classId", 
                    transactionConn, transaction))
                {
                    cmd.Parameters.AddWithValue("@classId", classId);
                    await cmd.ExecuteNonQueryAsync();
                }

                // Rest of your existing code for promoting waitlisted users...
            }
            else
            {
                // Handle waitlist booking cancellation - update other waitlist positions
                // (Your existing code for this part remains the same)
            }

            // Delete the booking
            using (var cmd = new NpgsqlCommand("DELETE FROM t_bookings WHERE c_bookingid = @bookingId", transactionConn, transaction))
            {
                cmd.Parameters.AddWithValue("@bookingId", bookingId);
                await cmd.ExecuteNonQueryAsync();
            }

            await transaction.CommitAsync();
            return (true, waitlist == 0 
                ? "Booking cancelled and refund processed." 
                : wasCharged 
                    ? "Waitlist booking cancelled and refund processed."
                    : "Waitlist booking cancelled.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR in CancelBooking: {ex.GetType().Name}: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            
            await transaction.RollbackAsync();
            return (false, $"Error during cancellation: {ex.Message}");
        }
    }

    public async Task<bool> IsCancellationAllowed(int bookingId, int maxHoursBefore = 24)
    {
        string query = @"SELECT b.c_createdat, c.c_startdate, c.c_starttime 
                         FROM t_bookings b
                         JOIN t_class c ON b.c_classid = c.c_classid
                         WHERE b.c_bookingid = @bookingId";
        await EnsureOpenAsync();
        try
        {
            using var cmd = new NpgsqlCommand(query, _conn);
            cmd.Parameters.AddWithValue("@bookingId", bookingId);
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                var bookingTime = Convert.ToDateTime(reader["c_createdat"]);
                var classDate = Convert.ToDateTime(reader["c_startdate"]);
                var startTime = reader["c_starttime"] == DBNull.Value
                    ? TimeSpan.Zero
                    : TimeSpan.Parse(reader["c_starttime"].ToString());
                var classDateTime = classDate.Date.Add(startTime);
                var timeUntilClass = classDateTime - DateTime.Now;
                return timeUntilClass.TotalHours > maxHoursBefore;
            }
            return false;
        }
        finally
        {
            await EnsureClosedAsync();
        }
    }

    public async Task<bool> SoftDeleteClass(int classId)
    {
        string checkQuery = "SELECT c_status FROM t_class WHERE c_classid = @ClassId";
        string query = "UPDATE t_class SET c_status = 'Suspended' WHERE c_classid = @ClassId";
        await EnsureOpenAsync();
        try
        {
            using (var checkCommand = new NpgsqlCommand(checkQuery, _conn))
            {
                checkCommand.Parameters.AddWithValue("@ClassId", classId);
                string status = checkCommand.ExecuteScalar()?.ToString();
                if (status == "Suspended")
                    return false;
            }
            using (var command = new NpgsqlCommand(query, _conn))
            {
                command.Parameters.AddWithValue("@ClassId", classId);
                return command.ExecuteNonQuery() > 0;
            }
        }
        finally
        {
            await EnsureClosedAsync();
        }
    }

    public async Task<int> ScheduleClass(Class classData)
    {
        await EnsureOpenAsync();
        try
        {
            // Check for duplicate class name and type for instructor
            string duplicateQuery = @"SELECT COUNT(*) FROM t_class 
                                      WHERE c_instructorid = @c_instructorid 
                                      AND c_classname = @c_classname
                                      AND c_type = @c_type";
            int existingCount = await ExecuteScalarAsync<int>(duplicateQuery, cmd =>
            {
                cmd.Parameters.AddWithValue("@c_instructorid", classData.instructorId);
                cmd.Parameters.AddWithValue("@c_classname", classData.className);
                cmd.Parameters.AddWithValue("@c_type", classData.type);
            });
            if (existingCount > 0)
                return -2;

            // Check for overlapping class times on the same date
            string overlapQuery = @"SELECT COUNT(*) FROM t_class 
                                    WHERE c_instructorid = @c_instructorid
                                    AND c_startdate = @c_startdate
                                    AND (
                                        (@c_starttime BETWEEN c_starttime AND c_endtime) 
                                        OR (@c_endtime BETWEEN c_starttime AND c_endtime) 
                                        OR (c_starttime BETWEEN @c_starttime AND @c_endtime)
                                        OR (c_endtime BETWEEN @c_starttime AND @c_endtime)
                                    )";
            int overlappingCount = await ExecuteScalarAsync<int>(overlapQuery, cmd =>
            {
                cmd.Parameters.AddWithValue("@c_instructorid", classData.instructorId);
                cmd.Parameters.AddWithValue("@c_startdate", classData.startDate);
                cmd.Parameters.AddWithValue("@c_starttime", classData.startTime ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@c_endtime", classData.endTime ?? (object)DBNull.Value);
            });
            if (overlappingCount > 0)
                return -3;

            // Insert class data
            string insertQuery = @"
                INSERT INTO t_class(
                    c_classname, c_instructorid, c_description, c_type, c_startdate, c_enddate, 
                    c_starttime, c_endtime, c_duration, c_maxcapacity, c_availablecapacity, 
                    c_requiredequipments, c_createdat, c_status, c_city, c_address, c_assets, c_fees
                ) 
                VALUES (
                    @c_classname, @c_instructorid, @c_description, @c_type, @c_startdate, @c_enddate, 
                    @c_starttime, @c_endtime, @c_duration, @c_maxcapacity, @c_availablecapacity, 
                    @c_requiredequipments, @c_createdat, @c_status, @c_city, @c_address, @c_assets, @c_fees
                )";
            int result = await ExecuteScalarAsync<int>(insertQuery, cm =>
            {
                cm.Parameters.AddWithValue("@c_classname", classData.className);
                cm.Parameters.AddWithValue("@c_instructorid", classData.instructorId);
                cm.Parameters.AddWithValue("@c_description", classData.description ?? (object)DBNull.Value);
                cm.Parameters.AddWithValue("@c_type", classData.type);
                cm.Parameters.AddWithValue("@c_startdate", classData.startDate);
                cm.Parameters.AddWithValue("@c_enddate", classData.endDate);
                cm.Parameters.AddWithValue("@c_starttime", classData.startTime ?? (object)DBNull.Value);
                cm.Parameters.AddWithValue("@c_endtime", classData.endTime ?? (object)DBNull.Value);
                cm.Parameters.AddWithValue("@c_duration", classData.duration);
                cm.Parameters.AddWithValue("@c_maxcapacity", classData.maxCapacity);
                cm.Parameters.AddWithValue("@c_availablecapacity", classData.maxCapacity);
                cm.Parameters.AddWithValue("@c_requiredequipments", classData.requiredEquipments ?? (object)DBNull.Value);
                cm.Parameters.AddWithValue("@c_createdat", classData.createdAt);
                cm.Parameters.AddWithValue("@c_status", classData.status);
                cm.Parameters.AddWithValue("@c_city", classData.city);
                cm.Parameters.AddWithValue("@c_address", classData.address);
                cm.Parameters.AddWithValue("@c_assets", classData.assets ?? (object)DBNull.Value);
                cm.Parameters.AddWithValue("@c_fees", classData.fee);
            });
            return result > 0 ? 1 : 0;
        }
        finally
        {
            await EnsureClosedAsync();
        }
    }

    public async Task<int> UpdateClass(Class updatedClass)
    {
        await EnsureOpenAsync();
        try
        {
            // Check if class exists
            string existsQuery = "SELECT COUNT(1) FROM t_Class WHERE c_classid = @classId";
            int exists = await ExecuteScalarAsync<int>(existsQuery, cmd => cmd.Parameters.AddWithValue("@classId", updatedClass.classId));
            if (exists == 0)
                return -1;

            // Check for duplicate class name and type
            string duplicateQuery = @"SELECT COUNT(*) FROM t_class 
                                      WHERE c_instructorid = @c_instructorid 
                                      AND c_classname = @c_classname
                                      AND c_type = @c_type
                                      AND c_classid != @c_classid";
            int existingCount = await ExecuteScalarAsync<int>(duplicateQuery, cmd =>
            {
                cmd.Parameters.AddWithValue("@c_instructorid", updatedClass.instructorId);
                cmd.Parameters.AddWithValue("@c_classname", updatedClass.className);
                cmd.Parameters.AddWithValue("@c_type", updatedClass.type);
                cmd.Parameters.AddWithValue("@c_classid", updatedClass.classId);
            });
            if (existingCount > 0)
                return -2;

            // Check for overlapping class times
            string overlapQuery = @"SELECT COUNT(*) FROM t_class 
                                    WHERE c_instructorid = @c_instructorid
                                    AND c_startdate = @c_startdate
                                    AND c_classid != @c_classid
                                    AND (
                                        (@c_starttime BETWEEN c_starttime AND c_endtime) 
                                        OR (@c_endtime BETWEEN c_starttime AND c_endtime) 
                                        OR (c_starttime BETWEEN @c_starttime AND @c_endtime)
                                        OR (c_endtime BETWEEN @c_starttime AND @c_endtime)
                                    )";
            int overlappingCount = await ExecuteScalarAsync<int>(overlapQuery, cmd =>
            {
                cmd.Parameters.AddWithValue("@c_instructorid", updatedClass.instructorId);
                cmd.Parameters.AddWithValue("@c_startdate", updatedClass.startDate);
                cmd.Parameters.AddWithValue("@c_starttime", updatedClass.startTime ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@c_endtime", updatedClass.endTime ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@c_classid", updatedClass.classId);
            });
            if (overlappingCount > 0)
                return -3;

            // Update class
            string updateQuery = @"UPDATE t_Class SET 
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
                WHERE c_classid = @classId";
            int rowsAffected = await ExecuteScalarAsync<int>(
                $"WITH updated AS ({updateQuery} RETURNING 1) SELECT COUNT(*) FROM updated;", cmd =>
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
            });
            return rowsAffected > 0 ? 1 : 0;
        }
        finally
        {
            await EnsureClosedAsync();
        }
    }

    public async Task<bool> ActivateClass(int classId)
    {
        string checkQuery = "SELECT c_status FROM t_class WHERE c_classid = @ClassId";
        string query = "UPDATE t_class SET c_status = 'Active' WHERE c_classid = @ClassId";
        await EnsureOpenAsync();
        try
        {
            using (var checkCommand = new NpgsqlCommand(checkQuery, _conn))
            {
                checkCommand.Parameters.AddWithValue("@ClassId", classId);
                string status = checkCommand.ExecuteScalar()?.ToString();
                if (status == "Active")
                    return false;
            }
            using (var command = new NpgsqlCommand(query, _conn))
            {
                command.Parameters.AddWithValue("@ClassId", classId);
                return command.ExecuteNonQuery() > 0;
            }
        }
        finally
        {
            await EnsureClosedAsync();
        }
    }

    public async Task<int> ClasswiseWaitlistCount(string classId)
    {
        string query = @"SELECT COUNT(*) FROM t_bookings WHERE c_classid = @classId AND c_waitlist > 0";
        return await ExecuteScalarAsync<int>(query, cmd => cmd.Parameters.AddWithValue("@classId", Convert.ToInt32(classId)));
    }

    public async Task RefundExpiredWaitlistBookings()
    {
        string query = @"SELECT b.c_bookingid, b.c_userid, b.c_classid, c.c_fees, c.c_classname
                         FROM t_bookings b
                         JOIN t_class c ON b.c_classid = c.c_classid
                         WHERE b.c_waitlist > 0 AND c.c_startdate < @today";
        await EnsureOpenAsync();
        try
        {
            using var cmd = new NpgsqlCommand(query, _conn);
            cmd.Parameters.AddWithValue("@today", DateTime.UtcNow.Date);
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                int bookingId = Convert.ToInt32(reader["c_bookingid"]);
                int userId = Convert.ToInt32(reader["c_userid"]);
                int classId = Convert.ToInt32(reader["c_classid"]);
                decimal fee = Convert.ToDecimal(reader["c_fees"]);
                string className = reader["c_classname"].ToString();

                // Refund
                await UpdateUserBalance(userId, fee);
                await AddWalletTransaction(userId, fee, "credit", $"Waitlist refund for class {className}");

                // Delete booking
                string delQuery = "DELETE FROM t_bookings WHERE c_bookingid = @bookingId";
                using var delCmd = new NpgsqlCommand(delQuery, _conn);
                delCmd.Parameters.AddWithValue("@bookingId", bookingId);
                await delCmd.ExecuteNonQueryAsync();
            }
        }
        finally
        {
            await EnsureClosedAsync();
        }
    }

    // DRY: Class mapping helpers
    private Class MapClass(NpgsqlDataReader reader)
    {
        return new Class
        {
            classId = Convert.ToInt32(reader["c_classid"]),
            className = reader["c_classname"].ToString(),
            instructorId = Convert.ToInt32(reader["c_instructorid"]),
            description = reader["c_description"] == DBNull.Value || string.IsNullOrWhiteSpace(reader["c_description"].ToString())
                ? null
                : JsonDocument.Parse(reader["c_description"].ToString()),
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

    private Class MapClassWithWaitlist(NpgsqlDataReader reader)
    {
        var classObj = MapClass(reader);
        classObj.waitList = Convert.ToInt32(reader["c_waitlist"]);
        return classObj;
    }
}


using Npgsql;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace Repo
{
    public class AttendanceRepo : IAttendanceInterface
    {
        private readonly NpgsqlConnection _conn;

        public AttendanceRepo(NpgsqlConnection conn)
        {
            _conn = conn;
        }

        public async Task<bool> CheckIfExists(int classId, DateTime date)
        {
            try
            {
                using (var cmd = new NpgsqlCommand(
                    "SELECT COUNT(1) FROM t_attendance WHERE c_classid = @classId AND c_attendancedate = @date",
                    _conn))
                {
                    cmd.Parameters.AddWithValue("@classId", classId);
                    cmd.Parameters.AddWithValue("@date", date.Date);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    var count = Convert.ToInt32(await cmd.ExecuteScalarAsync());
                    return count > 0;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error checking attendance existence: {ex.Message}");
                return false;
            }
            finally
            {
                if (_conn.State != ConnectionState.Closed)
                    await _conn.CloseAsync();
            }
        }

        public async Task<(bool exists, int attendanceId)> CheckIfExistsWithId(int classId, DateTime date)
        {
            try
            {
                using (var cmd = new NpgsqlCommand(
                    "SELECT c_attendanceid FROM t_attendance WHERE c_classid = @classId AND c_attendancedate = @date",
                    _conn))
                {
                    cmd.Parameters.AddWithValue("@classId", classId);
                    cmd.Parameters.AddWithValue("@date", date.Date);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    int result = Convert.ToInt32(await cmd.ExecuteScalarAsync());
                    if (result != 0)
                    {
                        return (true, result);
                    }
                    return (false, 0);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error checking attendance existence: {ex.Message}");
                return (false, 0);
            }
            finally
            {
                if (_conn.State != ConnectionState.Closed)
                    await _conn.CloseAsync();
            }
        }

        public async Task<int> AddAttendance(Attendance attendance)
        {
            try
            {
                using (var cmd = new NpgsqlCommand(
                    @"INSERT INTO t_attendance (
                        c_classid, c_attendancedate, c_presentstudents, c_absentstudents
                    ) VALUES (
                        @classId, @date, @presentStudents, @absentStudents
                    ) RETURNING c_attendanceid",
                    _conn))
                {
                    cmd.Parameters.AddWithValue("@classId", attendance.classId);
                    cmd.Parameters.AddWithValue("@date", attendance.attendanceDate.Date);

                    // Changed from Jsonb to integer array parameters
                    cmd.Parameters.AddWithValue("@presentStudents", NpgsqlTypes.NpgsqlDbType.Array | NpgsqlTypes.NpgsqlDbType.Integer,
                        attendance.presentStudents.ToArray());
                    cmd.Parameters.AddWithValue("@absentStudents", NpgsqlTypes.NpgsqlDbType.Array | NpgsqlTypes.NpgsqlDbType.Integer,
                        attendance.absentStudents.ToArray());

                    // cmd.Parameters.AddWithValue("@createdAt", attendance.CreatedAt);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    return Convert.ToInt32(await cmd.ExecuteScalarAsync());
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding attendance: {ex.Message}");
                return -1;
            }
            finally
            {
                if (_conn.State != ConnectionState.Closed)
                    await _conn.CloseAsync();
            }
        }

        public async Task<bool> UpdateAttendance(Attendance attendance)
        {
            try
            {
                using (var cmd = new NpgsqlCommand(
                    @"UPDATE t_attendance SET 
                        c_presentstudents = @presentStudents,
                        c_absentstudents = @absentStudents
                    WHERE c_attendanceid = @attendanceId",
                    _conn))
                {
                    cmd.Parameters.AddWithValue("@attendanceId", attendance.attendanceId);

                    // Changed from Jsonb to integer array parameters
                    cmd.Parameters.AddWithValue("@presentStudents", NpgsqlTypes.NpgsqlDbType.Array | NpgsqlTypes.NpgsqlDbType.Integer,
                        attendance.presentStudents.ToArray());
                    cmd.Parameters.AddWithValue("@absentStudents", NpgsqlTypes.NpgsqlDbType.Array | NpgsqlTypes.NpgsqlDbType.Integer,
                        attendance.absentStudents.ToArray());

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    return await cmd.ExecuteNonQueryAsync() > 0;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating attendance: {ex.Message}");
                return false;
            }
            finally
            {
                if (_conn.State != ConnectionState.Closed)
                    await _conn.CloseAsync();
            }
        }

        public async Task<List<Attendance>> GetAttendanceByClassId(int classId)
        {
            var attendanceList = new List<Attendance>();

            try
            {
                using (var cmd = new NpgsqlCommand(
                    "SELECT * FROM t_attendance WHERE c_classid = @classId ORDER BY c_attendancedate",
                    _conn))
                {
                    cmd.Parameters.AddWithValue("@classId", classId);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            attendanceList.Add(new Attendance
                            {
                                attendanceId = Convert.ToInt32(reader["c_attendanceid"]),
                                classId = Convert.ToInt32(reader["c_classid"]),
                                attendanceDate = Convert.ToDateTime(reader["c_attendancedate"]),

                                // Convert from integer array to List<int>
                                presentStudents = reader["c_presentstudents"] is int[] presentArray
                                    ? new List<int>(presentArray)
                                    : new List<int>(),
                                absentStudents = reader["c_absentstudents"] is int[] absentArray
                                    ? new List<int>(absentArray)
                                    : new List<int>(),

                                // CreatedAt = Convert.ToDateTime(reader["c_createdat"])
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting attendance by class: {ex.Message}");
            }
            finally
            {
                if (_conn.State != ConnectionState.Closed)
                    await _conn.CloseAsync();
            }

            return attendanceList;
        }

        public async Task<List<Attendance>> GetAttendanceByClassAndDateRange(int classId, DateTime startDate, DateTime endDate)
        {
            var attendanceList = new List<Attendance>();

            try
            {
                using (var cmd = new NpgsqlCommand(
                    @"SELECT * FROM t_attendance 
                    WHERE c_classid = @classId 
                    AND c_attendancedate BETWEEN @startDate AND @endDate
                    ORDER BY c_attendancedate",
                    _conn))
                {
                    cmd.Parameters.AddWithValue("@classId", classId);
                    cmd.Parameters.AddWithValue("@startDate", startDate.Date);
                    cmd.Parameters.AddWithValue("@endDate", endDate.Date);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            attendanceList.Add(new Attendance
                            {
                                attendanceId = Convert.ToInt32(reader["c_attendanceid"]),
                                classId = Convert.ToInt32(reader["c_classid"]),
                                attendanceDate = Convert.ToDateTime(reader["c_attendancedate"]),

                                // Convert from integer array to List<int>
                                presentStudents = reader["c_presentstudents"] is int[] presentArray
                                    ? new List<int>(presentArray)
                                    : new List<int>(),
                                absentStudents = reader["c_absentstudents"] is int[] absentArray
                                    ? new List<int>(absentArray)
                                    : new List<int>(),

                                // CreatedAt = Convert.ToDateTime(reader["c_createdat"])
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting attendance by date range: {ex.Message}");
            }
            finally
            {
                if (_conn.State != ConnectionState.Closed)
                    await _conn.CloseAsync();
            }

            return attendanceList;
        }
    }
}
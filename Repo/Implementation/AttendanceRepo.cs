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

        // DRY: Centralized method for executing a command with parameters and returning a scalar
        private async Task<T> ExecuteScalarAsync<T>(string query, Action<NpgsqlCommand> paramSetter)
        {
            if (_conn.State != ConnectionState.Open)
                await _conn.OpenAsync();

            try
            {
                using var cmd = new NpgsqlCommand(query, _conn);
                paramSetter(cmd);
                var result = await cmd.ExecuteScalarAsync();
                return (result == null || result is DBNull) ? default : (T)Convert.ChangeType(result, typeof(T));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error (scalar): {ex.Message}");
                return default;
            }
            finally
            {
                if (_conn.State != ConnectionState.Closed)
                    await _conn.CloseAsync();
            }
        }

        // DRY: Centralized method for executing a command with parameters and returning a reader
        private async Task<List<T>> ExecuteReaderAsync<T>(string query, Action<NpgsqlCommand> paramSetter, Func<NpgsqlDataReader, T> map)
        {
            var resultList = new List<T>();
            if (_conn.State != ConnectionState.Open)
                await _conn.OpenAsync();

            try
            {
                using var cmd = new NpgsqlCommand(query, _conn);
                paramSetter(cmd);
                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    resultList.Add(map(reader));
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error (reader): {ex.Message}");
            }
            finally
            {
                if (_conn.State != ConnectionState.Closed)
                    await _conn.CloseAsync();
            }
            return resultList;
        }

        public async Task<bool> CheckIfExists(int classId, DateTime date)
        {
            string query = "SELECT COUNT(1) FROM t_attendance WHERE c_classid = @classId AND c_attendancedate = @date";
            int count = await ExecuteScalarAsync<int>(query, cmd =>
            {
                cmd.Parameters.AddWithValue("@classId", classId);
                cmd.Parameters.AddWithValue("@date", date.Date);
            });
            return count > 0;
        }

        public async Task<(bool exists, int attendanceId)> CheckIfExistsWithId(int classId, DateTime date)
        {
            string query = "SELECT c_attendanceid FROM t_attendance WHERE c_classid = @classId AND c_attendancedate = @date";
            int attendanceId = await ExecuteScalarAsync<int>(query, cmd =>
            {
                cmd.Parameters.AddWithValue("@classId", classId);
                cmd.Parameters.AddWithValue("@date", date.Date);
            });
            return (attendanceId != 0, attendanceId);
        }

        public async Task<int> AddAttendance(Attendance attendance)
        {
            string query = @"INSERT INTO t_attendance (
                        c_classid, c_attendancedate, c_presentstudents, c_absentstudents
                    ) VALUES (
                        @classId, @date, @presentStudents, @absentStudents
                    ) RETURNING c_attendanceid";
            return await ExecuteScalarAsync<int>(query, cmd =>
            {
                cmd.Parameters.AddWithValue("@classId", attendance.classId);
                cmd.Parameters.AddWithValue("@date", attendance.attendanceDate.Date);
                cmd.Parameters.AddWithValue("@presentStudents", NpgsqlTypes.NpgsqlDbType.Array | NpgsqlTypes.NpgsqlDbType.Integer, attendance.presentStudents.ToArray());
                cmd.Parameters.AddWithValue("@absentStudents", NpgsqlTypes.NpgsqlDbType.Array | NpgsqlTypes.NpgsqlDbType.Integer, attendance.absentStudents.ToArray());
            });
        }

        public async Task<bool> UpdateAttendance(Attendance attendance)
        {
            string query = @"UPDATE t_attendance SET 
                        c_presentstudents = @presentStudents,
                        c_absentstudents = @absentStudents
                    WHERE c_attendanceid = @attendanceId";
            int rows = await ExecuteScalarAsync<int>(@$"
                WITH updated AS (
                    {query}
                    RETURNING 1
                )
                SELECT COUNT(*) FROM updated;", cmd =>
            {
                cmd.Parameters.AddWithValue("@attendanceId", attendance.attendanceId);
                cmd.Parameters.AddWithValue("@presentStudents", NpgsqlTypes.NpgsqlDbType.Array | NpgsqlTypes.NpgsqlDbType.Integer, attendance.presentStudents.ToArray());
                cmd.Parameters.AddWithValue("@absentStudents", NpgsqlTypes.NpgsqlDbType.Array | NpgsqlTypes.NpgsqlDbType.Integer, attendance.absentStudents.ToArray());
            });
            return rows > 0;
        }

        public async Task<List<Attendance>> GetAttendanceByClassId(int classId)
        {
            string query = "SELECT * FROM t_attendance WHERE c_classid = @classId ORDER BY c_attendancedate";
            return await ExecuteReaderAsync(query, cmd =>
            {
                cmd.Parameters.AddWithValue("@classId", classId);
            }, reader => new Attendance
            {
                attendanceId = Convert.ToInt32(reader["c_attendanceid"]),
                classId = Convert.ToInt32(reader["c_classid"]),
                attendanceDate = Convert.ToDateTime(reader["c_attendancedate"]),
                presentStudents = reader["c_presentstudents"] is int[] presentArray ? new List<int>(presentArray) : new List<int>(),
                absentStudents = reader["c_absentstudents"] is int[] absentArray ? new List<int>(absentArray) : new List<int>(),
            });
        }

        public async Task<List<Attendance>> GetAttendanceByClassAndDateRange(int classId, DateTime startDate, DateTime endDate)
        {
            string query = @"SELECT * FROM t_attendance 
                    WHERE c_classid = @classId 
                    AND c_attendancedate BETWEEN @startDate AND @endDate
                    ORDER BY c_attendancedate";
            return await ExecuteReaderAsync(query, cmd =>
            {
                cmd.Parameters.AddWithValue("@classId", classId);
                cmd.Parameters.AddWithValue("@startDate", startDate.Date);
                cmd.Parameters.AddWithValue("@endDate", endDate.Date);
            }, reader => new Attendance
            {
                attendanceId = Convert.ToInt32(reader["c_attendanceid"]),
                classId = Convert.ToInt32(reader["c_classid"]),
                attendanceDate = Convert.ToDateTime(reader["c_attendancedate"]),
                presentStudents = reader["c_presentstudents"] is int[] presentArray ? new List<int>(presentArray) : new List<int>(),
                absentStudents = reader["c_absentstudents"] is int[] absentArray ? new List<int>(absentArray) : new List<int>(),
            });
        }
    }
}
using Npgsql;
using System;
using System.Collections.Generic;

namespace Repo
{
    public class FeedbackRepository : IFeedbackInterface
    {
        private readonly NpgsqlConnection _conn;

        public FeedbackRepository(NpgsqlConnection conn)
        {
            _conn = conn;
        }

        // DRY: Centralized connection open/close helpers
        private void EnsureOpen()
        {
            if (_conn.State != System.Data.ConnectionState.Open)
                _conn.Open();
        }
        private void EnsureClosed()
        {
            if (_conn.State != System.Data.ConnectionState.Closed)
                _conn.Close();
        }

        // DRY: Centralized method for executing a reader and mapping results
        private List<T> ExecuteReader<T>(string query, Action<NpgsqlCommand> paramSetter, Func<NpgsqlDataReader, T> map)
        {
            var result = new List<T>();
            try
            {
                EnsureOpen();
                using var cmd = new NpgsqlCommand(query, _conn);
                paramSetter?.Invoke(cmd);
                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    result.Add(map(reader));
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Database error: {ex.Message}");
                return null;
            }
            finally
            {
                EnsureClosed();
            }
            return result;
        }

        // DRY: Centralized method for executing a scalar query
        private T ExecuteScalar<T>(string query, Action<NpgsqlCommand> paramSetter)
        {
            try
            {
                EnsureOpen();
                using var cmd = new NpgsqlCommand(query, _conn);
                paramSetter?.Invoke(cmd);
                var result = cmd.ExecuteScalar();
                return (result == null || result is DBNull) ? default : (T)Convert.ChangeType(result, typeof(T));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Database error: {ex.Message}");
                return default;
            }
            finally
            {
                EnsureClosed();
            }
        }

        public bool AddInstructorFeedback(InstructorFeedback feedback)
        {
            const string query = @"INSERT INTO t_feedback_instructor 
                              (c_userid, c_instructorid, c_rating, c_feedback, c_createdat) 
                              VALUES (@userId, @instructorId, @rating, @feedback, @createdAt)";
            try
            {
                EnsureOpen();
                using var cmd = new NpgsqlCommand(query, _conn);
                cmd.Parameters.AddWithValue("@userId", feedback.userId);
                cmd.Parameters.AddWithValue("@instructorId", feedback.instructorId);
                cmd.Parameters.AddWithValue("@rating", feedback.rating);
                cmd.Parameters.AddWithValue("@feedback", feedback.feedback);
                cmd.Parameters.AddWithValue("@createdAt", feedback.createdAt);
                return cmd.ExecuteNonQuery() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding instructor feedback: {ex.Message}");
                return false;
            }
            finally
            {
                EnsureClosed();
            }
        }

        public List<InstructorFeedback> GetInstructorFeedbacksByInstructorId(int instructorId)
        {
            const string query = @"
                SELECT 
                    f.c_feedbackid,
                    f.c_userid,
                    f.c_instructorid,
                    f.c_feedback,
                    f.c_rating,
                    f.c_createdat,
                    u.c_username AS user_name,
                    i.c_instructorname AS instructor_name
                FROM t_feedback_instructor f
                JOIN t_user u ON f.c_userid = u.c_userid
                JOIN t_instructor i ON f.c_instructorid = i.c_instructorid
                WHERE f.c_instructorid = @instructorId
                ORDER BY f.c_createdat DESC";
            return ExecuteReader(query, cmd => cmd.Parameters.AddWithValue("@instructorId", instructorId), reader =>
            {
                return new InstructorFeedback
                {
                    feedbackId = Convert.ToInt32(reader["c_feedbackid"]),
                    userId = Convert.ToInt32(reader["c_userid"]),
                    instructorId = Convert.ToInt32(reader["c_instructorid"]),
                    rating = Convert.ToInt32(reader["c_rating"]),
                    feedback = reader["c_feedback"]?.ToString(),
                    createdAt = Convert.ToDateTime(reader["c_createdat"]),
                    userName = reader["user_name"]?.ToString(),
                    instructorName = reader["instructor_name"]?.ToString()
                };
            });
        }

        public int AddClassFeedback(ClassFeedback feedback)
        {
            try
            {
                EnsureOpen();

                // Check if the user already submitted feedback for this class
                const string checkQuery = @"SELECT COUNT(*) FROM t_feedback_class 
                                  WHERE c_userid = @userId AND c_classid = @classId";
                int existingFeedbacks = ExecuteScalar<int>(checkQuery, cmd =>
                {
                    cmd.Parameters.AddWithValue("@userId", feedback.userId);
                    cmd.Parameters.AddWithValue("@classId", feedback.classId);
                });
                if (existingFeedbacks > 0)
                    return -1; // Already submitted

                // Insert the new feedback
                const string insertQuery = @"INSERT INTO t_feedback_class 
                              (c_userid, c_classid, c_rating, c_feedback, c_createdat) 
                              VALUES (@userId, @classId, @rating, @feedback, @createdAt)
                              RETURNING c_feedbackid";
                return ExecuteScalar<int>(insertQuery, cmd =>
                {
                    cmd.Parameters.AddWithValue("@userId", feedback.userId);
                    cmd.Parameters.AddWithValue("@classId", feedback.classId);
                    cmd.Parameters.AddWithValue("@rating", feedback.rating);
                    cmd.Parameters.AddWithValue("@feedback", feedback.feedback);
                    cmd.Parameters.AddWithValue("@createdAt", feedback.createdAt);
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding class feedback: {ex.Message}");
                return 0;
            }
            finally
            {
                EnsureClosed();
            }
        }

        public List<ClassFeedback> GetClassFeedbacksByClassId(int classId)
        {
            const string query = @"
                SELECT 
                    f.c_feedbackid,
                    f.c_userid,
                    f.c_classid,
                    f.c_feedback,
                    f.c_rating,
                    f.c_createdat,
                    u.c_username AS user_name,
                    c.c_classname AS class_name,
                    i.c_instructorname AS instructor_name
                FROM t_feedback_class f
                JOIN t_user u ON f.c_userid = u.c_userid
                JOIN t_class c ON f.c_classid = c.c_classid
                JOIN t_instructor i ON c.c_instructorid = i.c_instructorid
                WHERE f.c_classid = @classId
                ORDER BY f.c_createdat DESC";
            return ExecuteReader(query, cmd => cmd.Parameters.AddWithValue("@classId", classId), reader =>
            {
                return new ClassFeedback
                {
                    feedbackId = Convert.ToInt32(reader["c_feedbackid"]),
                    userId = Convert.ToInt32(reader["c_userid"]),
                    classId = Convert.ToInt32(reader["c_classid"]),
                    rating = Convert.ToInt32(reader["c_rating"]),
                    feedback = reader["c_feedback"]?.ToString(),
                    createdAt = Convert.ToDateTime(reader["c_createdat"]),
                    userName = reader["user_name"]?.ToString(),
                    className = reader["class_name"]?.ToString(),
                    instructorName = reader["instructor_name"]?.ToString()
                };
            });
        }

        public bool HasUserJoinedClass(int userId, int classId)
        {
            const string query = @"
                SELECT COUNT(*) 
                FROM t_bookings 
                WHERE c_userid = @userId 
                AND c_classid = @classId";
            try
            {
                int count = ExecuteScalar<int>(query, cmd =>
                {
                    cmd.Parameters.AddWithValue("@userId", userId);
                    cmd.Parameters.AddWithValue("@classId", classId);
                });
                return count > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error checking user class registration: {ex.Message}");
                return false;
            }
        }

        public List<ClassFeedback> GetClassFeedbacksByInstructorId(int instructorId)
        {
            const string query = @"
                SELECT 
                    f.c_feedbackid,
                    f.c_userid,
                    f.c_classid,
                    f.c_feedback,
                    f.c_rating,
                    f.c_createdat,
                    u.c_username AS user_name,
                    c.c_classname AS class_name,
                    i.c_instructorname AS instructor_name
                FROM t_feedback_class f
                JOIN t_user u ON f.c_userid = u.c_userid
                JOIN t_class c ON f.c_classid = c.c_classid
                JOIN t_instructor i ON c.c_instructorid = i.c_instructorid
                WHERE c.c_instructorid = @instructorId
                ORDER BY f.c_createdat DESC";
            return ExecuteReader(query, cmd => cmd.Parameters.AddWithValue("@instructorId", instructorId), reader =>
            {
                return new ClassFeedback
                {
                    feedbackId = Convert.ToInt32(reader["c_feedbackid"]),
                    userId = Convert.ToInt32(reader["c_userid"]),
                    classId = Convert.ToInt32(reader["c_classid"]),
                    rating = Convert.ToInt32(reader["c_rating"]),
                    feedback = reader["c_feedback"]?.ToString(),
                    createdAt = Convert.ToDateTime(reader["c_createdat"]),
                    userName = reader["user_name"]?.ToString(),
                    className = reader["class_name"]?.ToString(),
                    instructorName = reader["instructor_name"]?.ToString()
                };
            });
        }
    }
}

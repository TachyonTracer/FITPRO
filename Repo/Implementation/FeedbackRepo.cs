using Npgsql;

namespace Repo
{
    public class FeedbackRepository : IFeedbackInterface
    {
        private readonly NpgsqlConnection _conn;

        public FeedbackRepository(NpgsqlConnection conn)
        {
            _conn = conn;
        }

        public bool AddInstructorFeedback(InstructorFeedback feedback)
        {
            try
            {
                _conn.Open();
                var query = @"INSERT INTO t_feedback_instructor 
                              (c_userid, c_instructorid, c_rating, c_feedback, c_createdat) 
                              VALUES (@userId, @instructorId, @rating, @feedback, @createdAt)";
                using var cmd = new NpgsqlCommand(query, _conn);
                cmd.Parameters.AddWithValue("@userId", feedback.userId);
                cmd.Parameters.AddWithValue("@instructorId", feedback.instructorId);
                cmd.Parameters.AddWithValue("@rating", feedback.rating);
                cmd.Parameters.AddWithValue("@feedback", feedback.feedback);
                cmd.Parameters.AddWithValue("@createdAt", feedback.createdAt);

                return cmd.ExecuteNonQuery() > 0;
            }
            finally
            {
                _conn.Close();
            }
        }

        public List<InstructorFeedback> GetInstructorFeedbacksByInstructorId(int instructorId)
        {
            var feedbacks = new List<InstructorFeedback>();

            try
            {
                _conn.Open();
                var query = @"
                    SELECT 
                        f.c_feedbackid,
                        f.c_userid,
                        f.c_instructorid,
                        f.c_feedback,
                        f.c_rating,
                        f.c_createdat,
                        u.c_username AS user_name,          -- Changed username to c_username
                        i.c_instructorname AS instructor_name
                    FROM t_feedback_instructor f
                    JOIN t_user u ON f.c_userid = u.c_userid
                    JOIN t_instructor i ON f.c_instructorid = i.c_instructorid
                    WHERE f.c_instructorid = @instructorId
                    ORDER BY f.c_createdat DESC";

                using var cmd = new NpgsqlCommand(query, _conn);
                cmd.Parameters.AddWithValue("@instructorId", instructorId);

                // Add debug logging
                Console.WriteLine($"Fetching feedbacks for instructor ID: {instructorId}");

                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    try
                    {
                        var feedback = new InstructorFeedback
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
                        feedbacks.Add(feedback);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error parsing feedback: {ex.Message}");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Database error: {ex.Message}");
                return null;
            }
            finally
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                    _conn.Close();
            }

            return feedbacks;
        }

        public bool AddClassFeedback(ClassFeedback feedback)
        {
            try
            {
                _conn.Open();
                var query = @"INSERT INTO t_feedback_class 
                              (c_userid, c_classid, c_rating, c_feedback, c_createdat) 
                              VALUES (@userId, @classId, @rating, @feedback, @createdAt)";
                using var cmd = new NpgsqlCommand(query, _conn);
                cmd.Parameters.AddWithValue("@userId", feedback.userId);
                cmd.Parameters.AddWithValue("@classId", feedback.classId);
                cmd.Parameters.AddWithValue("@rating", feedback.rating);
                cmd.Parameters.AddWithValue("@feedback", feedback.feedback);
                cmd.Parameters.AddWithValue("@createdAt", feedback.createdAt);

                return cmd.ExecuteNonQuery() > 0;
            }
            finally
            {
                _conn.Close();
            }
        }

        public List<ClassFeedback> GetClassFeedbacksByClassId(int classId)
        {
            var feedbacks = new List<ClassFeedback>();

            try
            {
                _conn.Open();
                // Updated query with correct table names and column names
                var query = @"
                    SELECT 
                        f.c_feedbackid,
                        f.c_userid,
                        f.c_classid,
                        f.c_feedback,
                        f.c_rating,
                        f.c_createdat,
                        u.c_username AS user_name,          -- Changed username to c_username
                        c.c_classname AS class_name,
                        i.c_instructorname AS instructor_name
                    FROM t_feedback_class f
                    JOIN t_user u ON f.c_userid = u.c_userid
                    JOIN t_class c ON f.c_classid = c.c_classid
                    JOIN t_instructor i ON c.c_instructorid = i.c_instructorid
                    WHERE f.c_classid = @classId
                    ORDER BY f.c_createdat DESC";

                using var cmd = new NpgsqlCommand(query, _conn);
                cmd.Parameters.AddWithValue("@classId", classId);

                // Add debug logging
                Console.WriteLine($"Fetching feedbacks for class ID: {classId}");

                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    try
                    {
                        var feedback = new ClassFeedback
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
                        feedbacks.Add(feedback);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error parsing feedback: {ex.Message}");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Database error: {ex.Message}");
                return null;
            }
            finally
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                    _conn.Close();
            }

            return feedbacks;
        }

        public bool HasUserJoinedClass(int userId, int classId)
        {
            try
            {
                _conn.Open();
                // Updated query to check t_bookings table
                var query = @"
                    SELECT COUNT(*) 
                    FROM t_bookings 
                    WHERE c_userid = @userId 
                    AND c_classid = @classId";

                using var cmd = new NpgsqlCommand(query, _conn);
                cmd.Parameters.AddWithValue("@userId", userId);
                cmd.Parameters.AddWithValue("@classId", classId);

                var count = Convert.ToInt32(cmd.ExecuteScalar());
                return count > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error checking user class registration: {ex.Message}");
                return false;
            }
            finally
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                    _conn.Close();
            }
        }

        public List<ClassFeedback> GetClassFeedbacksByInstructorId(int instructorId)
        {
            var feedbacks = new List<ClassFeedback>();

            try
            {
                _conn.Open();
                var query = @"
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

                using var cmd = new NpgsqlCommand(query, _conn);
                cmd.Parameters.AddWithValue("@instructorId", instructorId);

                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    var feedback = new ClassFeedback
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
                    feedbacks.Add(feedback);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Database error: {ex.Message}");
                return null;
            }
            finally
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                    _conn.Close();
            }

            return feedbacks;
        }

    }
}

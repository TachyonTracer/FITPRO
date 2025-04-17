using System.Data;
using System.Text.Json;
using Npgsql;
namespace Repo;


public class BlogRepo : IBlogInterface
{
    private readonly NpgsqlConnection _conn;
    private readonly IEmailInterface _email;

    #region Constructor
    public BlogRepo(NpgsqlConnection conn, IEmailInterface email)
    {
        _conn = conn;
        _email = email;
    }
    #endregion

 
    #region Blog

        #region SaveBlogDraft
        public async Task<int> SaveBlogDraft(BlogPost blogpost)
        {
            if (_conn.State == System.Data.ConnectionState.Closed)
            {
                await _conn.OpenAsync();
            }


            string query = @"INSERT INTO t_blogpost 
                                    (c_blog_author_id, c_tags, c_title, c_desc, 
                                    c_content, c_thumbnail, c_created_at, c_published_at,
                                    c_is_published, c_source_url) 
                                VALUES 
                                    (@c_blog_author_id, @c_tags, @c_title, @c_desc,
                                    @c_content, @c_thumbnail, @c_created_at, @c_published_at,
                                    @c_is_published, @c_source_url)
                                RETURNING c_blog_id;";

            try
            {

                using (var command = new NpgsqlCommand(query, _conn))
                {
                    command.Parameters.AddWithValue("@c_blog_author_id", blogpost.c_blog_author_id);
                    command.Parameters.AddWithValue("@c_tags", blogpost.c_tags ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@c_title", blogpost.c_title);
                    command.Parameters.AddWithValue("@c_desc", blogpost.c_desc ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@c_content", blogpost.c_content ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@c_thumbnail", blogpost.c_thumbnail ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@c_created_at", DateTimeOffset.UtcNow.ToUnixTimeSeconds());
                    command.Parameters.AddWithValue("@c_published_at", 1);
                    command.Parameters.AddWithValue("@c_is_published", false);
                    command.Parameters.AddWithValue("@c_source_url", blogpost.c_source_url ?? (object)DBNull.Value);

                    object result = await command.ExecuteScalarAsync();
                    return result != null ? Convert.ToInt32(result) : 0;
                }
            }
            catch (Exception ex)
            {
                System.Console.WriteLine("Error at save draft-->" + ex.Message);
                return 0;
            }
            finally
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                {
                    await _conn.CloseAsync();
                }
            }
        }
        #endregion


        #region UpdateBlogDraft
        public async Task<bool> UpdateBlogDraft(BlogPost blogpost)
        {
            string query = @"UPDATE t_blogpost SET
                                    c_tags = @c_tags,
                                    c_title = @c_title,
                                    c_desc = @c_desc,
                                    c_content = @c_content,
                                    c_thumbnail = @c_thumbnail
                                        WHERE c_blog_id = @c_blog_id";

            try
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();

                await _conn.OpenAsync();

                using (var command = new NpgsqlCommand(query, _conn))
                {
                    command.Parameters.AddWithValue("@c_blog_id", blogpost.c_blog_id);
                    command.Parameters.AddWithValue("@c_tags", blogpost.c_tags ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@c_title", blogpost.c_title);
                    command.Parameters.AddWithValue("@c_desc", blogpost.c_desc ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@c_content", blogpost.c_content ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@c_thumbnail", blogpost.c_thumbnail ?? (object)DBNull.Value);

                    int rowsAffected = await command.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
            }
            catch (Exception ex)
            {
                System.Console.WriteLine("Error at update draft-->" + ex.Message);
                return false;
            }
            finally
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }
        #endregion

        #region PublishBlog
        public async Task<bool> PublishBlog(BlogPost blogpost)
        {
            string query = @"UPDATE t_blogpost SET
                                            c_tags = @c_tags,
                                            c_title = @c_title,
                                            c_desc = @c_desc,
                                            c_content = @c_content,
                                            c_thumbnail = @c_thumbnail,
                                            c_published_at = @c_published_at,
                                            c_is_published = @c_is_published
                                        WHERE c_blog_id = @c_blog_id";

            try
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();

                await _conn.OpenAsync();

                using (var command = new NpgsqlCommand(query, _conn))
                {
                    command.Parameters.AddWithValue("@c_blog_id", blogpost.c_blog_id);
                    command.Parameters.AddWithValue("@c_tags", blogpost.c_tags ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@c_title", blogpost.c_title);
                    command.Parameters.AddWithValue("@c_desc", blogpost.c_desc ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@c_content", blogpost.c_content ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@c_thumbnail", blogpost.c_thumbnail ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@c_published_at", DateTimeOffset.UtcNow.ToUnixTimeSeconds());
                    command.Parameters.AddWithValue("@c_is_published", true);

                    int rowsAffected = await command.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
            }
            catch (Exception ex)
            {
                System.Console.WriteLine("Error at publish blog-->" + ex.Message);
                return false;
            }
            finally
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }
        #endregion

        #region GetBlogsByInstructorId
        public async Task<List<BlogPost>> GetBlogsByInstructorId(int instructor_id)
        {

            var blogList = new List<BlogPost>();

            try
            {

                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();

                string query = @"SELECT * FROM t_blogpost
                                    WHERE c_blog_author_id = @c_blog_author_id";

                using (var cmd = new NpgsqlCommand(query, _conn))
                {
                    cmd.Parameters.AddWithValue("@c_blog_author_id", Convert.ToInt32(instructor_id));
                    await _conn.OpenAsync();
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            BlogPost blog = new BlogPost
                            {
                                c_blog_id = reader.GetInt32(reader.GetOrdinal("c_blog_id")),
                                c_blog_author_id = reader.GetInt32(reader.GetOrdinal("c_blog_author_id")),
                                c_tags = reader.GetString(reader.GetOrdinal("c_tags")),
                                c_title = reader.GetString(reader.GetOrdinal("c_title")),
                                c_desc = reader.GetString(reader.GetOrdinal("c_desc")),
                                c_content = reader.GetString(reader.GetOrdinal("c_content")),
                                c_thumbnail = reader.GetString(reader.GetOrdinal("c_thumbnail")),
                                c_source_url = reader.GetString(reader.GetOrdinal("c_source_url")),
                                c_views = reader.GetInt32(reader.GetOrdinal("c_views")),
                                c_likes = reader.GetInt32(reader.GetOrdinal("c_likes")),
                                c_comments = reader.GetInt32(reader.GetOrdinal("c_comments")),
                                c_created_at = reader.GetInt32(reader.GetOrdinal("c_created_at")),
                                c_published_at = reader.GetInt32(reader.GetOrdinal("c_published_at")),
                                c_is_published = reader.GetBoolean(reader.GetOrdinal("c_is_published")),
                            };
                            blogList.Add(blog);
                        }
                    }
                }
                await _conn.CloseAsync();
                return blogList;
            }

            catch (Exception ex)
            {
                System.Console.WriteLine("Exception at GetBlogsByInstructor-->" + ex.Message);
                return blogList;
            }

            finally
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }
        #endregion


        #region GetBlogsForUser
        public async Task<List<BlogPost>> GetBlogsForUser()
        {

            var blogList = new List<BlogPost>();

            try
            {

                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();

                string query = @"SELECT * FROM t_blogpost
                                    WHERE c_is_published = true";

                using (var cmd = new NpgsqlCommand(query, _conn))
                {
                    // cmd.Parameters.AddWithValue("@c_blog_author_id", Convert.ToInt32(instructor_id));
                    await _conn.OpenAsync();
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            BlogPost blog = new BlogPost
                            {
                                c_blog_id = reader.GetInt32(reader.GetOrdinal("c_blog_id")),
                                c_blog_author_id = reader.GetInt32(reader.GetOrdinal("c_blog_author_id")),
                                c_tags = reader.GetString(reader.GetOrdinal("c_tags")),
                                c_title = reader.GetString(reader.GetOrdinal("c_title")),
                                c_desc = reader.GetString(reader.GetOrdinal("c_desc")),
                                c_content = reader.GetString(reader.GetOrdinal("c_content")),
                                c_thumbnail = reader.GetString(reader.GetOrdinal("c_thumbnail")),
                                c_source_url = reader.GetString(reader.GetOrdinal("c_source_url")),
                                c_views = reader.GetInt32(reader.GetOrdinal("c_views")),
                                c_likes = reader.GetInt32(reader.GetOrdinal("c_likes")),
                                c_comments = reader.GetInt32(reader.GetOrdinal("c_comments")),
                                c_created_at = reader.GetInt32(reader.GetOrdinal("c_created_at")),
                                c_published_at = reader.GetInt32(reader.GetOrdinal("c_published_at")),
                                c_is_published = reader.GetBoolean(reader.GetOrdinal("c_is_published")),
                            };
                            blogList.Add(blog);
                        }
                    }
                }
                await _conn.CloseAsync();
                return blogList;
            }

            catch (Exception ex)
            {
                System.Console.WriteLine("Exception at GetBlogsForUser-->" + ex.Message);
                return blogList;
            }

            finally
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }
        #endregion


        #region GetBlogById
        public async Task<BlogPost> GetBlogById(int blog_id)
        {

            var blog = new BlogPost();

            try
            {

                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();

                string query = @"SELECT * FROM t_blogpost
                                    WHERE c_blog_id = @c_blog_id";

                using (var cmd = new NpgsqlCommand(query, _conn))
                {
                    cmd.Parameters.AddWithValue("@c_blog_id", Convert.ToInt32(blog_id));
                    await _conn.OpenAsync();
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            BlogPost blog_ = new BlogPost
                            {
                                c_blog_id = reader.GetInt32(reader.GetOrdinal("c_blog_id")),
                                c_blog_author_id = reader.GetInt32(reader.GetOrdinal("c_blog_author_id")),
                                c_tags = reader.GetString(reader.GetOrdinal("c_tags")),
                                c_title = reader.GetString(reader.GetOrdinal("c_title")),
                                c_desc = reader.GetString(reader.GetOrdinal("c_desc")),
                                c_content = reader.GetString(reader.GetOrdinal("c_content")),
                                c_thumbnail = reader.GetString(reader.GetOrdinal("c_thumbnail")),
                                c_source_url = reader.GetString(reader.GetOrdinal("c_source_url")),
                                c_views = reader.GetInt32(reader.GetOrdinal("c_views")),
                                c_likes = reader.GetInt32(reader.GetOrdinal("c_likes")),
                                c_comments = reader.GetInt32(reader.GetOrdinal("c_comments")),
                                c_created_at = reader.GetInt32(reader.GetOrdinal("c_created_at")),
                                c_published_at = reader.GetInt32(reader.GetOrdinal("c_published_at")),
                                c_is_published = reader.GetBoolean(reader.GetOrdinal("c_is_published")),
                            };
                            blog = blog_;
                        }
                    }
                }
                await _conn.CloseAsync();
                return blog;
            }

            catch (Exception ex)
            {
                System.Console.WriteLine("Exception at GetBlogsByInstructor-->" + ex.Message);
                return blog;
            }

            finally
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }
        #endregion

        #region Delete Blog 
        public async Task<int> DeleteBlog(int blog_id)
        {
            try
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();

                string query = @"DELETE FROM t_blogpost WHERE c_blog_id = @c_blog_id";

                using (var cmd = new NpgsqlCommand(query, _conn))
                {
                    cmd.Parameters.AddWithValue("@c_blog_id", blog_id);
                    await _conn.OpenAsync();
                    int rowsAffected = await cmd.ExecuteNonQueryAsync();
                    return rowsAffected; // Should be 1 if the deletion was successful
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception in DeleteBlog --> " + ex.Message);
                return 0;
            }
            finally
            {
                if (_conn.State == System.Data.ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }
        #endregion

        #region AddNewComment
            public async Task<BlogComment> AddNewComment(BlogComment comment)
            {
                var cmt = new BlogComment();
                if (_conn.State == System.Data.ConnectionState.Closed)
                {
                    await _conn.OpenAsync();
                }

                try
                {
                    // Fetch Author Details
                    string userQuery = comment.userRole?.ToLower() == "instructor"
                        ? "SELECT c_instructorname AS name, c_profileimage AS profile FROM t_instructor WHERE c_instructorid = @id"
                        : "SELECT c_username AS name, c_profileimage AS profile FROM t_user WHERE c_userid = @id";

                    using (var userCmd = new NpgsqlCommand(userQuery, _conn))
                    {
                        userCmd.Parameters.AddWithValue("@id", comment.userId ?? 0);
                        using (var reader = await userCmd.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                comment.authorName = reader["name"]?.ToString();
                                comment.authorProfilePicture = reader["profile"]?.ToString();
                            }
                            else
                            {
                                Console.WriteLine("User not found.");
                                return cmt;
                            }
                        }
                    }

                    // Insert Comment
                    string insertQuery = @"
                        INSERT INTO t_blog_comment (
                            c_blog_id, c_user_id, c_commented_at, 
                            c_comment_content, c_parent_comment_id, c_user_role
                        ) 
                        VALUES (
                            @c_blog_id, @c_user_id, @c_commented_at, 
                            @c_comment_content, @c_parent_comment_id, @c_user_role
                        )
                        RETURNING c_comment_id;";

                    using (var insertCmd = new NpgsqlCommand(insertQuery, _conn))
                    {
                        insertCmd.Parameters.AddWithValue("@c_blog_id", comment.blogId ?? (object)DBNull.Value);
                        insertCmd.Parameters.AddWithValue("@c_user_id", comment.userId ?? (object)DBNull.Value);
                        insertCmd.Parameters.AddWithValue("@c_commented_at", DateTimeOffset.UtcNow.ToUnixTimeSeconds());
                        insertCmd.Parameters.AddWithValue("@c_comment_content", comment.commentContent ?? (object)DBNull.Value);
                        insertCmd.Parameters.AddWithValue("@c_parent_comment_id", comment.parentCommentId ?? (object)DBNull.Value);
                        insertCmd.Parameters.AddWithValue("@c_user_role", comment.userRole ?? (object)DBNull.Value);

                        object result = await insertCmd.ExecuteScalarAsync();
                        // return result != null ? Convert.ToInt32(result) : 0;
                        if (result != null)
                        {
                            int commentId = Convert.ToInt32(result);
                            comment.commentId= commentId;

                            // Increment comment count
                            string updateQuery = "UPDATE t_blogpost SET c_comments = c_comments + 1 WHERE c_blog_id = @blogId";
                            using (var updateCmd = new NpgsqlCommand(updateQuery, _conn))
                            {
                                updateCmd.Parameters.AddWithValue("@blogId", comment.blogId ?? (object)DBNull.Value);
                                await updateCmd.ExecuteNonQueryAsync();
                            }
                            return comment;
                        }
                        else
                        {
                            return cmt;
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error saving comment --> " + ex.Message);
                    return cmt;
                }
                finally
                {
                    if (_conn.State == System.Data.ConnectionState.Open)
                    {
                        await _conn.CloseAsync();
                    }
                }
            }
        #endregion

        #region fetchBlogComments
            public async Task<List<BlogComment>> fetchBlogComments(int blog_id)
            {
                var commentList = new List<BlogComment>();

                if (_conn.State == System.Data.ConnectionState.Closed)
                {
                    await _conn.OpenAsync();
                }

                try
                {
                    var query = @"
                        SELECT 
                            c.c_comment_id,
                            c.c_blog_id,
                            c.c_user_id,
                            c.c_user_role,
                            c.c_comment_content,
                            c.c_parent_comment_id,
                            c.c_commented_at,
                            CASE 
                                WHEN c.c_user_role = 'user' THEN u.c_username
                                WHEN c.c_user_role = 'instructor' THEN i.c_instructorname
                                ELSE ''
                            END AS authorName,
                            CASE 
                                WHEN c.c_user_role = 'user' THEN u.c_profileimage
                                WHEN c.c_user_role = 'instructor' THEN i.c_profileimage
                                ELSE ''
                            END AS authorProfilePicture
                        FROM t_blog_comment c
                        LEFT JOIN t_user u ON c.c_user_role = 'user' AND c.c_user_id = u.c_userid
                        LEFT JOIN t_instructor i ON c.c_user_role = 'instructor' AND c.c_user_id = i.c_instructorid
                        WHERE c.c_blog_id = @blog_id
                        ORDER BY c.c_commented_at DESC";

                    using (var cmd = new NpgsqlCommand(query, _conn))
                    {
                        cmd.Parameters.AddWithValue("@blog_id", blog_id);

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var comment = new BlogComment
                                {
                                    commentId = reader.GetInt32(reader.GetOrdinal("c_comment_id")),
                                    blogId = reader.GetInt32(reader.GetOrdinal("c_blog_id")),
                                    userId = reader.GetInt32(reader.GetOrdinal("c_user_id")),
                                    userRole = reader.GetString(reader.GetOrdinal("c_user_role")),
                                    parentCommentId = reader.GetInt32(reader.GetOrdinal("c_parent_comment_id")),
                                    commentContent = reader.GetString(reader.GetOrdinal("c_comment_content")),
                                    commentedAt = reader.GetInt32(reader.GetOrdinal("c_commented_at")),
                                    authorName = reader.GetString(reader.GetOrdinal("authorName")),
                                    authorProfilePicture = reader.GetString(reader.GetOrdinal("authorProfilePicture"))
                                };

                                commentList.Add(comment);
                            }
                        }
                    }

                    return commentList;
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error saving comment --> " + ex.Message);
                    return commentList;
                }
                finally
                {
                    if (_conn.State == System.Data.ConnectionState.Open)
                    {
                        await _conn.CloseAsync();
                    }
                }
            }
        #endregion

        #region fetchBlogByUri
            public async Task<BlogPost> fetchBlogByUri(string source_uri) {
                
                var blog = new BlogPost();

                try {

                    if (_conn.State == System.Data.ConnectionState.Open)
                        await _conn.CloseAsync();

                    string query = @"SELECT * FROM t_blogpost
                                WHERE c_source_url = @c_source_url";
                    
                    using (var cmd = new NpgsqlCommand(query, _conn))
                    {
                        cmd.Parameters.AddWithValue("@c_source_url", source_uri);
                        await _conn.OpenAsync();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                BlogPost blog_ = new BlogPost
                                {
                                    c_blog_id = reader.GetInt32(reader.GetOrdinal("c_blog_id")),
                                    c_blog_author_id = reader.GetInt32(reader.GetOrdinal("c_blog_author_id")),
                                    c_tags = reader.GetString(reader.GetOrdinal("c_tags")),
                                    c_title = reader.GetString(reader.GetOrdinal("c_title")),
                                    c_desc = reader.GetString(reader.GetOrdinal("c_desc")),
                                    c_content = reader.GetString(reader.GetOrdinal("c_content")),
                                    c_thumbnail = reader.GetString(reader.GetOrdinal("c_thumbnail")),
                                    c_source_url = reader.GetString(reader.GetOrdinal("c_source_url")),
                                    c_views = reader.GetInt32(reader.GetOrdinal("c_views")),
                                    c_likes = reader.GetInt32(reader.GetOrdinal("c_likes")),
                                    c_comments = reader.GetInt32(reader.GetOrdinal("c_comments")),
                                    c_created_at = reader.GetInt32(reader.GetOrdinal("c_created_at")),
                                    c_published_at = reader.GetInt32(reader.GetOrdinal("c_published_at")),
                                    c_is_published = reader.GetBoolean(reader.GetOrdinal("c_is_published")),
                                };
                                blog = blog_;
                            }
                        }
                    }
                    await _conn.CloseAsync();
                    return blog;
                } 

                catch (Exception ex)
                {
                    System.Console.WriteLine("Exception at GetBlogsByInstructor-->" + ex.Message);
                    return blog;
                }

                finally {
                    if (_conn.State == System.Data.ConnectionState.Open)
                        await _conn.CloseAsync();
                }
            }
        #endregion

        #region fetchBlogAuthorById
            public async Task<Instructor> fetchBlogAuthorById(int author_id)
            {
                var author = new Instructor();
                string query = @"
                                SELECT 
                                    c_instructorid, c_instructorname,
                                    c_specialization, c_profileimage
                                FROM t_instructor
                                    WHERE c_instructorid = @author_id";

                if (_conn.State != System.Data.ConnectionState.Open)
                {
                    _conn.Open();
                }

                try
                {

                    using (NpgsqlCommand cmd = new NpgsqlCommand(query, _conn))
                    {

                        cmd.Parameters.AddWithValue("@author_id", author_id);

                        using var reader = await cmd.ExecuteReaderAsync();
                        if (await reader.ReadAsync())
                        {
                            return new Instructor
                            {
                                instructorId = reader.GetInt32(reader.GetOrdinal("c_instructorid")),
                                instructorName = reader.GetString(reader.GetOrdinal("c_instructorname")),
                                specialization = reader.GetString(reader.GetOrdinal("c_specialization")),
                                profileImage = reader.IsDBNull(reader.GetOrdinal("c_profileimage")) ? null : reader.GetString(reader.GetOrdinal("c_profileimage")),
                            };
                        }
                    }

                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error While Updating Profile Basic : " + ex.Message);
                    // return author;
                }
                finally
                {
                    _conn.Close();
                }
                return author;
            }
        #endregion

        #region RegisterLike
            public async Task<int> RegisterLike(vm_RegisterLike like_req)
            {
                int result = 0;
                if (_conn.State == System.Data.ConnectionState.Closed)
                {
                    await _conn.OpenAsync();
                }

                try
                {
                    // First, check if the user already liked/disliked the blog
                    string checkQuery = @"
                        SELECT c_liked FROM t_blog_likes 
                        WHERE c_blog_id = @blogId AND c_user_id = @userId AND c_user_role = @userRole";

                    bool? existingLike = null;

                    using (var checkCmd = new NpgsqlCommand(checkQuery, _conn))
                    {
                        checkCmd.Parameters.AddWithValue("@blogId", like_req.blogId);
                        checkCmd.Parameters.AddWithValue("@userId", like_req.userId);
                        checkCmd.Parameters.AddWithValue("@userRole", like_req.userRole);
                        var existing = await checkCmd.ExecuteScalarAsync();
                        if (existing != null && existing != DBNull.Value)
                        {
                            existingLike = Convert.ToBoolean(existing);
                        }
                    }

                    // Upsert the like
                    string upsertQuery = @"
                        INSERT INTO t_blog_likes (
                            c_blog_id, c_user_id, c_liked, c_liked_at, c_user_role
                        ) VALUES (
                            @c_blog_id, @c_user_id, @c_liked, @c_liked_at, @c_user_role
                        )
                        ON CONFLICT (c_blog_id, c_user_id, c_user_role)
                        DO UPDATE SET 
                            c_liked = EXCLUDED.c_liked,
                            c_liked_at = EXCLUDED.c_liked_at
                        RETURNING c_like_id;";

                    using (var upsertCmd = new NpgsqlCommand(upsertQuery, _conn))
                    {
                        upsertCmd.Parameters.AddWithValue("@c_blog_id", like_req.blogId);
                        upsertCmd.Parameters.AddWithValue("@c_user_id", like_req.userId);
                        upsertCmd.Parameters.AddWithValue("@c_liked", like_req.liked);
                        upsertCmd.Parameters.AddWithValue("@c_liked_at", DateTimeOffset.UtcNow.ToUnixTimeSeconds());
                        upsertCmd.Parameters.AddWithValue("@c_user_role", like_req.userRole); // or pull from session/claim if available

                        var insertedId = await upsertCmd.ExecuteScalarAsync();

                        if (insertedId != null)
                        {
                            // Adjust like count in t_blogpost only if:
                            // - This is a new like
                            // - OR a status change (like -> dislike or vice versa)

                            int likeChange = 0;

                            if (existingLike == null && like_req.liked)
                                likeChange = 1; // new like
                            else if (existingLike == null && !like_req.liked)
                                likeChange = 0; // new dislike, don't affect like count
                            else if (existingLike != like_req.liked)
                                likeChange = like_req.liked ? 1 : -1;

                            if (likeChange != 0)
                            {
                                string updateLikesQuery = @"
                                    UPDATE t_blogpost 
                                    SET c_likes = c_likes + @likeChange
                                    WHERE c_blog_id = @blogId";

                                using (var updateCmd = new NpgsqlCommand(updateLikesQuery, _conn))
                                {
                                    updateCmd.Parameters.AddWithValue("@likeChange", likeChange);
                                    updateCmd.Parameters.AddWithValue("@blogId", like_req.blogId);
                                    await updateCmd.ExecuteNonQueryAsync();
                                }
                            }

                            result = 1;
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error saving like --> " + ex.Message);
                    result = 0;
                }
                finally
                {
                    if (_conn.State == System.Data.ConnectionState.Open)
                    {
                        await _conn.CloseAsync();
                    }
                }

                return result;
            }

        #endregion

        #region FetchLikeStatusForBlog
            public async Task<vm_RegisterLike> fetchLikeStatusForBlog(vm_RegisterLike like_info)
            {
                vm_RegisterLike like_info_ = new vm_RegisterLike();
                like_info_.likeId = -1;

                if (_conn.State == System.Data.ConnectionState.Closed)
                {
                    await _conn.OpenAsync();
                }

                try
                {
                    // First, check if the user already liked/disliked the blog
                    string checkQuery = @"
                        SELECT * FROM t_blog_likes 
                        WHERE c_blog_id = @blogId AND c_user_id = @userId AND c_user_role = @userRole";

                    using (var checkCmd = new NpgsqlCommand(checkQuery, _conn))
                    {
                        checkCmd.Parameters.AddWithValue("@blogId", like_info.blogId);
                        checkCmd.Parameters.AddWithValue("@userId", like_info.userId);
                        checkCmd.Parameters.AddWithValue("@userRole", like_info.userRole);

                        using (var reader = await checkCmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                vm_RegisterLike like_info__ = new vm_RegisterLike
                                {
                                    likeId = reader.GetInt32(reader.GetOrdinal("c_like_id")),
                                    blogId = reader.GetInt32(reader.GetOrdinal("c_blog_id")),
                                    userId = reader.GetInt32(reader.GetOrdinal("c_user_id")),
                                    liked = reader.GetBoolean(reader.GetOrdinal("c_liked")),
                                    likedAt = reader.GetInt32(reader.GetOrdinal("c_liked_at")),
                                    userRole = reader.GetString(reader.GetOrdinal("c_user_role")),
                                };
                                like_info_ = like_info__;
                            }
                        }
                    }              
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error saving like --> " + ex.Message);
                    return like_info_;
                }
                finally
                {
                    if (_conn.State == System.Data.ConnectionState.Open)
                    {
                        await _conn.CloseAsync();
                    }
                }

                return like_info_;
            }

        #endregion
    #endregion
}
using System.Data;
using System.Text.Json;
using Npgsql;
namespace Repo;

public class BlogRepo : IBlogInterface
{
    private readonly NpgsqlConnection _conn;
    private readonly IEmailInterface _email;

    public BlogRepo(NpgsqlConnection conn, IEmailInterface email)
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

    // DRY: Centralized method for executing a scalar
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

    #region Blog

    public async Task<int> SaveBlogDraft(BlogPost blogpost)
    {
        string query = @"INSERT INTO t_blogpost 
            (c_blog_author_id, c_tags, c_title, c_desc, c_content, c_thumbnail, c_created_at, c_published_at, c_is_published, c_source_url) 
            VALUES 
            (@c_blog_author_id, @c_tags, @c_title, @c_desc, @c_content, @c_thumbnail, @c_created_at, @c_published_at, @c_is_published, @c_source_url)
            RETURNING c_blog_id;";
        return await ExecuteScalarAsync<int>(query, cmd =>
        {
            cmd.Parameters.AddWithValue("@c_blog_author_id", blogpost.c_blog_author_id);
            cmd.Parameters.AddWithValue("@c_tags", blogpost.c_tags ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@c_title", blogpost.c_title);
            cmd.Parameters.AddWithValue("@c_desc", blogpost.c_desc ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@c_content", blogpost.c_content ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@c_thumbnail", blogpost.c_thumbnail ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@c_created_at", DateTimeOffset.UtcNow.ToUnixTimeSeconds());
            cmd.Parameters.AddWithValue("@c_published_at", 1);
            cmd.Parameters.AddWithValue("@c_is_published", false);
            cmd.Parameters.AddWithValue("@c_source_url", blogpost.c_source_url ?? (object)DBNull.Value);
        });
    }

    public async Task<bool> UpdateBlogDraft(BlogPost blogpost)
    {
        string query = @"UPDATE t_blogpost SET
            c_tags = @c_tags,
            c_title = @c_title,
            c_desc = @c_desc,
            c_content = @c_content,
            c_thumbnail = @c_thumbnail
            WHERE c_blog_id = @c_blog_id";
        int rows = await ExecuteScalarAsync<int>(
            $"WITH updated AS ({query} RETURNING 1) SELECT COUNT(*) FROM updated;", cmd =>
        {
            cmd.Parameters.AddWithValue("@c_blog_id", blogpost.c_blog_id);
            cmd.Parameters.AddWithValue("@c_tags", blogpost.c_tags ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@c_title", blogpost.c_title);
            cmd.Parameters.AddWithValue("@c_desc", blogpost.c_desc ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@c_content", blogpost.c_content ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@c_thumbnail", blogpost.c_thumbnail ?? (object)DBNull.Value);
        });
        return rows > 0;
    }

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
        int rows = await ExecuteScalarAsync<int>(
            $"WITH updated AS ({query} RETURNING 1) SELECT COUNT(*) FROM updated;", cmd =>
        {
            cmd.Parameters.AddWithValue("@c_blog_id", blogpost.c_blog_id);
            cmd.Parameters.AddWithValue("@c_tags", blogpost.c_tags ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@c_title", blogpost.c_title);
            cmd.Parameters.AddWithValue("@c_desc", blogpost.c_desc ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@c_content", blogpost.c_content ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@c_thumbnail", blogpost.c_thumbnail ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@c_published_at", DateTimeOffset.UtcNow.ToUnixTimeSeconds());
            cmd.Parameters.AddWithValue("@c_is_published", true);
        });
        return rows > 0;
    }

    public async Task<List<BlogPost>> GetBlogsByInstructorId(int instructor_id)
    {
        string query = @"SELECT * FROM t_blogpost WHERE c_blog_author_id = @c_blog_author_id";
        return await ExecuteReaderAsync(query, cmd =>
        {
            cmd.Parameters.AddWithValue("@c_blog_author_id", instructor_id);
        }, reader => MapBlogPost(reader));
    }

    public async Task<List<BlogPost>> GetBlogsForUser()
    {
        string query = @"SELECT * FROM t_blogpost WHERE c_is_published = true";
        return await ExecuteReaderAsync(query, null, reader => MapBlogPost(reader));
    }

    public async Task<List<BlogPost>> FetchBookmarkedBlogsForUser(int user_id, string user_role)
    {
        string query = @"
            SELECT bp.* FROM t_blogpost bp
            INNER JOIN t_blog_bookmark bb ON bp.c_blog_id = bb.c_blog_id
            WHERE bb.c_user_id = @c_user_id AND bb.c_user_role = @c_user_role AND bb.c_bookmarked = TRUE";
        return await ExecuteReaderAsync(query, cmd =>
        {
            cmd.Parameters.AddWithValue("@c_user_id", user_id);
            cmd.Parameters.AddWithValue("@c_user_role", user_role);
        }, reader => MapBlogPost(reader));
    }

    public async Task<BlogPost> GetBlogById(int blog_id)
    {
        string query = @"SELECT * FROM t_blogpost WHERE c_blog_id = @c_blog_id";
        var blogs = await ExecuteReaderAsync(query, cmd =>
        {
            cmd.Parameters.AddWithValue("@c_blog_id", blog_id);
        }, reader => MapBlogPost(reader));
        return blogs.FirstOrDefault();
    }

    public async Task<int> DeleteBlog(int blog_id)
    {
        string query = @"DELETE FROM t_blogpost WHERE c_blog_id = @c_blog_id";
        await EnsureOpenAsync();
        try
        {
            using var cmd = new NpgsqlCommand(query, _conn);
            cmd.Parameters.AddWithValue("@c_blog_id", blog_id);
            int rows = await cmd.ExecuteNonQueryAsync();
            return rows;
        }
        finally
        {
            await EnsureClosedAsync();
        }
    }

    public async Task<BlogComment> AddNewComment(BlogComment comment)
    {
        await EnsureOpenAsync();
        try
        {
            // Fetch Author Details
            string userQuery = comment.userRole?.ToLower() == "instructor"
                ? "SELECT c_instructorname AS name, c_profileimage AS profile FROM t_instructor WHERE c_instructorid = @id"
                : "SELECT c_username AS name, c_profileimage AS profile FROM t_user WHERE c_userid = @id";
            using (var userCmd = new NpgsqlCommand(userQuery, _conn))
            {
                userCmd.Parameters.AddWithValue("@id", comment.userId ?? 0);
                using var reader = await userCmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    comment.authorName = reader["name"]?.ToString();
                    comment.authorProfilePicture = reader["profile"]?.ToString();
                }
                else
                {
                    return new BlogComment();
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
                if (result != null)
                {
                    comment.commentId = Convert.ToInt32(result);
                    // Increment comment count
                    string updateQuery = "UPDATE t_blogpost SET c_comments = c_comments + 1 WHERE c_blog_id = @blogId";
                    using (var updateCmd = new NpgsqlCommand(updateQuery, _conn))
                    {
                        updateCmd.Parameters.AddWithValue("@blogId", comment.blogId ?? (object)DBNull.Value);
                        await updateCmd.ExecuteNonQueryAsync();
                    }
                    return comment;
                }
                return new BlogComment();
            }
        }
        finally
        {
            await EnsureClosedAsync();
        }
    }

    public async Task<List<BlogComment>> fetchBlogComments(int blog_id)
    {
        string query = @"
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
        return await ExecuteReaderAsync(query, cmd =>
        {
            cmd.Parameters.AddWithValue("@blog_id", blog_id);
        }, reader => new BlogComment
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
        });
    }

    public async Task<BlogPost> fetchBlogByUri(string source_uri)
    {
        string query = @"SELECT * FROM t_blogpost WHERE c_source_url = @c_source_url";
        var blogs = await ExecuteReaderAsync(query, cmd =>
        {
            cmd.Parameters.AddWithValue("@c_source_url", source_uri);
        }, reader => MapBlogPost(reader));
        var blog = blogs.FirstOrDefault();
        if (blog != null && blog.c_blog_id > 0)
        {
            // Increment view count
            string updateQuery = @"UPDATE t_blogpost SET c_views = c_views + 1 WHERE c_blog_id = @c_blog_id";
            await ExecuteScalarAsync<int>(updateQuery, cmd =>
            {
                cmd.Parameters.AddWithValue("@c_blog_id", blog.c_blog_id);
            });
            blog.c_views += 1;
        }
        return blog;
    }

    public async Task<Instructor> fetchBlogAuthorById(int author_id)
    {
        string query = @"
            SELECT c_instructorid, c_instructorname, c_specialization, c_profileimage
            FROM t_instructor WHERE c_instructorid = @author_id";
        var authors = await ExecuteReaderAsync(query, cmd =>
        {
            cmd.Parameters.AddWithValue("@author_id", author_id);
        }, reader => new Instructor
        {
            instructorId = reader.GetInt32(reader.GetOrdinal("c_instructorid")),
            instructorName = reader.GetString(reader.GetOrdinal("c_instructorname")),
            specialization = reader.GetString(reader.GetOrdinal("c_specialization")),
            profileImage = reader.IsDBNull(reader.GetOrdinal("c_profileimage")) ? null : reader.GetString(reader.GetOrdinal("c_profileimage")),
        });
        return authors.FirstOrDefault();
    }

    public async Task<int> RegisterLike(vm_RegisterLike like_req)
    {
        await EnsureOpenAsync();
        try
        {
            // Check if the user already liked/disliked the blog
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
                    existingLike = Convert.ToBoolean(existing);
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
                upsertCmd.Parameters.AddWithValue("@c_user_role", like_req.userRole);
                var insertedId = await upsertCmd.ExecuteScalarAsync();

                if (insertedId != null)
                {
                    int likeChange = 0;
                    if (existingLike == null && like_req.liked)
                        likeChange = 1;
                    else if (existingLike == null && !like_req.liked)
                        likeChange = 0;
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
                    return 1;
                }
            }
            return 0;
        }
        finally
        {
            await EnsureClosedAsync();
        }
    }

    public async Task<vm_RegisterLike> fetchLikeStatusForBlog(vm_RegisterLike like_info)
    {
        string checkQuery = @"
            SELECT * FROM t_blog_likes 
            WHERE c_blog_id = @blogId AND c_user_id = @userId AND c_user_role = @userRole";
        var likes = await ExecuteReaderAsync(checkQuery, cmd =>
        {
            cmd.Parameters.AddWithValue("@blogId", like_info.blogId);
            cmd.Parameters.AddWithValue("@userId", like_info.userId);
            cmd.Parameters.AddWithValue("@userRole", like_info.userRole);
        }, reader => new vm_RegisterLike
        {
            likeId = reader.GetInt32(reader.GetOrdinal("c_like_id")),
            blogId = reader.GetInt32(reader.GetOrdinal("c_blog_id")),
            userId = reader.GetInt32(reader.GetOrdinal("c_user_id")),
            liked = reader.GetBoolean(reader.GetOrdinal("c_liked")),
            likedAt = reader.GetInt32(reader.GetOrdinal("c_liked_at")),
            userRole = reader.GetString(reader.GetOrdinal("c_user_role")),
        });
        return likes.FirstOrDefault() ?? new vm_RegisterLike { likeId = -1 };
    }

    public async Task<int> RegisterBookmark(vm_RegisterBookmark bookmark_req)
    {
        await EnsureOpenAsync();
        try
        {
            string upsertQuery = @"
                INSERT INTO t_blog_bookmark (
                    c_blog_id, c_user_id, c_bookmarked, c_bookmarked_at, c_user_role
                ) VALUES (
                    @c_blog_id, @c_user_id, @c_bookmarked, @c_bookmarked_at, @c_user_role
                )
                ON CONFLICT (c_blog_id, c_user_id, c_user_role)
                DO UPDATE SET 
                    c_bookmarked = EXCLUDED.c_bookmarked,
                    c_bookmarked_at = EXCLUDED.c_bookmarked_at
                RETURNING c_bookmark_id;";
            using (var upsertCmd = new NpgsqlCommand(upsertQuery, _conn))
            {
                upsertCmd.Parameters.AddWithValue("@c_blog_id", bookmark_req.blogId);
                upsertCmd.Parameters.AddWithValue("@c_user_id", bookmark_req.userId);
                upsertCmd.Parameters.AddWithValue("@c_bookmarked", bookmark_req.bookmarked);
                upsertCmd.Parameters.AddWithValue("@c_bookmarked_at", DateTimeOffset.UtcNow.ToUnixTimeSeconds());
                upsertCmd.Parameters.AddWithValue("@c_user_role", bookmark_req.userRole);
                var insertedId = await upsertCmd.ExecuteScalarAsync();
                return insertedId != null ? 1 : 0;
            }
        }
        finally
        {
            await EnsureClosedAsync();
        }
    }

    public async Task<vm_RegisterBookmark> FetchBookmarkStatusForBlog(vm_RegisterBookmark bookmark_info)
    {
        string checkQuery = @"
            SELECT * FROM t_blog_bookmark 
            WHERE c_blog_id = @blogId AND c_user_id = @userId AND c_user_role = @userRole";
        var bookmarks = await ExecuteReaderAsync(checkQuery, cmd =>
        {
            cmd.Parameters.AddWithValue("@blogId", bookmark_info.blogId);
            cmd.Parameters.AddWithValue("@userId", bookmark_info.userId);
            cmd.Parameters.AddWithValue("@userRole", bookmark_info.userRole);
        }, reader => new vm_RegisterBookmark
        {
            bookmarkId = reader.GetInt32(reader.GetOrdinal("c_bookmark_id")),
            blogId = reader.GetInt32(reader.GetOrdinal("c_blog_id")),
            userId = reader.GetInt32(reader.GetOrdinal("c_user_id")),
            bookmarked = reader.GetBoolean(reader.GetOrdinal("c_bookmarked")),
            bookmarkedAt = reader.GetInt32(reader.GetOrdinal("c_bookmarked_at")),
            userRole = reader.GetString(reader.GetOrdinal("c_user_role")),
        });
        return bookmarks.FirstOrDefault() ?? new vm_RegisterBookmark { bookmarkId = -1 };
    }

    #endregion

    // DRY: BlogPost mapping helper
    private BlogPost MapBlogPost(NpgsqlDataReader reader)
    {
        return new BlogPost
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
    }
}
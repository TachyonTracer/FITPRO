namespace Repo;
using Microsoft.AspNetCore.Http;

public class BlogComment
{
    public int? commentId { get; set; }
    public int? blogId { get; set; }
    public int? userId { get; set; }
    public int? commentedAt { get; set; }
    public string? commentContent { get; set; }
    public int? parentCommentId { get; set; }
    public string? userRole { get; set; }
    public string? authorName { get; set; }
    public string? authorProfilePicture { get; set; }
}
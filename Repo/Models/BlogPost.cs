namespace Repo;
using Microsoft.AspNetCore.Http;

public class BlogPost
{
    public int? c_blog_id { get; set; }
    public int? c_blog_author_id { get; set; }
    public string? c_tags { get; set; }
    public string? c_title { get; set; }
    public string? c_desc { get; set; }
    public string? c_content { get; set; }
    public string? c_thumbnail { get; set; }
    public int? c_created_at { get; set; }
    public int? c_published_at { get; set; }
    public Boolean? c_is_published { get; set; }
    public int? c_views { get; set; }
    public int? c_likes { get; set; }
    public int? c_comments { get; set; }
    public string? c_source_url { get; set; }
    public IFormFile? ThumbnailFile { get; set; }
}
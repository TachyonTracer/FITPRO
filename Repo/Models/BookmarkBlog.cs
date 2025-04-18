namespace Repo;
using Microsoft.AspNetCore.Http;

public class vm_RegisterBookmark
{
    public int? bookmarkId { get; set; } // corresponds to c_bookmark_id
    public int userId { get; set; }
    public int blogId { get; set; }
    public bool bookmarked { get; set; } // corresponds to c_bookmarked
    public int? bookmarkedAt { get; set; } // corresponds to c_bookmarked_at (BIGINT Unix timestamp)
    public string userRole { get; set; }
}
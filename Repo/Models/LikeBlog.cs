namespace Repo;
using Microsoft.AspNetCore.Http;

public class vm_RegisterLike
{
    public int? likeId { get; set; }
    public int userId { get; set; }
    public int blogId { get; set; }
    public bool liked { get; set; }
    public int? likedAt { get; set; }
    public string userRole { get; set; }
}
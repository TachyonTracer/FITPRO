namespace Repo;
using Microsoft.AspNetCore.Http;

public class vm_blog_image
{
    public string? blog_image_path { get; set; }
    public IFormFile? BlogImageFile { get; set; }
}
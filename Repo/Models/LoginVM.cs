using System.ComponentModel.DataAnnotations;

namespace Repo;

public class LoginVM
{   [Required(ErrorMessage = "Email is required")]
    public string email { get; set; }
    [Required(ErrorMessage = "Password is required")]
    public string password { get; set; }

    public string? role { get; set; }
}
using System.ComponentModel.DataAnnotations;

namespace Repo;

public class LoginVM
{
    public string email { get; set; }
    public string password { get; set; }
    public string role { get; set; }
    public string recaptchaToken { get; set; }
}
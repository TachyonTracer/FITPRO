using System.Text.Json;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Repo;
public class User
{
    [Required(ErrorMessage = "User ID is required")]
    public int userId { get; set; }

    [Required(ErrorMessage = "Username is required")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters")]
    public string userName { get; set; }

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string email { get; set; }

    [Required(ErrorMessage = "Password is required")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 100 characters")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$",
        ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")]
    public string? password { get; set; }

    [Required(ErrorMessage = "Confirm password is required")]
    [Compare("password", ErrorMessage = "Passwords do not match")]
    public string? confirmPassword { get; set; }

    [Required(ErrorMessage = "Mobile number is required")]
    [Phone(ErrorMessage = "Invalid phone number format")]
    public string mobile { get; set; }

    [StringLength(10, ErrorMessage = "Gender must not exceed 10 characters")]
    public string gender { get; set; }

    [DataType(DataType.Date)]
    public DateTime? dob { get; set; }

    [Range(0, 300, ErrorMessage = "Height must be between 0 and 300 cm")]
    public int? height { get; set; }

    [Range(0, 500, ErrorMessage = "Weight must be between 0 and 500 kg")]
    public decimal? weight { get; set; }

    [StringLength(100, ErrorMessage = "Goal must not exceed 100 characters")]
    public string goal { get; set; }

    [StringLength(200, ErrorMessage = "Medical condition must not exceed 200 characters")]
    public string medicalCondition { get; set; }

    public string profileImage { get; set; }

    [Required(ErrorMessage = "Creation date is required")]
    public DateTime createdAt { get; set; } = DateTime.UtcNow;

    public bool status { get; set; } 

    [StringLength(100, ErrorMessage = "Activation token must not exceed 100 characters")]
    public string activationToken { get; set; }

    [DataType(DataType.DateTime)]
    public DateTime? activatedOn { get; set; }


    public IFormFile profileImageFile { get; set; }

}

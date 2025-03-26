
using System.Text.Json;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;


namespace Repo;

public class Instructor
{
    [Required(ErrorMessage = "Instructor ID is required")]
    public int instructorId { get; set; }

    [Required(ErrorMessage = "Instructor name is required")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters")]
    public string instructorName { get; set; }

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
    public DateTime dob { get; set; }

    [Required(ErrorMessage = "Specialization is required")]
    [StringLength(100, ErrorMessage = "Specialization must not exceed 100 characters")]
    public string specialization { get; set; }

    [Required(ErrorMessage = "Certificates are required")]
    public JsonDocument certificates { get; set; }

    public string? profileImage { get; set; }

    [StringLength(100, ErrorMessage = "Association must not exceed 100 characters")]
    public string association { get; set; }

    [Required(ErrorMessage = "Creation date is required")]
    public DateTime createdAt { get; set; } = DateTime.UtcNow;

    [Required(ErrorMessage = "Status is required")]
    [StringLength(20, ErrorMessage = "Status must not exceed 20 characters")]
    public string? status { get; set; }

    [Url(ErrorMessage = "Invalid URL format")]
    public string? idProof { get; set; }

    [StringLength(100, ErrorMessage = "Activation token must not exceed 100 characters")]
    public string? activationToken { get; set; }

    [DataType(DataType.DateTime)]
    public DateTime? activatedOn { get; set; }

    public IFormFile? profileImageFile { get; set; }
    public IFormFile? idProofFile { get; set; }

    public IFormFile[]? certificateFiles { get; set; }
}


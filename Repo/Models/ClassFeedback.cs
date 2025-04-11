using System;
using System.ComponentModel.DataAnnotations;

namespace Repo;

public class ClassFeedback
{
    [Key]
    public int feedbackId { get; set; }

    [Required(ErrorMessage = "User ID is required")]
    public int userId { get; set; }

    [Required(ErrorMessage = "Class ID is required")]
    public int classId { get; set; }

    [Required(ErrorMessage = "Feedback is required")]
    [StringLength(500, ErrorMessage = "Feedback should not exceed 500 characters")]
    public string feedback { get; set; }

    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
    public int rating { get; set; }

    public DateTime createdAt { get; set; } = DateTime.UtcNow;

    public string userName { get; set; }
    public string className { get; set; }
    public string instructorName { get; set; }
}

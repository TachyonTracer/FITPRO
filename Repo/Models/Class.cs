using System.Text.Json;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Repo;
public class Class
{
    [Required(ErrorMessage = "Class ID is required")]
    public int classId { get; set; }

    [Required(ErrorMessage = "Class name is required")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Class name must be between 2 and 100 characters")]
    public string className { get; set; }

    [Required(ErrorMessage = "Instructor ID is required")]
    public int instructorId { get; set; }

    [Required(ErrorMessage = "Description is required")]
    public JsonDocument description { get; set; }

    [Required(ErrorMessage = "Type is required")]
    [StringLength(50, ErrorMessage = "Type must not exceed 50 characters")]
    public string type { get; set; }

    [Required(ErrorMessage = "Start date is required")]
    [DataType(DataType.Date)]
    public DateTime startDate { get; set; }

    [DataType(DataType.Date)]
    public DateTime? endDate { get; set; }

    [DataType(DataType.Time)]
    public TimeSpan? startTime { get; set; }

    [DataType(DataType.Time)]
    public TimeSpan? endTime { get; set; }

    [Range(0, 1440, ErrorMessage = "Duration must be between 0 and 1440 minutes")]
    public int? duration { get; set; }

    [Required(ErrorMessage = "Maximum capacity is required")]
    [Range(1, 1000, ErrorMessage = "Capacity must be between 1 and 1000")]
    public int maxCapacity { get; set; }

    [StringLength(200, ErrorMessage = "Required equipments must not exceed 200 characters")]
    public string requiredEquipments { get; set; }

    [Required(ErrorMessage = "Creation date is required")]
    public DateTime createdAt { get; set; } = DateTime.UtcNow;

    [Required(ErrorMessage = "Status is required")]
    [StringLength(20, ErrorMessage = "Status must not exceed 20 characters")]
    public string status { get; set; }

    [Required(ErrorMessage = "City is required")]
    [StringLength(50, ErrorMessage = "City must not exceed 50 characters")]
    public string city { get; set; }

    [Required(ErrorMessage = "Address is required")]
    [StringLength(200, ErrorMessage = "Address must not exceed 200 characters")]
    public string address { get; set; }

    public JsonDocument assets { get; set; }

    [Required(ErrorMessage = "Fee is required")]
    [Range(0, 100000, ErrorMessage = "Fee must be between 0 and 100000")]
    public decimal fee { get; set; }
    public int availableCapacity { get; set; }

    public IFormFile[] assetFiles { get; set; }
}

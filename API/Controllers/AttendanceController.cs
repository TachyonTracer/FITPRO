using Microsoft.AspNetCore.Mvc;
using Repo;
using System;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceInterface _attendanceRepo;

    public AttendanceController(IAttendanceInterface attendanceRepo)
    {
        _attendanceRepo = attendanceRepo;
    }

    // Centralized API response handler
    private async Task<IActionResult> HandleApiResponse<T>(Func<Task<T>> func, string successMessage, string notFoundMessage = null)
    {
        try
        {
            var result = await func();
            if (result == null || (result is System.Collections.IEnumerable enumerable && !enumerable.Cast<object>().Any()))
            {
                return NotFound(new { success = false, message = notFoundMessage ?? "No data found.", data = (object)null });
            }
            return Ok(new { success = true, message = successMessage, data = result });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "An error occurred", error = ex.Message });
        }
    }

    [HttpPost("AddAttendance")]
    public async Task<IActionResult> AddAttendance([FromBody] Attendance request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new
            {
                success = false,
                message = "Invalid request data",
                errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
            });
        }

        return await HandleApiResponse(async () =>
        {
            var existing = await _attendanceRepo.CheckIfExistsWithId(request.classId, request.attendanceDate);
            if (existing.exists)
            {
                return new
                {
                    exists = true,
                    message = "Attendance record already exists for this class and date",
                    attendanceId = existing.attendanceId
                };
            }
            int attendanceId = await _attendanceRepo.AddAttendance(request);
            return new
            {
                exists = false,
                message = "Attendance added successfully",
                attendanceId
            };
        }, "Attendance processed successfully");
    }

    [HttpGet("CheckIfExists")]
    public Task<IActionResult> CheckIfExists(int classId, DateTime date)
    {
        return HandleApiResponse(
            () => _attendanceRepo.CheckIfExistsWithId(classId, date),
            "Attendance existence checked"
        );
    }

    [HttpPut("UpdateAttendance")]
    public async Task<IActionResult> UpdateAttendance([FromBody] Attendance request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new
            {
                success = false,
                message = "Invalid request data",
                errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
            });
        }

        return await HandleApiResponse(async () =>
        {
            bool updated = await _attendanceRepo.UpdateAttendance(request);
            if (!updated)
                return null;
            return new { message = "Attendance updated successfully" };
        }, "Attendance updated successfully", "Attendance record not found");
    }

    [HttpGet("GetAttendanceByClassId")]
    public Task<IActionResult> GetAttendanceByClassId(int classId)
    {
        return HandleApiResponse(
            () => _attendanceRepo.GetAttendanceByClassId(classId),
            "Attendance records fetched successfully",
            "No attendance records found"
        );
    }

    [HttpGet("GetAttendanceByClassAndDateRange")]
    public Task<IActionResult> GetAttendanceByClassAndDateRange(int classId, DateTime startDate, DateTime endDate)
    {
        return HandleApiResponse(
            () => _attendanceRepo.GetAttendanceByClassAndDateRange(classId, startDate, endDate),
            "Attendance records fetched successfully",
            "No attendance records found"
        );
    }
}



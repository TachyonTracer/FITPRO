using Microsoft.AspNetCore.Mvc;
using Repo;
using System;
using System.Collections.Generic;
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

            try
            {
                // Check if attendance already exists for this class and date
                bool exists = await _attendanceRepo.CheckIfExists(request.classId, request.attendanceDate);
                if (exists)
                {
                    return Conflict(new
                    {
                        success = false,
                        message = "Attendance record already exists for this class and date"
                    });
                }

                var attendance = new Attendance
                {
                    classId = request.classId,
                    attendanceDate = request.attendanceDate,
                    presentStudents = request.presentStudents,
                    absentStudents = request.absentStudents
                };

                int attendanceId = await _attendanceRepo.AddAttendance(attendance);
                if (attendanceId > 0)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Attendance added successfully",
                        attendanceId
                    });
                }

                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to add attendance"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [HttpGet("CheckIfExists")]
        public async Task<IActionResult> CheckIfExists(int classId, DateTime date)
        {
            try
            {
                bool exists = await _attendanceRepo.CheckIfExists(classId, date);
                return Ok(new
                {
                    success = true,
                    exists
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }
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

            try
            {
                var attendance = new Attendance
                {
                    attendanceId = request.attendanceId,
                    classId = request.classId,
                    attendanceDate = request.attendanceDate,
                    presentStudents = request.presentStudents,
                    absentStudents = request.absentStudents
                };

                bool success = await _attendanceRepo.UpdateAttendance(attendance);
                if (success)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Attendance updated successfully"
                    });
                }

                return NotFound(new
                {
                    success = false,
                    message = "Attendance record not found"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [HttpGet("GetAttendanceByClassId")]
        public async Task<IActionResult> GetAttendanceByClassId(int classId)
        {
            try
            {
                var attendance = await _attendanceRepo.GetAttendanceByClassId(classId);
                return Ok(new
                {
                    success = true,
                    data = attendance
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [HttpGet("GetAttendanceByClassAndDateRange")]
        public async Task<IActionResult> GetAttendanceByClassAndDateRange(
            int classId, DateTime startDate, DateTime endDate)
        {
            try
            {
                var attendance = await _attendanceRepo.GetAttendanceByClassAndDateRange(
                    classId, startDate, endDate);
                return Ok(new
                {
                    success = true,
                    data = attendance
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
    }

    

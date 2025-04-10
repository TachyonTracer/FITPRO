using System;
using System.Collections.Generic;
using System.Threading.Tasks;


    public interface IAttendanceInterface
    {
        // Check if attendance record exists for a class on a specific date
        Task<bool> CheckIfExists(int classId, DateTime date);
        
        // Add new attendance record
        Task<int> AddAttendance(Attendance attendance);
        
        // Update existing attendance record
        Task<bool> UpdateAttendance(Attendance attendance);
        
        // Get attendance records by class ID
        Task<List<Attendance>> GetAttendanceByClassId(int classId);
        
        // Get attendance records by class ID and date range
        Task<List<Attendance>> GetAttendanceByClassAndDateRange(int classId, DateTime startDate, DateTime endDate);
    }

    

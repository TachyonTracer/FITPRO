 public class Attendance
    {
        public int attendanceId { get; set; }
        public int classId { get; set; }
        public DateTime attendanceDate { get; set; }
        public List<int> presentStudents { get; set; } = new List<int>();
        public List<int> absentStudents { get; set; } = new List<int>();
        // public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

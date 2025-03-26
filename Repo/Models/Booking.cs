namespace Repo;

public class Booking{

  public int bookingId {get; set;}

  public int userId{get; set;}
  public int classId{get; set;}
 
 public DateTime createdAt { get; set; } = DateTime.UtcNow;
}
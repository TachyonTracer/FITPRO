using Repo;
public interface IClassInterface
{
    Task<List<Class>> GetAllClasses();
    Task<List<Class>> GetClassById(string id);
    Task<Class> GetOne(string id);
    Task<Response> BookClass(Booking request);
    Task<List<Class>> GetBookedClassesByUserId(string userId);
    Task<(bool success, string message)> CancelBooking(int userId, int classId);
    Task<bool> IsCancellationAllowed(int bookingId, int maxHoursBefore = 24);

    Task<bool> IsClassAlreadyBooked(Booking bookingData);
}
namespace Repo;
public interface IClassInterface
{
    #region User Story: List Class
    Task<List<Class>> GetAllClasses();
    Task<List<Class>> GetClassById(string id);
    Task<Class> GetOne(string id);
    Task<Response> BookClass(Booking request);
    Task<bool> SoftDeleteClass(int classId);

    Task<int> ScheduleClass( Class classData);

    Task<Response> UpdateClass(Class updatedClass);
    #endregion
    Task<List<Class>> GetBookedClassesByUserId(string userId);
    Task<(bool success, string message)> CancelBooking(int userId, int classId);
    Task<bool> IsCancellationAllowed(int bookingId, int maxHoursBefore = 24);

    Task<bool> IsClassAlreadyBooked(Booking bookingData);

    Task<bool> ActivateClass(int classId);
}
using StackExchange.Redis;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class RedisService
{
    private readonly IDatabase _redis;

    public RedisService(string redisConnectionString)
    {
        var redis = ConnectionMultiplexer.Connect(redisConnectionString);
        _redis = redis.GetDatabase();
    }


    // Store notification for an admin
    public async Task StoreNotificationForAdmin(string adminId, string notification)
    {
        await _redis.ListRightPushAsync($"admin:{adminId}:notifications", notification);
    }

    // Store notification for an instructor
    public async Task StoreNotificationForInstructor(string instructorId, string notification)
    {
        await _redis.ListRightPushAsync($"instructor:{instructorId}:notifications", notification);
    }

    // Store notification for a user
    public async Task StoreNotificationForUser(string userId, string notification)
    {
        await _redis.ListRightPushAsync($"user:{userId}:notifications", notification);
    }



    // Get unread notifications for an admin
    public async Task<List<string>> GetUnreadNotificationsForAdmin(string adminId)
    {
        var notifications = await _redis.ListRangeAsync($"admin:{adminId}:notifications");
        return notifications.Select(n => n.ToString()).ToList();
    }

    // Get unread notifications for an Instructor
    public async Task<List<string>> GetUnreadNotificationsForInstructor(string instructorId)
    {
        var notifications = await _redis.ListRangeAsync($"instructor:{instructorId}:notifications");
        return notifications.Select(n => n.ToString()).ToList();
    }

    // Get unread notifications for a user
    public async Task<List<string>> GetUnreadNotificationsForUser(string userId)
    {
        var notifications = await _redis.ListRangeAsync($"user:{userId}:notifications");
        return notifications.Select(n => n.ToString()).ToList();
    }



    // Mark all notifications as read (delete from Redis) for an admin
    public async Task MarkAllAsReadForAdmin(string adminId)
    {
        await _redis.KeyDeleteAsync($"admin:{adminId}:notifications");
    }

    // Mark all notifications as read (delete from Redis) for an instructor
    public async Task MarkAllAsReadForInstructor(string instructorId)
    {
        await _redis.KeyDeleteAsync($"instructor:{instructorId}:notifications");
    }

    // Mark all notifications as read (delete from Redis) for a user
    public async Task MarkAllAsReadForUser(string userId)
    {
        await _redis.KeyDeleteAsync($"user:{userId}:notifications");
    }
}

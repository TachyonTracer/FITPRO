using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Threading.Tasks;

public class NotificationHub : Hub
{
    private readonly RedisService _redisService;

    public NotificationHub(RedisService redisService)
    {
        _redisService = redisService;
    }

    // On user/admin connection, add them to a group
    public override async Task OnConnectedAsync()
    {
        var userId = Context.GetHttpContext()?.Request.Query["userId"].ToString();
        var role = Context.GetHttpContext()?.Request.Query["role"].ToString();

        if (!string.IsNullOrEmpty(role)) 
        {
            string groupName;
            if (role == "admin") { groupName = $"admin:{userId}";}
            else if (role == "instructor") { groupName = $"instructor:{userId}";}
            else { groupName = $"user:{userId}";}
            
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            Console.WriteLine($"User {userId} added to group: {groupName}");
        }

        await base.OnConnectedAsync();
    }

    // On disconnect, remove from group
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.GetHttpContext()?.Request.Query["userId"].ToString();
        // var isAdmin = Context.GetHttpContext()?.Request.Query["isAdmin"].ToString();
        var role = Context.GetHttpContext()?.Request.Query["role"].ToString();

        if (!string.IsNullOrEmpty(role)) 
        {
            string groupName;
            if (role == "admin") { groupName = $"admin:{userId}";}
            else if (role == "instructor") { groupName = $"instructor:{userId}";}
            else { groupName = $"user:{userId}";}
            
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            Console.WriteLine($"User {userId} removed from group: {groupName}");
        }

        await base.OnDisconnectedAsync(exception);
    }

    // Fetch unread notifications for Admin or User
    public async Task FetchNotifications(string userId, string role)
    {
        List<string> notifications;

        if (role == "admin")
        {
            notifications = await _redisService.GetUnreadNotificationsForAdmin(userId);
        }
        else if (role == "instructor")
        {
            notifications = await _redisService.GetUnreadNotificationsForInstructor(userId);
        }
        else
        {
            notifications = await _redisService.GetUnreadNotificationsForUser(userId);
        }


        await Clients.Caller.SendAsync("ReceiveNotifications", notifications);
    }

    // Mark all notifications as read for Admin or User
    public async Task MarkAllAsRead(string userId, string role)
    {

        if (role == "admin")
        {
            await _redisService.MarkAllAsReadForAdmin(userId);
        }
        else if (role == "instructor")
        {
            await _redisService.MarkAllAsReadForInstructor(userId);
        }
        else
        {
            await _redisService.MarkAllAsReadForUser(userId);
        }
        // Send empty list to UI after marking as read
        await Clients.Caller.SendAsync("ReceiveNotifications", new List<string>());
    }
}

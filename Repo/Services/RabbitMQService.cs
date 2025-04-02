using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Text;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;


public class RabbitMQService
{
    private readonly IConnection _connection;
    private readonly IModel _channel;
    private readonly RedisService _redisService;
    private readonly IHubContext<NotificationHub> _hubContext;

    private const string AdminQueue = "admin_notifications";

    public RabbitMQService(RedisService redisService, IHubContext<NotificationHub> hubContext)
    {
        _redisService = redisService;
        _hubContext = hubContext;

        var factory = new ConnectionFactory() { HostName = "localhost" };
        _connection = factory.CreateConnection();
        _channel = _connection.CreateModel();

        // Ensure Admin queue exists
        EnsureQueueExists(AdminQueue);

    }

    public void InitializeQueues(List<string> users)
    {
        foreach (var userId in users)
        {
            EnsureQueueExists(GetUserQueueName(userId));
        }
    }

    public void CreateUserQueue(string userId)
    {
        EnsureQueueExists(GetUserQueueName(userId));
    }

    private void EnsureQueueExists(string queueName)
    {
        _channel.QueueDeclare(queue: queueName, durable: false, exclusive: false, autoDelete: false, arguments: null);
    }

    public void StartListening()
    {
        StartListeningToQueue(AdminQueue, role: "admin");

        // var users = GetAllUsers(); // Fetch all users
        // foreach (var userId in users)
        // {
        //     StartListeningToQueue(GetUserQueueName(userId), isAdminQueue: false);
        // }
    }

    private void StartListeningToQueue(string queueName, string role)
    {
        var consumer = new EventingBasicConsumer(_channel);
        consumer.Received += async (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            Console.WriteLine($"Received Notification from {queueName}: {message}");

            if (role == "admin")
            {
                // Store in Redis for admin users
                await _redisService.StoreNotificationForAdmin("A1", message);
                await _redisService.StoreNotificationForAdmin("A2", message);
                await _redisService.StoreNotificationForAdmin("A3", message);
                
                // Notify admin UI via SignalR
                Console.WriteLine("Sending New Notification to Admin: " + message);
                await _hubContext.Clients.All.SendAsync("NewAdminNotification", message);
            }
            else if (role == "instructor")
            {
                var instructorId = queueName.Replace("instructor_notifications_", "");
                
                // Store in Redis for the specific instructor
                await _redisService.StoreNotificationForInstructor(instructorId, message);
                
                // Notify user UI via SignalR
                Console.WriteLine("Sending New Notification to User: " + message);
                // await _hubContext.Clients.User(userId).SendAsync("NewUserNotification", message);
                await _hubContext.Clients.Group($"instructor:{instructorId}").SendAsync("NewInstructorNotification", message);
            } 
            else 
            {
                var userId = queueName.Replace("user_notifications_", "");
                
                // Store in Redis for the specific user
                await _redisService.StoreNotificationForUser(userId, message);
                
                // Notify user UI via SignalR
                Console.WriteLine("Sending New Notification to User: " + message);
                // await _hubContext.Clients.User(userId).SendAsync("NewUserNotification", message);
                await _hubContext.Clients.Group($"user:{userId}").SendAsync("NewUserNotification", message);
            } 
        };

        _channel.BasicConsume(queue: queueName, autoAck: true, consumer: consumer);
    }

    public void PublishNotification(string userId, string role, string message)
    {
        string queueName = "";
        if(role == "admin") 
        {
            queueName = AdminQueue;
        } 
        else if (role == "instructor")
        {
            queueName = GetInstructorQueueName(userId);
            _channel.QueueDeclare(queue: queueName, durable: false, exclusive: false, autoDelete: false, arguments: null);
            StartListeningToQueue(GetInstructorQueueName(userId), role: role);  
        }
        else 
        {
            queueName = GetUserQueueName(userId);
            _channel.QueueDeclare(queue: queueName, durable: false, exclusive: false, autoDelete: false, arguments: null);
            StartListeningToQueue(GetUserQueueName(userId), role: role);
        }

        var body = Encoding.UTF8.GetBytes(message);
        _channel.BasicPublish(exchange: "", routingKey: queueName, basicProperties: null, body: body);

        Console.WriteLine($"Notification sent to {queueName}: {message}");
    }

    private string GetUserQueueName(string userId)
    {
        return $"user_notifications_{userId}";
    }

    private string GetInstructorQueueName(string instructorId)
    {
        return $"instructor_notifications_{instructorId}";
    }

    private List<string> GetAllUsers()
    {
        // Fetch users from DB or another source
        return new List<string> { "U1", "U2", "U3","U6" };
    }
}

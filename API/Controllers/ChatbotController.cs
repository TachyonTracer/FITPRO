using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Repo;
using System.Collections.Generic;
using StackExchange.Redis;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatbotController : ControllerBase
    {
        private readonly IUserInterface _userRepo;
        private readonly IClassInterface _classRepo;
        private readonly IDatabase _redis;

        public ChatbotController(IUserInterface userRepo, IClassInterface classRepo, IConnectionMultiplexer redis)
        {
            _userRepo = userRepo;
            _classRepo = classRepo;
            _redis = redis.GetDatabase();
        }

        // Helper methods for Redis state
        private async Task SetUserIntentAsync(int userId, string intent)
            => await _redis.StringSetAsync($"chatbot:user:{userId}:intent", intent, TimeSpan.FromMinutes(10));
        private async Task<string> GetUserIntentAsync(int userId)
            => await _redis.StringGetAsync($"chatbot:user:{userId}:intent");
        private async Task ClearUserIntentAsync(int userId)
            => await _redis.KeyDeleteAsync($"chatbot:user:{userId}:intent");

        // DRY: Centralized API response handler
        private IActionResult ApiResponse(bool success, string message, object data = null, int statusCode = 200)
        {
            var result = new { success, message, data };
            return statusCode switch
            {
                200 => Ok(result),
                400 => BadRequest(result),
                404 => NotFound(result),
                500 => StatusCode(500, result),
                _ => StatusCode(statusCode, result)
            };
        }

        [HttpPost("Process")]
        public async Task<IActionResult> ProcessMessage([FromBody] ChatMessage message)
        {
            if (message == null || string.IsNullOrWhiteSpace(message.Message) || message.UserId <= 0)
                return ApiResponse(false, "Invalid input", statusCode: 400);

            try
            {
                var response = await ProcessUserInput(message.Message, message.UserId);
                return ApiResponse(true, "Response generated", new { response });
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "An error occurred while processing your request.", ex.Message, 500);
            }
        }

        // Encapsulate chatbot logic here for SOLID
        private async Task<string> ProcessUserInput(string message, int userId)
        {
            message = message?.ToLower() ?? "";

            // Handle greetings and reset intent if user says hi/hello/etc.
            if (message.Contains("hi") || message.Contains("hello") || message.Contains("hey"))
            {
                await ClearUserIntentAsync(userId);
                return "Hi! I can help you with booking classes, checking your schedule, or updating your profile. What would you like to do?";
            }

            // Always handle "my bookings" and similar queries first, even during cancel flow
            var bookedClasses = await _classRepo.GetBookedClassesByUserId(userId.ToString());
            if (message.Contains("schedule") || message.Contains("my classes") || message.Contains("my bookings") || message.Contains("bookings"))
            {
                await ClearUserIntentAsync(userId); // Reset any pending intent
                if (bookedClasses == null || bookedClasses.Count == 0)
                    return "You don't have any upcoming classes booked.";

                // Show up to 5 upcoming classes
                var upcoming = bookedClasses
                    .OrderBy(c => c.startDate)
                    .Take(5)
                    .Select(c => $"{c.className} on {c.startDate:MMM dd, yyyy}");

                return "Your booked classes:\n" + string.Join("\n", upcoming);
            }

            // Use Redis for user intent
            var lastIntent = await GetUserIntentAsync(userId);

            if (lastIntent == "awaiting_class_selection")
            {
                // Get classes once at the beginning
                var classes = await _classRepo.GetAllClasses();
                
                // Add this check for "more classes" request first
                if (message.Contains("more") && (message.Contains("class") || message.Contains("classes")))
                {
                    if (classes == null || !classes.Any())
                        return "Sorry, there are no more classes available to book.";
                    
                    // Show additional classes (different from the first set)
                    return "Here are more available classes: " +
                           string.Join(", ", classes.Skip(3).Take(5).Select(c => c.className)) +
                           ". Please type the class name you want to book.";
                }
                
                // Using the same classes variable from above
                var selectedClass = classes.FirstOrDefault(c => message.Contains(c.className.ToLower()));
                if (selectedClass != null)
                {
                    await SetUserIntentAsync(userId, $"awaiting_booking_confirmation:{selectedClass.classId}");
                    return $"You have selected '{selectedClass.className}'. Would you like to confirm your booking? (yes/no)";
                }
                else
                {
                    return "Sorry, I couldn't find that class. Please type the class name exactly as shown.";
                }
            }
            if (lastIntent != null && lastIntent.StartsWith("awaiting_booking_confirmation:"))
            {
                var classIdStr = lastIntent.Split(':').Last();
                if (message.Contains("yes"))
                {
                    int classId = int.Parse(classIdStr);
                    
                    // IMPORTANT FIX: Instead of using GetClassById which expects an instructor ID,
                    // use GetOne which retrieves a single class by its class ID
                    var classDetails = await _classRepo.GetOne(classId.ToString());
                    if (classDetails == null)
                        return "Sorry, I couldn't find details for this class.";
                    
                    // Create a redirect URL for the class details page
                    string detailsUrl = $"http://localhost:8081/User/Classdetails/{classId}";
                    
                    // Clear the intent since we're sending the user to the web UI
                    await ClearUserIntentAsync(userId);
                    
                    // Return a message with a link to view details and proceed with payment
                    return $"Great! To complete your booking for '{classDetails.className}', you'll need to make a payment of ₹{classDetails.fee}.\n\nPlease click here to proceed: {detailsUrl}\n\nAt the class details page, click 'Book Now' to complete your payment and booking.";
                }
                else if (message.Contains("no"))
                {
                    await ClearUserIntentAsync(userId);
                    return "Booking cancelled. Let me know if you want to book another class.";
                }
                else
                {
                    return "Please reply with 'yes' to confirm or 'no' to cancel.";
                }
            }

            // --- Cancel Booking Flow ---
            if (lastIntent == "awaiting_cancel_class_selection")
            {
                var selectedClass = bookedClasses.FirstOrDefault(c => message.Contains(c.className.ToLower()));
                if (selectedClass != null)
                {
                    await SetUserIntentAsync(userId, $"awaiting_cancel_confirmation:{selectedClass.classId}");
                    return $"You have selected '{selectedClass.className}' to cancel. Would you like to confirm cancellation? (yes/no)";
                }
                else
                {
                    return "Sorry, I couldn't find that class in your bookings. Please type the class name exactly as shown.";
                }
            }
            if (lastIntent != null && lastIntent.StartsWith("awaiting_cancel_confirmation:"))
            {
                var classIdStr = lastIntent.Split(':').Last();
                if (message.Contains("yes"))
                {
                    int classId = int.Parse(classIdStr);
                    var cancelResult = await _classRepo.CancelBooking(userId, classId);
                    await ClearUserIntentAsync(userId);
                    if (cancelResult.success)
                        return $"Your booking has been cancelled. {cancelResult.message}";
                    else
                        return $"Sorry, cancellation failed: {cancelResult.message}";
                }
                else if (message.Contains("no"))
                {
                    await ClearUserIntentAsync(userId);
                    return "Cancellation aborted. Let me know if you want to cancel another class.";
                }
                else
                {
                    return "Please reply with 'yes' to confirm or 'no' to abort cancellation.";
                }
            }

            // --- Trigger cancel flow ---
            if (message.Contains("cancel"))
            {
                if (bookedClasses == null || bookedClasses.Count == 0)
                    return "You don't have any classes to cancel.";
                await SetUserIntentAsync(userId, "awaiting_cancel_class_selection");
                return "Which class would you like to cancel? Your booked classes: " +
                       string.Join(", ", bookedClasses.Take(5).Select(c => c.className));
            }

            if (message.Contains("cancel") || message.Contains("exit"))
            {
                await ClearUserIntentAsync(userId);
                return "Okay, I've cancelled the current operation. What would you like to do next?";
            }

            if (message.Contains("book") && message.Contains("class"))
            {
                var classes = await _classRepo.GetAllClasses();
                if (classes == null || !classes.Any())
                    return "Sorry, there are no available classes to book at the moment.";
                await SetUserIntentAsync(userId, "awaiting_class_selection");
                return "I can help you book a class. Here are some available classes: " +
                       string.Join(", ", classes.Take(3).Select(c => c.className)) +
                       ". Please type the class name you want to book, or type 'more classes' to see additional options.";
            }

            if (message.Contains("profile"))
            {
                var user = await _userRepo.GetUserByIdAsync(userId);
                if (user == null)
                    return "User profile not found.";
                return $"Your profile: Name: {user.userName}, Goal: {user.goal}. Would you like to update any information?";
            }

            return "I can help you with booking classes, checking your schedule, or updating your profile. What would you like to do?";
        }
    }

    // DTO for chatbot messages
   
}
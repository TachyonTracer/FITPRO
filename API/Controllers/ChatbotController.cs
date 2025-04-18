using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Repo;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatbotController : ControllerBase
    {
        private readonly IUserInterface _userRepo;
        private readonly IClassInterface _classRepo;

        public ChatbotController(IUserInterface userRepo, IClassInterface classRepo)
        {
            _userRepo = userRepo;
            _classRepo = classRepo;
        }

        [HttpPost("Process")]
        public async Task<IActionResult> ProcessMessage([FromBody] ChatMessage message)
        {
            try
            {
                var response = await ProcessUserInput(message.Message, message.UserId);
                return Ok(new { success = true, response = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        private async Task<string> ProcessUserInput(string message, int userId)
        {
            message = message.ToLower();

            if (message.Contains("book") && message.Contains("class"))
            {
                var classes = await _classRepo.GetAllClasses();
                return "I can help you book a class. Here are some available classes: " + 
                       string.Join(", ", classes.Take(3).Select(c => c.className));
            }
            
            if (message.Contains("schedule") || message.Contains("my classes"))
            {
                var bookedClasses = await _classRepo.GetBookedClassesByUserId(userId.ToString());
                if (bookedClasses.Count == 0)
                    return "You don't have any upcoming classes scheduled.";
                
                return "Your next class is: " + bookedClasses[0].className + 
                       " on " + bookedClasses[0].startDate.ToString("MMM dd, yyyy");
            }

            if (message.Contains("profile"))
            {
                var user = await _userRepo.GetUserByIdAsync(userId);
                return $"Your profile: Name: {user.userName}, Goal: {user.goal}. Would you like to update any information?";
            }

            return "I can help you with booking classes, checking your schedule, or updating your profile. What would you like to do?";
        }
    }

    public class ChatMessage
    {
        public string Message { get; set; }
        public int UserId { get; set; }
    }
}
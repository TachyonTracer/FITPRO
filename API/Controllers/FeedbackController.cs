using Microsoft.AspNetCore.Mvc;
using Repo; // Changed from Repo.Models
// Remove Repositories.Interfaces as it's not needed

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackInterface _feedbackRepo; // Changed from IFeedbackInterface

        public FeedbackController(IFeedbackInterface feedbackRepo) // Changed from IFeedbackInterface
        {
            _feedbackRepo = feedbackRepo;
        }

        // Add feedback for instructor
        [HttpPost("instructor")]
        public IActionResult AddInstructorFeedback([FromBody] InstructorFeedback feedback)
        {
            feedback.createdAt = DateTime.UtcNow;

            var result = _feedbackRepo.AddInstructorFeedback(feedback);
            if (result)
                return Ok(new { success = true, message = "Instructor feedback submitted." });

            return BadRequest(new { success = false, message = "Failed to submit instructor feedback." });
        }

        // Add feedback for class (only if user joined class)
        [HttpPost("class")]
        public IActionResult AddClassFeedback([FromBody] ClassFeedback feedback)
        {
            if (!_feedbackRepo.HasUserJoinedClass(feedback.userId, feedback.classId))
            {
                return BadRequest(new { success = false, message = "You cannot submit feedback without joining the class." });
            }

            feedback.createdAt = DateTime.UtcNow;

            var result = _feedbackRepo.AddClassFeedback(feedback);
            if (result)
                return Ok(new { success = true, message = "Class feedback submitted." });

            return BadRequest(new { success = false, message = "Failed to submit class feedback." });
        }

        // Get all feedbacks for a specific instructor
        [HttpGet("instructor/{instructorId}")]
        public IActionResult GetInstructorFeedbacks(int instructorId)
        {
            var feedbacks = _feedbackRepo.GetInstructorFeedbacksByInstructorId(instructorId);
            
            if (feedbacks == null || !feedbacks.Any())
            {
                return NotFound(new { 
                    success = false, 
                    message = "No feedbacks found for this instructor" 
                });
            }

            return Ok(new { 
                success = true, 
                message = "Instructor feedbacks fetched successfully", 
                data = feedbacks 
            });
        }

        // Get all feedbacks for a specific class
        [HttpGet("class/{classId}")]
        public IActionResult GetClassFeedbacks(int classId)
        {
            try
            {
                var feedbacks = _feedbackRepo.GetClassFeedbacksByClassId(classId);
                
                if (feedbacks == null)
                {
                    return StatusCode(500, new { 
                        success = false, 
                        message = "Error retrieving feedbacks" 
                    });
                }

                if (!feedbacks.Any())
                {
                    return NotFound(new { 
                        success = false, 
                        message = $"No feedbacks found for class ID: {classId}" 
                    });
                }

                return Ok(new { 
                    success = true, 
                    message = "Class feedbacks fetched successfully", 
                    data = feedbacks 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    message = $"Internal server error: {ex.Message}" 
                });
            }
        }
    }
}

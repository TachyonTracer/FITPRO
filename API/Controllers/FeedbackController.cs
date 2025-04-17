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

        #region AddClassFeedback

        // Add feedback for class (only if user joined class)
        [HttpPost("class")]
        public IActionResult AddClassFeedback([FromBody] ClassFeedback feedback)
        {
            if (feedback == null)
            {
                return BadRequest(new { success = false, message = "Invalid feedback data." });
            }

            if (!_feedbackRepo.HasUserJoinedClass(feedback.userId, feedback.classId))
            {
                return BadRequest(new
                {
                    success = false,
                    message = "You cannot submit feedback without joining the class."
                });
            }

            feedback.createdAt = DateTime.UtcNow;

            var result = _feedbackRepo.AddClassFeedback(feedback);

            if (result > 0)
            {
                // Successful insertion, result contains the new feedback ID
                return Ok(new
                {
                    success = true,
                    message = "Class feedback submitted successfully.",
                    feedbackId = result
                });
            }
            else if (result == -1)
            {
                // User already submitted feedback
                return BadRequest(new
                {
                    success = false,
                    message = "You have already provided feedback for this class."
                });
            }
            else
            {
                // Other error occurred
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to submit class feedback due to a server error."
                });
            }
        }

        #endregion

        // Get all feedbacks for a specific instructor
        [HttpGet("instructor/{instructorId}")]
        public IActionResult GetInstructorFeedbacks(int instructorId)
        {
            var feedbacks = _feedbackRepo.GetInstructorFeedbacksByInstructorId(instructorId);

            if (feedbacks == null || !feedbacks.Any())
            {
                return NotFound(new
                {
                    success = false,
                    message = "No feedbacks found for this instructor"
                });
            }

            return Ok(new
            {
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
                    return StatusCode(500, new
                    {
                        success = false,
                        message = "Error retrieving feedbacks"
                    });
                }

                if (!feedbacks.Any())
                {
                    return NotFound(new
                    {
                        success = false,
                        message = $"No feedbacks found for class ID: {classId}"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Class feedbacks fetched successfully",
                    data = feedbacks
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Internal server error: {ex.Message}"
                });
            }
        }

        [HttpGet("class/instructor/{instructorId}")]
        public IActionResult GetAllClassFeedbacksByInstructor(int instructorId)
        {
            var feedbacks = _feedbackRepo.GetClassFeedbacksByInstructorId(instructorId);
            return Ok(new { success = true, message = "Feedbacks fetched", data = feedbacks });
        }

        [HttpGet("class/{classId}/rating/{rating}")]
        public IActionResult GetClassFeedbacksByRating(int classId, int rating)
        {
            var all = _feedbackRepo.GetClassFeedbacksByClassId(classId);
            var filtered = all.Where(f => f.rating == rating).ToList();
            return Ok(new { success = true, message = $"Filtered feedbacks for rating {rating}", data = filtered });
        }

    }
}

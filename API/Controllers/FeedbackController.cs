using Microsoft.AspNetCore.Mvc;
using Repo;
using System;
using System.Linq;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackInterface _feedbackRepo;

        public FeedbackController(IFeedbackInterface feedbackRepo)
        {
            _feedbackRepo = feedbackRepo;
        }

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

        #region Instructor Feedback

        [HttpPost("instructor")]
        public IActionResult AddInstructorFeedback([FromBody] InstructorFeedback feedback)
        {
            if (feedback == null)
                return ApiResponse(false, "Invalid feedback data.", null, 400);

            feedback.createdAt = DateTime.UtcNow;
            var result = _feedbackRepo.AddInstructorFeedback(feedback);

            return result
                ? ApiResponse(true, "Instructor feedback submitted.")
                : ApiResponse(false, "Failed to submit instructor feedback.", null, 500);
        }

        [HttpGet("instructor/{instructorId}")]
        public IActionResult GetInstructorFeedbacks(int instructorId)
        {
            var feedbacks = _feedbackRepo.GetInstructorFeedbacksByInstructorId(instructorId);

            if (feedbacks == null)
                return ApiResponse(false, "Error retrieving feedbacks", null, 500);

            if (!feedbacks.Any())
                return ApiResponse(false, "No feedbacks found for this instructor", null, 404);

            return ApiResponse(true, "Instructor feedbacks fetched successfully", feedbacks);
        }

        #endregion

        #region Class Feedback

        [HttpPost("class")]
        public IActionResult AddClassFeedback([FromBody] ClassFeedback feedback)
        {
            if (feedback == null)
                return ApiResponse(false, "Invalid feedback data.", null, 400);

            if (!_feedbackRepo.HasUserJoinedClass(feedback.userId, feedback.classId))
                return ApiResponse(false, "You cannot submit feedback without joining the class.", null, 400);

            feedback.createdAt = DateTime.UtcNow;
            var result = _feedbackRepo.AddClassFeedback(feedback);

            if (result > 0)
                return ApiResponse(true, "Class feedback submitted successfully.", new { feedbackId = result });

            if (result == -1)
                return ApiResponse(false, "You have already provided feedback for this class.", null, 400);

            return ApiResponse(false, "Failed to submit class feedback due to a server error.", null, 500);
        }

        [HttpGet("class/{classId}")]
        public IActionResult GetClassFeedbacks(int classId)
        {
            try
            {
                var feedbacks = _feedbackRepo.GetClassFeedbacksByClassId(classId);

                if (feedbacks == null)
                    return ApiResponse(false, "Error retrieving feedbacks", null, 500);

                if (!feedbacks.Any())
                    return ApiResponse(false, $"No feedbacks found for class ID: {classId}", null, 404);

                return ApiResponse(true, "Class feedbacks fetched successfully", feedbacks);
            }
            catch (Exception ex)
            {
                return ApiResponse(false, $"Internal server error: {ex.Message}", null, 500);
            }
        }

        [HttpGet("class/instructor/{instructorId}")]
        public IActionResult GetAllClassFeedbacksByInstructor(int instructorId)
        {
            var feedbacks = _feedbackRepo.GetClassFeedbacksByInstructorId(instructorId);
            return ApiResponse(true, "Feedbacks fetched", feedbacks);
        }

        [HttpGet("class/{classId}/rating/{rating}")]
        public IActionResult GetClassFeedbacksByRating(int classId, int rating)
        {
            var all = _feedbackRepo.GetClassFeedbacksByClassId(classId);
            var filtered = all.Where(f => f.rating == rating).ToList();
            return ApiResponse(true, $"Filtered feedbacks for rating {rating}", filtered);
        }

        #endregion
    }
}

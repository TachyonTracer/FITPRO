using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Repo;

namespace API
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailApiController : ControllerBase
    {
        private readonly IEmailInterface _emailRepo;
        public EmailApiController(IEmailInterface emailRepo)
        {
            _emailRepo = emailRepo;
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

        #region Email API

        [HttpPost("SendSuccessResetPasswordEmail")]
        public async Task<IActionResult> SendSuccessResetPasswordEmail([FromForm] string username, [FromForm] string email)
        {
            try
            {
                await _emailRepo.sendSuccessResetPwdEmail(username, email);
                return ApiResponse(true, "Password Reset Successfully !!");
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "Failed to send password reset email: " + ex.Message, null, 500);
            }
        }

        [HttpPost("SendOtpEmail")]
        public async Task<IActionResult> SendOtpEmail([FromForm] string username, [FromForm] string email, [FromForm] string otp)
        {
            try
            {
                await _emailRepo.SendOtpEmail(username, email, otp);
                return ApiResponse(true, "OTP Email Sent Successfully!");
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "Failed to send OTP email: " + ex.Message, null, 500);
            }
        }

        [HttpPost("SendActivationEmail")]
        public async Task<IActionResult> SendActivationEmail([FromForm] string username, [FromForm] string email, [FromForm] string activationUrl)
        {
            try
            {
                await _emailRepo.SendActivationLink(email, username, activationUrl);
                return ApiResponse(true, "Activation Email Sent Successfully!");
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "Failed to send activation email: " + ex.Message, null, 500);
            }
        }

        #endregion

        #region Instructor approval email 
        [HttpPost("SendApproveInstructorEmail")]
        public async Task<IActionResult> SendApproveInstructorEmail([FromForm] string username, [FromForm] string email)
        {
            try
            {
                await _emailRepo.SendApproveInstructorEmail(email, username);
                return ApiResponse(true, "Instructor approval Email Sent Successfully!");
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "Failed to send instructor approval email: " + ex.Message, null, 500);
            }
        }
        #endregion

        #region Instructor disapproval email 
        [HttpPost("SendDisapproveInstructorEmail")]
        public async Task<IActionResult> SendDisapproveInstructorEmail([FromForm] string username, [FromForm] string email, [FromForm] string reason)
        {
            try
            {
                await _emailRepo.SendDisapproveInstructorEmail(email, username, reason);
                return ApiResponse(true, "Instructor disapproval Email Sent Successfully!");
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "Failed to send instructor disapproval email: " + ex.Message, null, 500);
            }
        }
        #endregion

        #region Instructor suspend email 
        [HttpPost("SendSuspendInstructorEmail")]
        public async Task<IActionResult> SendSuspendInstructorEmail([FromForm] string username, [FromForm] string email, [FromForm] string reason)
        {
            try
            {
                await _emailRepo.SendSuspendInstructorEmail(email, username, reason);
                return ApiResponse(true, "Instructor suspend Email Sent Successfully!");
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "Failed to send instructor suspend email: " + ex.Message, null, 500);
            }
        }
        #endregion

        #region User suspend email 
        [HttpPost("SendSuspendUserEmail")]
        public async Task<IActionResult> SendSuspendUserEmail([FromForm] string username, [FromForm] string email, [FromForm] string reason)
        {
            try
            {
                await _emailRepo.SendSuspendUserEmail(email, username, reason);
                return ApiResponse(true, "User suspend Email Sent Successfully!");
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "Failed to send user suspend email: " + ex.Message, null, 500);
            }
        }
        #endregion

        #region Instructor activate email 
        [HttpPost("SendActivateInstructorEmail")]
        public async Task<IActionResult> SendActivateInstructorEmail([FromForm] string username, [FromForm] string email)
        {
            try
            {
                await _emailRepo.SendActivateInstructorEmail(email, username);
                return ApiResponse(true, "Instructor activate Email Sent Successfully!");
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "Failed to send instructor activate email: " + ex.Message, null, 500);
            }
        }
        #endregion

        #region User activate email 
        [HttpPost("SendActivateUserEmail")]
        public async Task<IActionResult> SendActivateUserEmail([FromForm] string username, [FromForm] string email)
        {
            try
            {
                await _emailRepo.SendActivateUserEmail(email, username);
                return ApiResponse(true, "User activate Email Sent Successfully!");
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "Failed to send user activate email: " + ex.Message, null, 500);
            }
        }
        #endregion

        #region Booking confirmation email
        [HttpPost("SendBookingConfirmationEmail")]
        public async Task<IActionResult> SendBookingConfirmationEmail([FromForm] string username, [FromForm] string email, [FromForm] string bookingDetails)
        {
            try
            {
                await _emailRepo.SendBookingConfirmationEmail(email, username, bookingDetails);
                return ApiResponse(true, "Booking confirmation Email Sent Successfully!");
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "Failed to send booking confirmation email: " + ex.Message, null, 500);
            }
        }
        #endregion
    }
}
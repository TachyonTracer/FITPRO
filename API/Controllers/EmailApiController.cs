using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
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

        #region Email API
        
        // Send SuccessResetPassword Email
        [HttpPost]
        [Route("SendSuccessResetPasswordEmail")]
        public IActionResult sendSuccessResetPasswordEmail([FromForm] string username, string email)
        {
            _emailRepo.sendSuccessResetPwdEmail(username, email);

            return Ok(new { success = true, message = "Password Reset Successfully !!" });
        }

        [HttpPost]
        [Route("SendOtpEmail")]
        public async Task<IActionResult> SendOtpEmail([FromForm] string username, [FromForm] string email, [FromForm] string otp)
        {
            try
            {
                await _emailRepo.SendOtpEmail(username, email, otp);
                return Ok(new { success = true, message = "OTP Email Sent Successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Failed to send OTP email: " + ex.Message });
            }
        }

        [HttpPost]
        [Route("SendActivationEmail")]
        public async Task<IActionResult> SendActivationEmail([FromForm] string username, [FromForm] string email, [FromForm] string activationUrl)
        {
            try
            {
                await _emailRepo.SendActivationLink(email,username, activationUrl);
                return Ok(new { success = true, message = "Activation Email Sent Successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Failed to send activation email: " + ex.Message });
            }
        }
        #endregion

        #region Instructor approval email 
        [HttpPost]
        [Route("SendApproveInstructorEmail")]
        public async Task<IActionResult> SendApproveInstructorEmail([FromForm] string username, [FromForm] string email)
        {
            try
            {
                await _emailRepo.SendApproveInstructorEmail(email,username);
                return Ok(new { success = true, message = "Instrucotr approval Email Sent Successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Failed to send instrucotr approval email: " + ex.Message });
            }
        }
        #endregion

        #region Instructor disapproval email 
        [HttpPost]
        [Route("SendDisapproveInstructorEmail")]
        public async Task<IActionResult> SendDisapproveInstructorEmail([FromForm] string username, [FromForm] string email , [FromForm] string reason)
        {
            try
            {
                await _emailRepo.SendDisapproveInstructorEmail(email,username,reason);
                return Ok(new { success = true, message = "Instrucotr disapproval Email Sent Successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Failed to send instrucotr disapproval email: " + ex.Message });
            }
        }
        #endregion

          #region Instructor suspend email 
        [HttpPost]
        [Route("SendSuspendInstructorEmail")]
        public async Task<IActionResult> SendSuspendInstructorEmail([FromForm] string username, [FromForm] string email , [FromForm] string reason)
        {
            try
            {
                await _emailRepo.SendSuspendInstructorEmail(email,username,reason);
                return Ok(new { success = true, message = "Instrucotr Suspend Email Sent Successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Failed to send instrucotr suspend email: " + ex.Message });
            }
        }
        #endregion

        #region User Suspend email 
        [HttpPost]
        [Route("SendSuspendUserEmail")]
        public async Task<IActionResult> SendSuspendUserEmail([FromForm] string username, [FromForm] string email , [FromForm] string reason)
        {
            try
            {
                await _emailRepo.SendSuspendUserEmail(email,username,reason);
                return Ok(new { success = true, message = "User Suspend Email Sent Successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Failed to send user suspend email: " + ex.Message });
            }
        }
        #endregion

        #region Instructor Activate email 
        [HttpPost]
        [Route("SendActivateInstructorEmail")]
        public async Task<IActionResult> SendActivateInstructorEmail([FromForm] string username, [FromForm] string email)
        {
            try
            {
                await _emailRepo.SendApproveInstructorEmail(email,username);
                return Ok(new { success = true, message = "Instrucotr activate Email Sent Successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Failed to send instrucotr activate  email: " + ex.Message });
            }
        }
        #endregion

        #region User Activate email 
        [HttpPost]
        [Route("SendActivateUserEmail")]
        public async Task<IActionResult> SendActivateUserEmail([FromForm] string username, [FromForm] string email)
        {
            try
            {
                await _emailRepo.SendApproveInstructorEmail(email,username);
                return Ok(new { success = true, message = "User activate Email Sent Successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Failed to send user activate  email: " + ex.Message });
            }
        }
        #endregion


    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repo;


namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailApiController : ControllerBase
    {
        private readonly IEmailInterface _emailInterface;
        public EmailApiController(IEmailInterface emailInterface)
        {
            _emailInterface = emailInterface;

        }

        // Send SuccessResetPassword Email
        [HttpPost]
        [Route("SendSuccessResetPasswordEmail")]
        public IActionResult sendSuccessResetPasswordEmail([FromForm] string username, string email)
        {
            _emailInterface.sendSuccessResetPwdEmail(username, email);

            return Ok(new { success = true, message = "Password Reset Successfully !!" });
        }

        [HttpPost]
        [Route("SendOtpEmail")]
        public async Task<IActionResult> SendOtpEmail([FromForm] string username, [FromForm] string email, [FromForm] string otp)
        {
            try
            {
                await _emailInterface.SendOtpEmail(username, email, otp);
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
                await _emailInterface.SendActivationLink(email,username, activationUrl);
                return Ok(new { success = true, message = "Activation Email Sent Successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Failed to send activation email: " + ex.Message });
            }
        }




    }
}
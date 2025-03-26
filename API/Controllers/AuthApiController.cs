using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Repo;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthApiController : ControllerBase
    {
        private readonly IAuthInterface _authService;

        public AuthApiController(IAuthInterface authService)
        {
            _authService = authService;
        }

        #region DispatchOTP
        [HttpPost("Dispatch-otp")]
        public async Task<IActionResult> DispatchOtp([FromBody] VerifyEmail request)
        {
            int result = await _authService.dispatchOtp(request.email);

            if (result == 1)
            {
                return Ok(new { success = true, message = "OTP sent successfully." });
            }
            else
            {
                return Ok(new { success = false, message = "Email not registered." });
            }
        }
        #endregion

        #region Verify OTP
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyEmail request)
        {
            int result = await _authService.verifyOtp(request.email, Convert.ToInt32(request.OTP));

            if (result == 1)
            {
                return Ok(new { success = true, message = "OTP verified successfully." });
            }
            else if (result == 0)
            {
                return Ok(new { success = false, message = "Email not registered." });
            }
            else if (result == -1)
            {
                return Ok(new { success = false, message = "No OTP found for this user." });
            }
            else if (result == -2)
            {
                return Ok(new { success = false, message = "Incorrect OTP." });
            }
            else if (result == -3)
            {
                return Ok(new { success = false, message = "OTP expired." });
            }
            else
            {
                return Ok(new { success = false, message = "An unexpected error occurred." });
            }
        }
        #endregion

        #region Update Password

        [HttpPost("update-password")]
        public async Task<IActionResult> UpdatePassword([FromBody] VerifyEmail request)
        {
            int result = await _authService.updatePassword(request.email, request.newPassword, Convert.ToInt32(request.OTP));

            if (result == 1)
            {
                return Ok(new { success = true, message = "Password updated successfully." });
            }
            else if (result == -1)
            {
                return Ok(new { success = false, message = "Email not registered." });
            }
            else if (result == -2)
            {
                return Ok(new { success = false, message = "No OTP found." });
            }
            else if (result == -3)
            {
                return Ok(new { success = false, message = "Incorrect OTP." });
            }
            else if (result == -4)
            {
                return Ok(new { success = false, message = "OTP expired." });
            }
            else
            {
                return Ok(new { success = false, message = "An unexpected error occurred." });
            }
        }
        #endregion
    }



}

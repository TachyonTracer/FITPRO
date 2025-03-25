using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

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


        [HttpPost("dispatch-otp")]
        public async Task<IActionResult> DispatchOtp(string email)
        {
            int result = await _authService.dispatchOtp(email);
            return result == 1 ? Ok(new { message = "OTP sent successfully." }) : NotFound(new { message = "Email not registered." });
        }

  
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp(string email, int OTP)
        {
            int result = await _authService.verifyOtp(email, OTP);

            return result switch
            {
                1 => Ok(new { message = "OTP verified successfully." }),
                0 => NotFound(new { message = "Email not registered." }),
                -1 => BadRequest(new { message = "No OTP found for this user." }),
                -2 => BadRequest(new { message = "Incorrect OTP." }),
                -3 => BadRequest(new { message = "OTP expired." }),
                _ => StatusCode(500, new { message = "An unexpected error occurred." })
            };
        }

        
        [HttpPost("update-password")]
        public async Task<IActionResult> UpdatePassword(string email, string NewPassword, int OTP)
        {
            int result = await _authService.updatePassword(email, NewPassword, OTP);

            return result switch
            {
                1 => Ok(new { message = "Password updated successfully." }),
                -1 => NotFound(new { message = "Email not registered." }),
                -2 => BadRequest(new { message = "No OTP found." }),
                -3 => BadRequest(new { message = "Incorrect OTP." }),
                -4 => BadRequest(new { message = "OTP expired." }),
                -5 => StatusCode(500, new { message = "Failed to update password." }),
                _ => StatusCode(500, new { message = "An unexpected error occurred." })
            };
        }
    }


}
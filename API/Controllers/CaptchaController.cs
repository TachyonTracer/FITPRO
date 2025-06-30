using System.Collections.Concurrent;
using System.Drawing;
using System.Drawing.Imaging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repo;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class CaptchaApiController : ControllerBase
    {
        private static readonly ConcurrentDictionary<string, string> captchaStore = new();

        // DRY: Centralized API response handler
        private IActionResult ApiResponse(bool success, string message, object data = null, int statusCode = 200)
        {
            var result = new { success, message, data };
            return statusCode switch
            {
                200 => Ok(result),
                400 => BadRequest(result),
                404 => NotFound(result),
                _ => StatusCode(statusCode, result)
            };
        }

        [HttpGet("GetCaptchaImage")]
        public IActionResult GetCaptchaImage()
        {
            try
            {
                string captchaText = GenerateRandomText(5);
                string captchaId = Guid.NewGuid().ToString();
                captchaStore[captchaId] = captchaText;

                var base64Image = GenerateCaptchaImageBase64(captchaText);

                return ApiResponse(true, "Captcha generated", new { captchaId, image = $"data:image/png;base64,{base64Image}" });
            }
            catch (Exception ex)
            {
                return ApiResponse(false, "Failed to generate captcha", ex.Message, 500);
            }
        }

        [HttpPost("ValidateCaptcha")]
        public IActionResult ValidateCaptcha([FromBody] CaptchaRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.CaptchaId) || string.IsNullOrEmpty(request.UserInput))
                return ApiResponse(false, "Invalid request", statusCode: 400);

            if (captchaStore.TryGetValue(request.CaptchaId, out var storedCaptcha))
            {
                captchaStore.TryRemove(request.CaptchaId, out _); // Remove after validation

                if (request.UserInput.Trim().ToUpper() == storedCaptcha.ToUpper())
                    return ApiResponse(true, "CAPTCHA verified successfully.");

                return ApiResponse(false, "Incorrect CAPTCHA.", statusCode: 400);
            }

            return ApiResponse(false, "Invalid or expired CAPTCHA.", statusCode: 400);
        }

        // --- Private helpers ---

        private string GenerateRandomText(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        private string GenerateCaptchaImageBase64(string captchaText)
        {
            using var bitmap = new Bitmap(150, 50);
            using var graphics = Graphics.FromImage(bitmap);
            graphics.Clear(Color.LightGray);

            using var font = new Font("Arial", 20, FontStyle.Bold);
            using var brush = new SolidBrush(Color.Black);
            graphics.DrawString(captchaText, font, brush, 20, 10);

            using var memoryStream = new MemoryStream();
            bitmap.Save(memoryStream, ImageFormat.Png);
            var byteArray = memoryStream.ToArray();
            return Convert.ToBase64String(byteArray);
        }
    }
}


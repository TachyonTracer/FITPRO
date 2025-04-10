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
        private static ConcurrentDictionary<string, string> captchaStore = new();

        [HttpGet("GetCaptchaImage")]
        public IActionResult GetCaptchaImage()
        {
            string captchaText = GenerateRandomText(5);
            Console.WriteLine(captchaText);
            string captchaId = Guid.NewGuid().ToString(); // Unique ID for CAPTCHA
            captchaStore[captchaId] = captchaText; // Store CAPTCHA text

            using var bitmap = new Bitmap(150, 50);
            using var graphics = Graphics.FromImage(bitmap);
            graphics.Clear(Color.LightGray);

            using var font = new Font("Arial", 20, FontStyle.Bold);
            using var brush = new SolidBrush(Color.Black);
            graphics.DrawString(captchaText, font, brush, 20, 10);

            using var memoryStream = new MemoryStream();
            bitmap.Save(memoryStream, ImageFormat.Png);
            var byteArray = memoryStream.ToArray();
            var base64Image = Convert.ToBase64String(byteArray);

            return Ok(new { captchaId, image = $"data:image/png;base64,{base64Image}" });
        }

        private string GenerateRandomText(int length)
        {
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            char[] result = new char[length];
            for (int i = 0; i < length; i++)
            {
                result[i] = chars[random.Next(chars.Length)];
            }
            return new string(result);
        }


        [HttpPost("ValidateCaptcha")]
        public IActionResult ValidateCaptcha([FromBody] CaptchaRequest request)
        {
            if (captchaStore.TryGetValue(request.CaptchaId, out var storedCaptcha))
            {
                captchaStore.TryRemove(request.CaptchaId, out _); // Remove after validation

                if (request.UserInput.ToUpper() == storedCaptcha.ToUpper())
                    return Ok("CAPTCHA verified successfully.");
            }

            return BadRequest("Invalid or expired CAPTCHA.");
        }

    }
}

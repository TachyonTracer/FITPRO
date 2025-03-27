using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
namespace Repo;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserInterface _userRepo;

    public UserController(IUserInterface userRepo)
    {
        _userRepo = userRepo;
    }

    // Update profile with image upload
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromForm] User user)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Handle profile image upload
            if (user.profileImageFile != null && user.profileImageFile.Length > 0)
            {
                var fileName = user.email + Path.GetExtension(user.profileImageFile.FileName);
                var filePath = Path.Combine("../MVC/wwwroot/User_Images", fileName);
                
                // Create directory if it doesn't exist
                Directory.CreateDirectory(Path.Combine("../MVC/wwwroot/User_Images"));
                
                user.profileImage = fileName;
                
                // Save the image to the server
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await user.profileImageFile.CopyToAsync(stream);
                }
            }

            // Update the user's profile information
            bool success = await _userRepo.UpdateUserProfileAsync(user);

            if (!success)
            {
                return NotFound("User not found or update failed");
            }

            return Ok(new { message = "Profile updated successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }
}

using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Repo;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthApiController : ControllerBase
    {
        private readonly IConfiguration _myConfig;
        private readonly IAuthInterface _auth;

        public AuthApiController(IConfiguration myConfig, IAuthInterface auth)
        {
            _myConfig = myConfig;
            _auth = auth;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginVM userCredentials)
        {
            try
            {
                if (userCredentials == null ||
                    string.IsNullOrEmpty(userCredentials.email) ||
                    string.IsNullOrEmpty(userCredentials.password) ||
                    string.IsNullOrEmpty(userCredentials.role))
                {
                    return BadRequest(new { success = false, message = "Invalid login credentials." });
                }

                object user;

                if (userCredentials.role.ToLower() == "user")
                {
                    var userObj = await _auth.LoginUser(userCredentials);
                    if (userObj == null)
                    {
                        return Unauthorized(new { success = false, message = "Invalid email or password." });
                    }
                    if (!userObj.status)
                    {
                        return Unauthorized(new { success = false, message = "Please activate your account." });
                    }
                    user = userObj;
                }
                else if (userCredentials.role.ToLower() == "instructor")
                {
                    var instructorObj = await _auth.LoginInstructor(userCredentials);
                    if (instructorObj == null)
                    {
                        return Unauthorized(new { success = false, message = "Invalid email or password." });
                    }

                    if (instructorObj.status == "Pending" || instructorObj.status == "Inactive")
                    {
                        return Unauthorized(new { success = false, message = "Wait for admin approval." });
                    }

                    user = instructorObj;
                }
                else if (userCredentials.role.ToLower() == "admin")
                {
                    var adminObj = await _auth.LoginAdmin(userCredentials); // Fetch admin from DB
                    if (adminObj == null)
                    {
                        return Unauthorized(new { success = false, message = "Invalid admin credentials." });
                    }
                    else
                    {
                        user = adminObj;
                    }
                }
                else
                {
                    return BadRequest(new { success = false, message = "Invalid role specified." });
                }

                // If we reach here, user is authenticated
                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, _myConfig["Jwt:Subject"]),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim("UserObject", System.Text.Json.JsonSerializer.Serialize(user))
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_myConfig["Jwt:Key"]));
                var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(
                    _myConfig["Jwt:Issuer"],
                    _myConfig["Jwt:Audience"],
                    claims,
                    expires: DateTime.UtcNow.AddDays(1),
                    signingCredentials: signIn
                );
                return Ok(new { success = true, message = "Login Successful", token = new JwtSecurityTokenHandler().WriteToken(token) });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Login Failed: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Internal server error." });
            }
        }
    }
}

using System.Text.Json;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using System.ComponentModel;

namespace Repo;
public class VerifyEmail
{
    public string? email { get; set; }
    public string? newPassword { get; set; }
    public int? OTP { get; set; }
}

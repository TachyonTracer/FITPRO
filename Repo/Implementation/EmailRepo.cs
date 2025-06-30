using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace Repo
{
    public class EmailRepo : IEmailInterface
    {
        private readonly string smtpServer;
        private readonly string Username;
        private readonly string Password;
        private readonly int Port;
        private readonly string _ConnectionString;

        public EmailRepo(IConfiguration configuration)
        {
            _ConnectionString = configuration.GetConnectionString("DefaultConnection");
            smtpServer = configuration["Smtp:smtpServer"];
            Port = Convert.ToInt32(configuration["Smtp:Port"]);
            Username = configuration["Smtp:Username"];
            Password = configuration["Smtp:Password"];
        }

        // DRY: Centralized template path resolver
        private string GetTemplatePath(string templateFileName)
        {
            var possiblePaths = new[]
            {
                Path.Combine("/app", "API", "Templates", templateFileName),
                Path.Combine(AppContext.BaseDirectory, "Templates", templateFileName),
                Path.Combine(Directory.GetCurrentDirectory(), "Templates", templateFileName),
                Path.Combine(Directory.GetCurrentDirectory(), "..", "API", "Templates", templateFileName)
            };

            foreach (var path in possiblePaths)
            {
                if (File.Exists(path))
                    return path;
            }
            throw new FileNotFoundException($"Template '{templateFileName}' not found. Searched paths: {string.Join(", ", possiblePaths)}");
        }

        // DRY: Centralized email sending logic
        private async Task SendEmailAsync(string recipientEmail, string subject, string body)
        {
            if (string.IsNullOrEmpty(Username) || string.IsNullOrEmpty(Password))
                throw new InvalidOperationException("SMTP credentials are not configured properly.");

            using var message = new MailMessage(new MailAddress(Username), new MailAddress(recipientEmail))
            {
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            using var smtp = new SmtpClient
            {
                Host = smtpServer,
                Port = Port,
                EnableSsl = true,
                Credentials = new NetworkCredential(Username, Password)
            };
            await smtp.SendMailAsync(message);
        }

        // DRY: Centralized template loader and replacer
        private async Task<string> LoadAndReplaceTemplate(string templateName, Dictionary<string, string> replacements)
        {
            string templatePath = GetTemplatePath(templateName);
            string templateContent = await File.ReadAllTextAsync(templatePath);
            foreach (var kvp in replacements)
                templateContent = templateContent.Replace(kvp.Key, kvp.Value ?? string.Empty);
            return templateContent;
        }

        #region Email Implementations

        public async Task SendOtpEmail(string username, string email, string otp)
        {
            if (string.IsNullOrEmpty(email)) return;
            try
            {
                var content = await LoadAndReplaceTemplate("Otp_Email.html", new()
                {
                    ["#[UserName]#"] = username,
                    ["#[OTP]#"] = otp
                });
                await SendEmailAsync(email, "Your FitPro OTP for Password Reset", content);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send OTP email: {ex.Message}");
            }
        }

        public async Task sendSuccessResetPwdEmail(string username, string email)
        {
            try
            {
                var content = await LoadAndReplaceTemplate("PasswordResetSuccess_Email.html", new()
                {
                    ["#[UserName]#"] = username
                });
                await SendEmailAsync(email, "Successfully Reset Your FitPro Account Password", content);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send password reset success email: {ex.Message}");
            }
        }

        public async Task SendActivationLink(string email, string username, string activationUrl)
        {
            try
            {
                var content = await LoadAndReplaceTemplate("Activation_Email.html", new()
                {
                    ["#[UserName]#"] = username,
                    ["#[ActivationUrl]#"] = activationUrl
                });
                await SendEmailAsync(email, "Activate Your Account", content);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send activation email: {ex.Message}");
            }
        }

        public async Task SendApproveInstructorEmail(string email, string username)
        {
            try
            {
                var content = await LoadAndReplaceTemplate("ApproveInstructor_Email.html", new()
                {
                    ["#[UserName]#"] = username
                });
                await SendEmailAsync(email, "Account Approval Notification", content);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send instructor approval email: {ex.Message}");
            }
        }

        public async Task SendDisapproveInstructorEmail(string email, string username, string reason)
        {
            try
            {
                var content = await LoadAndReplaceTemplate("DisapproveInstructor_Email.html", new()
                {
                    ["#[UserName]#"] = username,
                    ["#[Reason]#"] = reason
                });
                await SendEmailAsync(email, "Account Disapproval Notification", content);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send instructor disapproval email: {ex.Message}");
            }
        }

        public async Task SendSuspendInstructorEmail(string email, string username, string reason)
        {
            try
            {
                var content = await LoadAndReplaceTemplate("SuspendInstructor_Email.html", new()
                {
                    ["#[UserName]#"] = username,
                    ["#[Reason]#"] = reason
                });
                await SendEmailAsync(email, "Account Suspended Notification", content);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send instructor suspend email: {ex.Message}");
            }
        }

        public async Task SendSuspendUserEmail(string email, string username, string reason)
        {
            try
            {
                var content = await LoadAndReplaceTemplate("SuspendUser_Email.html", new()
                {
                    ["#[UserName]#"] = username,
                    ["#[Reason]#"] = reason
                });
                await SendEmailAsync(email, "Account Suspension Notification", content);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send user suspension email: {ex.Message}");
            }
        }

        public async Task SendActivateInstructorEmail(string email, string username)
        {
            try
            {
                var content = await LoadAndReplaceTemplate("ActivateInstructor_Email.html", new()
                {
                    ["#[UserName]#"] = username
                });
                await SendEmailAsync(email, "Account Activation Notification", content);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send instructor activation email: {ex.Message}");
            }
        }

        public async Task SendActivateUserEmail(string email, string username)
        {
            try
            {
                var content = await LoadAndReplaceTemplate("ActivateUser_Email.html", new()
                {
                    ["#[UserName]#"] = username
                });
                await SendEmailAsync(email, "Account Activation Notification", content);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send user activation email: {ex.Message}");
            }
        }

        public async Task SendBookingConfirmationEmail(string email, string username, string bookingDetails)
        {
            try
            {
                var content = await LoadAndReplaceTemplate("BookingConfirmation_Email.html", new()
                {
                    ["#[UserName]#"] = username,
                    ["#[BookingDetails]#"] = bookingDetails
                });
                await SendEmailAsync(email, "Booking Confirmation", content);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to send booking confirmation email: " + ex.Message);
            }
        }

        #endregion
    }
}
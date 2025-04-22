using System.Net;
using System.Net.Mail;
using System.Net.Sockets;
using System.Text;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace Repo
{
    public class EmailRepo : IEmailInterface
    {
        private string? smtpServer, Username, Password;
        private int Port;
        private readonly string tcpClient;
        private readonly string _ConnectionString;

        public EmailRepo(IConfiguration configuration)
        {
            _ConnectionString = configuration.GetConnectionString("DefaultConnection");
            smtpServer = configuration["Smtp:smtpServer"];
            Port = Convert.ToInt32(configuration["Smtp:Port"]);
            Username = configuration["Smtp:Username"];
            Password = configuration["Smtp:Password"];
            tcpClient = configuration["Smtp:tcpClient"];
        }

        /// <summary>
        /// Gets the template path by checking multiple possible locations
        /// </summary>
        private string GetTemplatePath(string templateFileName)
        {
            // Try multiple paths in order of preference
            var possiblePaths = new[]
            {
                // Docker path from Dockerfile: COPY API/Templates /app/API/Templates
                Path.Combine("/app", "API", "Templates", templateFileName),
                // Application base directory
                Path.Combine(AppContext.BaseDirectory, "Templates", templateFileName),
                // Current directory
                Path.Combine(Directory.GetCurrentDirectory(), "Templates", templateFileName),
                // API project directory (relative to Repo project in development)
                Path.Combine(Directory.GetCurrentDirectory(), "..", "API", "Templates", templateFileName)
            };

            foreach (var path in possiblePaths)
            {
                if (File.Exists(path))
                {
                    Console.WriteLine($"Template found at: {path}");
                    return path;
                }
            }

            // If we reach here, the template wasn't found in any location
            var errorMessage = $"Template '{templateFileName}' not found. Searched paths: {string.Join(", ", possiblePaths)}";
            Console.WriteLine(errorMessage);
            throw new FileNotFoundException(errorMessage);
        }

        /// <summary>
        /// Helper method to send emails with common configurations
        /// </summary>
        private async Task SendEmailAsync(string recipientEmail, string subject, string body)
        {
            if (string.IsNullOrEmpty(Username) || string.IsNullOrEmpty(Password))
            {
                throw new InvalidOperationException("SMTP credentials are not configured properly.");
            }

            using (MailMessage message = new MailMessage(new MailAddress(Username), new MailAddress(recipientEmail)))
            {
                message.Subject = subject;
                message.Body = body;
                message.IsBodyHtml = true;

                using (SmtpClient smtp = new SmtpClient())
                {
                    smtp.Host = smtpServer;
                    smtp.Port = Port;
                    smtp.EnableSsl = true;
                    smtp.Credentials = new NetworkCredential(Username, Password);

                    await smtp.SendMailAsync(message);
                }
            }
        }

        #region send otp email

        public async Task SendOtpEmail(string username, string email, string otp)
        {
            // Validate parameters
            if (string.IsNullOrEmpty(email))
            {
                Console.WriteLine("Error: Email address is null or empty");
                return;
            }

            try
            {
                string templatePath = GetTemplatePath("Otp_Email.html");
                string templateContent = await File.ReadAllTextAsync(templatePath);

                // Replace placeholders in the template
                templateContent = templateContent.Replace("#[UserName]#", username)
                                           .Replace("#[OTP]#", otp);

                await SendEmailAsync(email, "Your FitPro OTP for Password Reset", templateContent);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send OTP email: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
            }
        }
        #endregion

        #region send success reset password email
        public async Task sendSuccessResetPwdEmail(string username, string email)
        {
            try
            {
                string templatePath = GetTemplatePath("PasswordResetSuccess_Email.html");
                string templateContent = await File.ReadAllTextAsync(templatePath);

                templateContent = templateContent.Replace("#[UserName]#", username);

                await SendEmailAsync(email, "Successfully Reset Your FitPro Account Password", templateContent);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send password reset success email: {ex.Message}");
            }
        }
        #endregion

        #region send activation link
        public async Task SendActivationLink(string email, string username, string activationUrl)
        {
            try
            {
                string templatePath = GetTemplatePath("Activation_Email.html");
                string templateContent = await File.ReadAllTextAsync(templatePath);

                // Replace placeholders with actual values
                templateContent = templateContent.Replace("#[UserName]#", username)
                                           .Replace("#[ActivationUrl]#", activationUrl);

                await SendEmailAsync(email, "Activate Your Account", templateContent);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send activation email: {ex.Message}");
            }
        }
        #endregion

        #region Approve instructor email
        public async Task SendApproveInstructorEmail(string email, string username)
        {
            try
            {
                string templatePath = GetTemplatePath("ApproveInstructor_Email.html");
                string templateContent = await File.ReadAllTextAsync(templatePath);

                // Replace placeholders with actual values
                templateContent = templateContent.Replace("#[UserName]#", username);

                await SendEmailAsync(email, "Account Approval Notification", templateContent);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send instructor approval email: {ex.Message}");
            }
        }
        #endregion

        #region Disapprove instructor email
        public async Task SendDisapproveInstructorEmail(string email, string username, string reason)
        {
            try
            {
                string templatePath = GetTemplatePath("DisapproveInstructor_Email.html");
                string templateContent = await File.ReadAllTextAsync(templatePath);

                // Replace placeholders with actual values
                templateContent = templateContent.Replace("#[UserName]#", username)
                                           .Replace("#[Reason]#", reason);

                await SendEmailAsync(email, "Account Disapproval Notification", templateContent);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send instructor disapproval email: {ex.Message}");
            }
        }
        #endregion

        #region Suspend instructor email
        public async Task SendSuspendInstructorEmail(string email, string username, string reason)
        {
            try
            {
                string templatePath = GetTemplatePath("SuspendInstructor_Email.html");
                string templateContent = await File.ReadAllTextAsync(templatePath);

                // Replace placeholders with actual values
                templateContent = templateContent.Replace("#[UserName]#", username)
                                           .Replace("#[Reason]#", reason);

                await SendEmailAsync(email, "Account Suspended Notification", templateContent);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send instructor suspend email: {ex.Message}");
            }
        }
        #endregion

        #region Suspend User email
        public async Task SendSuspendUserEmail(string email, string username, string reason)
        {
            try
            {
                string templatePath = GetTemplatePath("SuspendUser_Email.html");
                string templateContent = await File.ReadAllTextAsync(templatePath);

                // Replace placeholders with actual values
                templateContent = templateContent.Replace("#[UserName]#", username)
                                           .Replace("#[Reason]#", reason);

                await SendEmailAsync(email, "Account Suspension Notification", templateContent);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send user suspension email: {ex.Message}");
            }
        }
        #endregion

        #region Activate instructor email
        public async Task SendActivateInstructorEmail(string email, string username)
        {
            try
            {
                string templatePath = GetTemplatePath("ActivateInstructor_Email.html");
                string templateContent = await File.ReadAllTextAsync(templatePath);

                // Replace placeholders with actual values
                templateContent = templateContent.Replace("#[UserName]#", username);

                await SendEmailAsync(email, "Account Activation Notification", templateContent);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send instructor activation email: {ex.Message}");
            }
        }
        #endregion

        #region Activate User email
        public async Task SendActivateUserEmail(string email, string username)
        {
            try
            {
                string templatePath = GetTemplatePath("ActivateUser_Email.html");
                string templateContent = await File.ReadAllTextAsync(templatePath);

                // Replace placeholders with actual values
                templateContent = templateContent.Replace("#[UserName]#", username);

                await SendEmailAsync(email, "Account Activation Notification", templateContent);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send user activation email: {ex.Message}");
            }
        }
        #endregion

        #region Booking confirmation email
        public async Task SendBookingConfirmationEmail(string email, string username, string bookingDetails)
        {
            try
            {
                string templatePath = GetTemplatePath("BookingConfirmation_Email.html");
                string templateContent = await File.ReadAllTextAsync(templatePath);

                // Replace placeholders with actual values
                templateContent = templateContent.Replace("#[UserName]#", username)
                                           .Replace("#[BookingDetails]#", bookingDetails);

                await SendEmailAsync(email, "Booking Confirmation", templateContent);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to send booking confirmation email: " + ex.Message);
            }
        }
        #endregion
    }
}
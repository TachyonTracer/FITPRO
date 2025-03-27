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
            tcpClient = configuration["Smpt:tcpClient"];
        }


        #region send otp email

        public async Task SendOtpEmail(string username, string email, string otp)
        {
            string templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "Otp_Email.html");
            string templateContent = await File.ReadAllTextAsync(templatePath);

            // Replace placeholders in the template
            templateContent = templateContent.Replace("#[UserName]#", username)
                                           .Replace("#[OTP]#", otp);

            using (MailMessage message = new MailMessage(new MailAddress(Username), new MailAddress(email)))
            {
                message.Subject = "Your AssetTrack OTP for Password Reset";
                message.Body = templateContent;
                message.IsBodyHtml = true;

                using (SmtpClient smtp = new SmtpClient())
                {
                    smtp.Host = smtpServer;
                    smtp.Port = Port;
                    smtp.EnableSsl = true;

                    NetworkCredential NetCre = new NetworkCredential(Username, Password);
                    smtp.Credentials = NetCre;

                    try
                    {
                        await smtp.SendMailAsync(message);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Failed to send OTP email: " + ex.Message);
                    }
                }
            }
        }
        #endregion


        #region send success reset password email

        //For Succesfully ResetPassword Mail
        public async Task sendSuccessResetPwdEmail(string username, string email)
        {
            string templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "PasswordResetSuccess_Email.html");
            string templateContent = await File.ReadAllTextAsync(templatePath);

            templateContent = templateContent.Replace("#[UserName]#", username);
            using (MailMessage message = new MailMessage(new MailAddress(Username), new MailAddress(email)))
            {
                message.Subject = "Successfully Reset Your AssetTrack Account Password";
                message.Body = templateContent;
                message.IsBodyHtml = true;

                using (SmtpClient smtp = new SmtpClient())
                {
                    smtp.Host = smtpServer;
                    smtp.Port = Port;
                    smtp.EnableSsl = true;

                    NetworkCredential NetCre = new NetworkCredential(Username, Password);
                    NetCre.UserName = Username;
                    NetCre.Password = Password;
                    smtp.Credentials = NetCre;
                    try
                    {
                        await smtp.SendMailAsync(message);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Failed To SuccessResetPasswordEmail" + ex.Message);
                    }
                }
            }
        }
        #endregion


        #region send activation link
            
        public async Task SendActivationLink(string email, string username, string activationUrl)
        {
            try
            {
                // Load email template
                string templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "Activation_Email.html");
                string templateContent = await File.ReadAllTextAsync(templatePath);

                // Replace placeholders with actual values
                templateContent = templateContent.Replace("#[UserName]#", username);
                templateContent = templateContent.Replace("#[ActivationUrl]#", activationUrl);

                using (MailMessage message = new MailMessage(new MailAddress(Username), new MailAddress(email)))
                {
                    message.Subject = "Activate Your Account";
                    message.Body = templateContent;
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
            catch (Exception ex)
            {
                Console.WriteLine("Failed to send activation email: " + ex.Message);
            }
        }
        #endregion

    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repo
{
    public interface IEmailInterface
    {
        Task sendSuccessResetPwdEmail(string username, string email);
        Task SendOtpEmail(string username, string email, string otp);
        Task SendActivationLink(string email, string username, string activationUrl);
        Task SendApproveInstructorEmail(string email, string username);
        Task SendDisapproveInstructorEmail(string email, string username);

    }
}
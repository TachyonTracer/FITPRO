using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repo
{
    public interface IAuthInterface
    {
        #region Reset Password
        Task<int> dispatchOtp(string email);
        Task<int> verifyOtp(string email, int OTP);
        Task<int> updatePassword(string email, string newPassword, int OTP);
        #endregion

        Task<bool> RegisterUserAsync(User user);
        Task<bool> RegisterInstructorAsync(Instructor instructor);
        Task<bool> IsEmailExists(string email);


        #region 
        Task<int> ActivateUser(string token);
        Task<int> ActivateInstructor(string token);
        #endregion
    }
}
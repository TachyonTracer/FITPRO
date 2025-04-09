using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repo
{
    public interface IAuthInterface
    {
        #region Login
        Task<User> LoginUser(LoginVM UserCredentials);
        Task<Instructor> LoginInstructor(LoginVM UserCredentials);
        Task<User> LoginAdmin(LoginVM UserCredentials);
        #endregion

        #region Reset Password
        Task<int> dispatchOtp(string email);
        Task<int> verifyOtp(string email, int OTP);
        Task<int> updatePassword(string email, string newPassword, int OTP);
        #endregion

        #region Register
        Task<bool> RegisterUserAsync(User user);
        Task<bool> RegisterInstructorAsync(Instructor instructor);
        Task<bool> IsEmailExists(string email);
        #endregion

        #region  Activation User/Instructor
        Task<int> ActivateUser(string token);
        Task<Dictionary<int,string>> ActivateInstructor(string token);
        #endregion
    }
}
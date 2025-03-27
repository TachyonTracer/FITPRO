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

        Task<bool> RegisterUserAsync(User user);
        Task<bool> RegisterInstructorAsync(Instructor instructor);
        Task<bool> IsEmailExists(string email);
    }
}
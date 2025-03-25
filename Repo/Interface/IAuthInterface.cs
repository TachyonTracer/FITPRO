using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repo
{
    public interface IAuthInterface
    {
        public Task<bool> RegisterUser(User user);
        public Task<User> LoginUser(LoginVM UserCredentials);
        public Task<Instructor> LoginInstructor(LoginVM UserCredentials);
        public Task<User> LoginAdmin(LoginVM UserCredentials);
        public Task<bool> IsEmailExists(string email);
    }
}
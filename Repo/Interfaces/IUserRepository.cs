using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repo.Interfaces
{
    public interface IUserRepository
    {
        public Task<bool> RegisterUser(User user);
        public Task<bool> IsEmailExists(string email);  
    }
}
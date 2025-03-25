using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repo
{
    public interface IAuthInterface
    {
        Task<bool> RegisterUserAsync(User user);
        Task<bool> RegisterInstructorAsync(Instructor instructor);
        Task<bool> IsEmailExists(string email);
    }
}
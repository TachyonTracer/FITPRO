using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repo.Interfaces
{
    public interface IInstructorInterface
    {
        public Task<bool> RegisterInstructor(Instructor instructor);
        public Task<bool> IsEmailExists(string email);
    }
}
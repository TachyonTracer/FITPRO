using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repo;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstructorController : ControllerBase
    {
        private readonly IInstructorInterface _instructorRep;

        #region Constructor
        public InstructorController(IInstructorInterface instructor)
        {
            _instructorRep = instructor;
        }
        #endregion

        #region Get All Instructors
        [HttpGet]
        // [Authorize]
        public async Task<IActionResult> GetAllInstructors()
        {
            List<Instructor> instructorList = await _instructorRep.GetAllInstructors();
            if (instructorList != null)
            {
                return Ok(new
                {
                    success = true,
                    message = "Instructors fetched successfully.",
                    data = instructorList
                });
            }

            return Ok(new
            {
                success = false,
                message = "Error occured while fetching instructors."
            });
        }
        #endregion


        #region Get One Instructor
        [HttpGet("GetOneInstructor/{id}")]
        // [Authorize]
        public async Task<IActionResult> GetOneInstructor(string id)
        {
            var instructor = await _instructorRep.GetOneInstructor(id);
            if (instructor != null)
            {
                return Ok(new
                {
                    success = true,
                    message = "One Instructor fetched successfully.",
                    data = instructor
                });
            }
            return Ok(new
            {
                success = false,
                message = "Instructor does not exists."
            });
        }
        #endregion
    }
}

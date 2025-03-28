using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repo;

namespace API
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassController : ControllerBase
    {
        public readonly IClassInterface _classRepo;
        public ClassController(IClassInterface classRepo)
        {
            _classRepo = classRepo;
        }

        #region Class:Booking
        [HttpPost("BookClass")]
        public async Task<IActionResult> BookClass([FromBody] Booking request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid request data",
                    errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                });
            }

            var response = await _classRepo.BookClass(request);

            if (!response.success)
            {
                return BadRequest(new
                {
                    success = false,
                    message = response.message
                });
            }

            return Ok(new
            {
                success = true,
                message = response.message
            });
        }
        #endregion

        #region GetAll
        [HttpGet("GetAllClasses")]
        public async Task<IActionResult> GetAll()
        {
            List<Class> classes = await _classRepo.GetAllClasses();
            return Ok(new { sucess = true, message = "class fetch successfully", data = classes });
        }
        #endregion

        #region GetOne
        [HttpGet("GetOneClass")]
        public async Task<ActionResult> GetOne(string id)
        {
            var classes = await _classRepo.GetOne(id);
            if (classes == null)
            {
                return BadRequest(new { success = false, message = "There was no class found" });

            }
            return Ok(new { sucess = true, message = "class fetch successfully", data = classes });
        }
        #endregion

        #region  GetClassById
        [HttpGet("ClassesByInstructorId")]
        public async Task<ActionResult> GetClassById(string id)
        {
            var classes = await _classRepo.GetClassById(id);
            if (classes == null)
            {
                return BadRequest(new { success = false, message = "There was no class found" });

            }
            return Ok(new { sucess = true, message = "class fetch successfully", data = classes });
        }
        #endregion

        #region GetBookedClasses
        [HttpGet("GetBookedClassesByUser/{userId}")]
        public async Task<IActionResult> GetBookedClassesByUser(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest(new { success = false, message = "User ID is required" });
            }

            var classes = await _classRepo.GetBookedClassesByUserId(userId);

            if (classes == null || classes.Count == 0)
            {
                return Ok(new { success = true, message = "No classes booked by this user", data = new List<Class>() });
            }

            return Ok(new { success = true, message = "Booked classes fetched successfully", data = classes });
        }
        #endregion

        [HttpDelete("CancelBooking/{userId}/{classId}")]
        public async Task<IActionResult> CancelBooking(int userId, int classId)
        {
            if (    userId <= 0 || classId <= 0)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "All IDs must be positive integers"
                });
            }

            var (success, message) = await _classRepo.CancelBooking(userId, classId);

            if (!success)
            {
                return Ok(new { success=false, message });
            }

            return Ok(new { success, message });
        }
    }
}

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
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            List<Class> classes = await _classRepo.GetAllClasses();
            return Ok(new { sucess = true, message = "class fetch successfully", data = classes });
        }

        #endregion

        #region GetOne
        [HttpGet("GetOne")]
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
        [HttpGet("ClassesById")]
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

        #region SoftDeleteClass
        [HttpDelete("soft-delete/{classId}")]
        public async Task<IActionResult> SoftDeleteClass(int classId)
        {
            bool result = await _classRepo.SoftDeleteClass(classId);
            if (result)
            {
                return Ok(new {success = true, message = "Class soft deleted successfully" });
            }
            return BadRequest(new {success=false, message = "Class is already suspended" });
        }
        #endregion


    }
}

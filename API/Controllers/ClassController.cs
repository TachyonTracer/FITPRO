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

        #region User-Stroy : List Class 
        
        #region GetAll
        [HttpGet]
        // [Authorize]
        public async Task<IActionResult> GetAll()
        {
            List<Class> classes = await _classRepo.GetAllClasses();
            return Ok(new{sucess = true, message="class fetch successfully",data = classes});
        }

        #endregion

        #region GetOne
        [HttpGet("GetOne")]
        // [Authorize]
        public async Task<ActionResult> GetOne(string id)
        {
            var classes = await _classRepo.GetOne(id);
            if (classes == null)
            {
                return BadRequest(new { success = false, message = "There was no class found" });

            }
            return Ok(new{sucess = true, message="class fetch successfully",data=classes});
        }
        #endregion

        #region  GetClassById
        [HttpGet("ClassById")]
        // [Authorize]
        public async Task<ActionResult> GetClassById(string id)
        {
            var classes = await _classRepo.GetClassById(id);
            if (classes == null)
            {
                return BadRequest(new { success = false, message = "There was no class found" });

            }
            return Ok(new{sucess = true, message="class fetch successfully",data=classes});
        }
        #endregion

        #endregion


    }
}

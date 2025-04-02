using Microsoft.AspNetCore.Mvc;

namespace MVC
{
    public class InstructorController : Controller
    {
        // GET: InstructorController
        public ActionResult Index()
        {
            return View();
        }

        public IActionResult ScheduleClass()
        {
            return View();
        }

        public IActionResult PartialScheduleClass()
        {
            return View();
        }


    }
}

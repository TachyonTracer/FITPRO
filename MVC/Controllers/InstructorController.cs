using Microsoft.AspNetCore.Mvc;

namespace MVC
{
    public class InstructorController : Controller
    {
        #region Instructor Dashboard
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
    
        #endregion
        
        #region Approved/Verified Instructor List Design
        public ActionResult ApprovedInstructor()
        {
            return View();
        }

        public ActionResult VerifiedInstructor()
        {
            return View();
        }
        #endregion

    }
}

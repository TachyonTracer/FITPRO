using Microsoft.AspNetCore.Mvc;

namespace MVC
{
    public class AdminController : Controller
    {
        // GET: AdminController
        public ActionResult Index()
        {
            return View();
        }
        
        public ActionResult PartialInstructorView()
        {
            return View();
        }
        
        public ActionResult PartialApprovedView()
        {
            return View();
        }
        

    }
}

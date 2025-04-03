using Microsoft.AspNetCore.Mvc;

namespace MVC
{
    public class UserController : Controller
    {
        // GET: UserController
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Dashboard()
        {
            return View();
        }

    }
}

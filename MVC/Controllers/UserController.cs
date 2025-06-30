using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Repo;

namespace MVC
{
    public class UserController : Controller
    {
        // GET: UserController
        public ActionResult Classes()
        {
            return View();
        }
        
        [HttpGet]
        [Route("user/Classdetails/{classId}")]
        public ActionResult ClassDetails(int classId)
        {
            return View(classId);
        }
         public ActionResult MyClasses()
        {
            return View();
        }

        
        public ActionResult Dashboard()
        {
            return View();
        }

        [HttpGet]
        [Route("user/bookclass/{classId}")]
        public IActionResult BookClass(int classId)
        {
            ViewBag.ClassId = classId;
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View("Error!");
        }

        public IActionResult Schedule(){
            return View();
        }

        public IActionResult ExploreBlogs(){
            return View();
        }

        public IActionResult BMICalculator(){
            return View();
        }
    }
}

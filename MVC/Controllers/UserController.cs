using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Repo;

namespace MVC
{
    public class UserController : Controller
    {
        private readonly IClassInterface _Class;
        public UserController(IClassInterface Class)
        {
            _Class = Class;
        }

        // GET: UserController
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Dashboard()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> BookClass(string id)
        {
            try
            {   
                Class ClassDetails = await _Class.GetOne(id);
                if (ClassDetails != null)
                {

                    return View(ClassDetails);
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            return View();

        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View("Error!");
        }
    }
}

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

        public IActionResult Index()
        {
            return View();
        }


      [HttpGet]
        public async Task<IActionResult> BookClass(string id)
        {

            Class ClassDetails = await _Class.GetOne("42");
            if (ClassDetails != null)
            {
                Console.WriteLine(ClassDetails);

                return View(ClassDetails);
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
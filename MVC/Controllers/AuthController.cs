using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MVC
{
    // [Route("[controller]")]
    public class AuthController : Controller
    {


        public IActionResult Register()
        {
            return View();
        }

        #region Login
        public IActionResult Login()
        {
            return View();
        }  
        #endregion
        

        #region Forgot Password
        public IActionResult ForgotPassword()
        {
            return View();
        }
        #endregion

    }
}
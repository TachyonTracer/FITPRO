using Microsoft.AspNetCore.Mvc;

namespace MVC
{
    public class BlogController : Controller
    {
      
        #region Blog instructor
        public IActionResult BlogEditor()
        {
            return View();
        }

        #endregion
        #region Blog Post
      public IActionResult BlogPost()
        {
            return View();
        }
        #endregion
      
    }
}

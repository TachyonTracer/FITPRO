using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using MVC.Models;

namespace MVC;

public class ClassController : Controller
{

	public IActionResult ScheduleClass()
	{
		return View();
	}
	
}

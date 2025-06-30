using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;
using Stripe;
using Repo;
using System;
using System.Collections.Generic;

namespace StripeCheckoutDemo.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CheckoutController : Controller
    {
        private readonly IConfiguration _configuration;

        public CheckoutController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // DRY: Centralized API response handler
        private IActionResult ApiResponse(bool success, string message, object data = null, int statusCode = 200)
        {
            var result = new { success, message, data };
            return statusCode switch
            {
                200 => Ok(result),
                400 => BadRequest(result),
                404 => NotFound(result),
                500 => StatusCode(500, result),
                _ => StatusCode(statusCode, result)
            };
        }

        [HttpPost("create-checkout-session")]
        public IActionResult CreateCheckoutSession([FromBody] CheckoutFormModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.ClassName) || model.Amount <= 0 || string.IsNullOrEmpty(model.Currency))
                return ApiResponse(false, "Invalid payment data", null, 400);

            try
            {
                StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"];
                var options = new SessionCreateOptions
                {
                    PaymentMethodTypes = new List<string> { "card" },
                    LineItems = new List<SessionLineItemOptions>
                    {
                        new SessionLineItemOptions
                        {
                            PriceData = new SessionLineItemPriceDataOptions
                            {
                                Currency = model.Currency,
                                ProductData = new SessionLineItemPriceDataProductDataOptions
                                {
                                    Name = model.ClassName,
                                    Description = model.ClassDescription,
                                },
                                UnitAmount = model.Amount,
                            },
                            Quantity = 1,
                        },
                    },
                    Mode = "payment",
                    SuccessUrl = $"http://localhost:8081/home/success/{model.classId}",
                    CancelUrl = $"http://localhost:8081/user/bookclass/{model.classId}",
                };
                var service = new SessionService();
                var session = service.Create(options);
                return ApiResponse(true, "SessionId generated successfully", new { sessionId = session.Id });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return ApiResponse(false, "Failed to generate SessionId", ex.Message, 500);
            }
        }
    }
}
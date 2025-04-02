using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;
using Stripe;
using Repo;

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
        [HttpPost("create-checkout-session")]
        public IActionResult CreateCheckoutSession([FromBody] CheckoutFormModel model)
        {
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
                    SuccessUrl = "http://localhost:8081/Home/Success",
                    CancelUrl = "http://localhost:8081/user/bookclass",
                };
                var service = new SessionService();
                var session = service.Create(options);
                return Ok(new { success = true, message = "SessionId geanrated Succesfull", sessionId = session.Id });

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Ok(new { success = false, message = "SessionId geanrated Failed" });
            }

        }


    }
}
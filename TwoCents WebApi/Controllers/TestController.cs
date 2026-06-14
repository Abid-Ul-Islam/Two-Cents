using Microsoft.AspNetCore.Mvc;

namespace TwoCents_WebApi.Controllers;

[ApiController]
[Route("api/[Controller]")]
public class TestController : ControllerBase
{

    [HttpGet]
    public async Task<IActionResult> Check ()
    {
        return Ok(new
        {
            message = "This is a test endpoint",
        });
    }
}

using Microsoft.AspNetCore.Mvc;
using TwoCents_WebApi.Models;

namespace TwoCents_WebApi.Controllers;

[ApiController]
[Route("api/[Controller]")]
public class TestController : ControllerBase
{

    [HttpGet]
    public async Task<IActionResult> Check (RegisterRequest registerRequest)
    {
        return Ok(new
        {
            message = "This is a test endpoint",
        });
    }
}

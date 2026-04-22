using Microsoft.AspNetCore.Mvc;
using TwoCents_WebApi.DbContext;

namespace TwoCents_WebApi.Controllers;

[ApiController]
[Route("api/[Controller]")]
public class LogoutController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly string AccessToken = "AccessToken";
    private readonly string RefreshToken = "RefreshToken";

    public LogoutController (AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Logout ()
    {
        Response.Cookies.Delete(RefreshToken);
        Response.Cookies.Delete(AccessToken);
        return Ok("Logged out");
    }
}

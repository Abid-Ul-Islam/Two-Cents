using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TwoCents_WebApi.DbContext;
using TwoCents_WebApi.Entities;

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
        string? incomingToken = Request.Cookies[RefreshToken];

        RefreshToken? matchedToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == incomingToken);

        if (matchedToken is not null)
        {
            _context.RefreshTokens.Remove(matchedToken);
            await _context.SaveChangesAsync();
        }

        Response.Cookies.Delete(RefreshToken);
        Response.Cookies.Delete(AccessToken);
        return Ok("Logged out");
    }
}

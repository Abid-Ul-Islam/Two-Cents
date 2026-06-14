using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TwoCents_WebApi.DbContext;
using TwoCents_WebApi.Entities;

namespace TwoCents_WebApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[Controller]")]
public class LogoutController : ControllerBase
{
    private readonly AppDbContext _context;

    public LogoutController (AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Logout ()
    {
        string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        List<RefreshToken> tokens = await _context.RefreshTokens
            .Where(rt => rt.User.Id == userId)
            .ToListAsync();

        if (tokens.Count > 0)
        {
            _context.RefreshTokens.RemoveRange(tokens);
            await _context.SaveChangesAsync();
        }

        Response.Cookies.Delete("AccessToken", new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Path = "/"
        });

        Response.Cookies.Delete("RefreshToken", new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Path = "/api/refresh"
        });

        return Ok(new { message = "Logged out" });
    }
}

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        string? email = User.FindFirst(ClaimTypes.Email)?.Value;

        RefreshToken? refreshToken = _context.RefreshTokens.FirstOrDefault(rt => rt.User.Email == email);
        if (refreshToken != null)
        {
            _context.RefreshTokens.Remove(refreshToken);
            await _context.SaveChangesAsync();
            return Ok("Logged out");
        }

        return NotFound("No refresh token found");
    }
}

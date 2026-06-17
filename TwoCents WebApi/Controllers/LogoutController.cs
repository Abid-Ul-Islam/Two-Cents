using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TwoCents_WebApi.DbContext;

namespace TwoCents_WebApi.Controllers;

[ApiController]
[Route("api/[Controller]")]
public class LogoutController : ControllerBase
{
    private readonly AppDbContext _context;
    private const string RefreshTokenCookieName = "RefreshToken";
    private const string AccessTokenCookieName  = "AccessToken";

    public LogoutController (AppDbContext context)
    {
        _context = context;
    }

    // Intentionally NOT [Authorize]: logout must work even when the short-lived
    // access token has already expired. The session is identified by the
    // refresh-token cookie, not the access token.
    [HttpPost]
    public async Task<IActionResult> Logout ()
    {
        string? refreshTokenValue = Request.Cookies[RefreshTokenCookieName];

        if (!string.IsNullOrEmpty(refreshTokenValue))
        {
            string? userId = await _context.RefreshTokens
                .Where(rt => rt.Token == refreshTokenValue)
                .Select(rt => rt.UserId)
                .FirstOrDefaultAsync();

            // Revoke every session for the user (log out everywhere). Falls back
            // to deleting just the presented token if it isn't tied to a user.
            if (userId is not null)
            {
                await _context.RefreshTokens
                    .Where(rt => rt.UserId == userId)
                    .ExecuteDeleteAsync();
            }
            else
            {
                await _context.RefreshTokens
                    .Where(rt => rt.Token == refreshTokenValue)
                    .ExecuteDeleteAsync();
            }
        }

        Response.Cookies.Delete(AccessTokenCookieName, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Path = "/"
        });

        Response.Cookies.Delete(RefreshTokenCookieName, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Path = "/api/refresh"
        });

        return Ok(new { message = "Logged out" });
    }
}

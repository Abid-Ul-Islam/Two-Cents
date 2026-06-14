using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TwoCents_WebApi.DbContext;
using TwoCents_WebApi.Entities;
using TwoCents_WebApi.Helpers;

namespace TwoCents_WebApi.Controllers;

[ApiController]
[Route("api/[Controller]")]
public class RefreshController : ControllerBase
{
    private readonly AppDbContext _context;
    private const string RefreshTokenCookieName = "RefreshToken";
    private const string AccessTokenCookieName  = "AccessToken";

    public RefreshController (AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> GetRefreshToken ()
    {
        string? incomingToken = Request.Cookies[RefreshTokenCookieName];

        RefreshToken? matchedToken = await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == incomingToken
                                       && rt.ExpiresAt > DateTime.UtcNow);

        if (matchedToken is null)
        {
            return Unauthorized();
        }

        User user = matchedToken.User;

        _context.RefreshTokens.Remove(matchedToken);

        RefreshToken refreshToken = TokenHelper.GenerateRefreshTokenForCurrentUser(user);

        await _context.RefreshTokens.AddAsync(refreshToken);
        await _context.SaveChangesAsync();

        Response.Cookies.Append(
            RefreshTokenCookieName,
            refreshToken.Token,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = refreshToken.ExpiresAt,
                Path = "/api/refresh"
            }
        );

        Response.Cookies.Append(
            AccessTokenCookieName,
            TokenHelper.GenerateAccessToken(user!),
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(10)
            }
            );

        return Ok();
    }

}

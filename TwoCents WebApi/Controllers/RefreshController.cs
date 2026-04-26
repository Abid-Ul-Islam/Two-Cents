using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TwoCents_WebApi.DbContext;
using TwoCents_WebApi.Entities;
using TwoCents_WebApi.Helpers;
using TwoCents_WebApi.Models;

namespace TwoCents_WebApi.Controllers;

[ApiController]
[Route("api/[Controller]")]
public class RefreshController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly string AccessToken = "AccessToken";
    private readonly string RefreshToken = "RefreshToken";

    public RefreshController (AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> GetRefreshToken (LoginRequest req)
    {
        string? incomingToken = Request.Cookies[RefreshToken];

        RefreshToken? matchedToken = await _context.RefreshTokens
        .FirstOrDefaultAsync(rt => string.Equals(rt.Token, incomingToken));

        User? user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == req.Email);

        if (matchedToken is null)
        {
            return Unauthorized();
        }

        _context.RefreshTokens.Remove(matchedToken);
        await _context.SaveChangesAsync();

        RefreshToken refreshToken = TokenHelper.GenerateRefreshTokenForCurrentUser(user);

        await _context.RefreshTokens.AddAsync(refreshToken);
        await _context.SaveChangesAsync();

        Response.Cookies.Append(
            RefreshToken,
            refreshToken.Token,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = refreshToken.ExpiresAt
            }
        );

        Response.Cookies.Append(
            AccessToken,
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

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TwoCents_WebApi.DbContext;
using TwoCents_WebApi.Entities;
using TwoCents_WebApi.Helpers;
using TwoCents_WebApi.Models;

namespace TwoCents_WebApi.Controllers;

[ApiController]
[Route("api/[Controller]")]
public class LoginController : ControllerBase
{
    private readonly AppDbContext _context;
    private const string RefreshTokenCookieName = "RefreshToken";
    private const string AccessTokenCookieName  = "AccessToken";

    public LoginController (AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Login (LoginRequest request)
    {
        Console.WriteLine("I was here");
        return Ok("alive");
        
        User? user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        string hashToVerify = user?.PasswordHash ??
                              "$2a$11$abcdefghijklmnopqrstuvwxyzABCDE1234567890abcdefghi";

        bool passwordVerified =
            BCrypt.Net.BCrypt.Verify(request.Password, hashToVerify);

        if (user == null || !passwordVerified)
        {
            return Unauthorized(new
            {
                message = "The given username or password does not match"
            });
        }
        
        await _context.RefreshTokens
            .Where(rt => rt.UserId == user.Id && rt.ExpiresAt <= DateTime.UtcNow)
            .ExecuteDeleteAsync();
        
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


        return Ok(new { message = "Logged in" });
    }
}

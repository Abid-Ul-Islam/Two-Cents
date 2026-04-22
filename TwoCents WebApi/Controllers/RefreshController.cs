using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using TwoCents_WebApi.DbContext;
using TwoCents_WebApi.Entities;
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

        RefreshToken refreshToken = new()
        {
            Id = Guid.NewGuid().ToString(),
            Token = GenerateRefreshToken(),
            ExpiresAt = DateTime.UtcNow.AddDays(3),
            UserId = matchedToken.UserId
        };

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
            GenerateAccessToken(user!),
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

    private static string GenerateRefreshToken ()
    {
        byte[] randomBytes = new byte[64];
        RandomNumberGenerator.Fill(randomBytes);
        string refreshToken = Convert.ToBase64String(randomBytes)
            .Replace("+", "-")
            .Replace("/", "_")
            .TrimEnd('=');

        return refreshToken;
    }

    private static string GenerateAccessToken (User user)
    {
        SymmetricSecurityKey key = new(
            Encoding.UTF8.GetBytes("chaitey-paro-tmi-ak-mutho-jochona.ak-mutho-golap-r-oi-nil-akash")
        );

        SigningCredentials credentials = new(key, SecurityAlgorithms.HmacSha256);

        Claim[] claims =
        [
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
        ];

        JwtSecurityToken token = new(
            issuer: "TwoCents_WebApi",
            audience: "TwoCents_FrontEnd",
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(10),
            signingCredentials: credentials
        );

        string accessToken = new JwtSecurityTokenHandler().WriteToken(token);

        return accessToken;
    }

}

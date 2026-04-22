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
public class LoginController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly string AccessToken = "AccessToken";
    private readonly string RefreshToken = "RefreshToken";

    public LoginController (AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Login (LoginRequest request)
    {
        User? user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        bool passwordVerified = false;

        if (user != null && BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            passwordVerified = true;

        if (!passwordVerified)
        {
            return Unauthorized("The given username or password does not match");
        }

        RefreshToken refreshToken = new()
        {
            Id = Guid.NewGuid().ToString(),
            Token = GenerateRefreshToken(),
            ExpiresAt = DateTime.UtcNow.AddDays(3),
            UserId = user.Id
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


        return Ok("Logged in");
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

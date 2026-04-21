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
using TwoCents_WebApi.Validators;

namespace TwoCents_WebApi.Controllers;

[ApiController]
[Route("api/auth")]

public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    public AuthController (AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
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
            UserId = request.Email
        };

        await _context.RefreshTokens.AddAsync(refreshToken);
        await _context.SaveChangesAsync();


        Response.Cookies.Append(
            "RefreshToken",
            refreshToken.Token,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/api/auth",
                Expires = refreshToken.ExpiresAt
            }
        );

        Response.Cookies.Append(
            "AccessToken",
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

    [HttpPost("register")]
    public async Task<IActionResult> Register (RegisterRequest registerRequest)
    {
        if (!UserInfoValidator.ValidateUserInfo(registerRequest))
        {
            return BadRequest("Invalid user information. Please check the provided data and try again.");
        }

        bool duplicateEmail = await _context.Users
               .AnyAsync(u => u.Email == registerRequest.Email);

        if (!duplicateEmail)
        {
            return Conflict("Provided email is already registered");
        }

        User user = new()
        {
            Id = Guid.NewGuid().ToString(),
            Name = registerRequest.Name,
            Gender = registerRequest.Gender,
            Email = registerRequest.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerRequest.Password)
        };

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        return Ok("Registration Successful");
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> GetRefreshToken (LoginRequest req)
    {
        string? incomingToken = Request.Cookies["RefreshToken"];

        RefreshToken? matchedToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == incomingToken);


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
            UserId = req.Email
        };

        await _context.RefreshTokens.AddAsync(refreshToken);
        await _context.SaveChangesAsync();

        Response.Cookies.Append(
            "RefreshToken",
            refreshToken.Token,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/api/auth",
                Expires = refreshToken.ExpiresAt
            }
        );

        return Ok();
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
}
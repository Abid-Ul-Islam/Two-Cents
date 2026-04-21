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
            return Unauthorized();
        }

        string refreshToken = GenerateRefreshToken();

        Response.Cookies.Append(
            "RefreshToken",
            refreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/api/auth",
                Expires = DateTime.UtcNow.AddDays(3)
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
            Id = $"{Guid.NewGuid().ToString()}",
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
    public IActionResult GetRefreshToken (LoginRequest req)
    {
        string? token = Request.Cookies["RefreshToken"];
        string refreshToken = GenerateRefreshToken();

        return Ok();
    }

    private static string GenerateAccessToken (User user)
    {
        SymmetricSecurityKey key = new(
            Encoding.UTF8.GetBytes("chaitey-paro-tmi-ak-mutho-jochona.ak-mutho-golap-r-oi-nil-akash")
        );

        SigningCredentials credentials = new(key, SecurityAlgorithms.HmacSha256);

        Claim[] claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
        };

        JwtSecurityToken token = new(
            issuer: "TwoCents_WebApi",
            audience: "TwoCents_FrontEnd",
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15),
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
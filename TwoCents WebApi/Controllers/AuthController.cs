using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TwoCents_WebApi.DbContext;
using TwoCents_WebApi.Entities;
using TwoCents_WebApi.Models;
using TwoCents_WebApi.Validators;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace TwoCents_WebApi.Controllers;

[ApiController]
[Route("api/auth")]

public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    public AuthController(AppDbContext context)
    {
        _context = context;
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);
        
        var passwordVerified = false;
        
        if (user != null && BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash)) 
            passwordVerified = true;
        
        if (!passwordVerified)
        {
            return Unauthorized();
        }
        
        var refreshToken = GenerateRefreshToken();
        
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
        
        User user = new()
        {
            Id = $"{Guid.NewGuid().ToString()}",
            Name = registerRequest.Name,
            Gender =  registerRequest.Gender,
            Email = registerRequest.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerRequest.Password)
        };
        
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        
        return Ok("Registration Successful");
    }
    
    [HttpPost("refresh")]
    public IActionResult GetRefreshToken(LoginRequest req)
    {
        var token = Request.Cookies["RefreshToken"];
        var refreshToken = GenerateRefreshToken();
        
        return Ok();
    }

    private static string GenerateAccessToken(User user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes("chaitey-paro-tmi-ak-mutho-jochona.ak-mutho-golap-r-oi-nil-akash")
        );

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
        };

        var token = new JwtSecurityToken(
            issuer: "TwoCents_WebApi",
            audience: "TwoCents_FrontEnd",
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15),
            signingCredentials: credentials
        );

        var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

        return accessToken;
    }

    private static string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        RandomNumberGenerator.Fill(randomBytes);
        var refreshToken = Convert.ToBase64String(randomBytes)
            .Replace("+", "-")
            .Replace("/", "_")
            .TrimEnd('=');

        return refreshToken;
    }
}
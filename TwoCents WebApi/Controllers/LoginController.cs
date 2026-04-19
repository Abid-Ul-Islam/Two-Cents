using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TwoCents_WebApi.DbContext;
using TwoCents_WebApi.Models;

namespace TwoCents_WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]

public class LoginController : ControllerBase
{
    private readonly AppDbContext _context;
    public LoginController(AppDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<IActionResult> LogIn(LoginRequest request)
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
        
        Response.Cookies.Append(
            "RefreshToken",
            "HelloWorld",
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "api/Refresh"
            }
        );
        
        return Ok("Logged in");
    }
}
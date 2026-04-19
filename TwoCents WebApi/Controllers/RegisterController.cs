using Microsoft.AspNetCore.Mvc;
using TwoCents_WebApi.DbContext;
using TwoCents_WebApi.Entities;
using TwoCents_WebApi.Models;
using TwoCents_WebApi.Validators;

namespace TwoCents_WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RegisterController : ControllerBase
{
    private readonly AppDbContext _context;
    public RegisterController(AppDbContext context)
    {
        _context = context;
    }
    
    [HttpPost]
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
            Email = registerRequest.Email,
            Password = registerRequest.Password
        };
        
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        
        return Ok("Registration Successful");
    }
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TwoCents_WebApi.DbContext;
using TwoCents_WebApi.Entities;
using TwoCents_WebApi.Models;

namespace TwoCents_WebApi.Controllers;

[ApiController]
[Route("api/[Controller]")]
public class RegisterController : ControllerBase
{
    private readonly AppDbContext _context;


    public RegisterController (AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Register (RegisterRequest registerRequest)
    {
        bool duplicateEmail = await _context.Users
               .AnyAsync(u => u.Email == registerRequest.Email);

        if (duplicateEmail)
        {
            return Conflict(new { message = "Provided email is already registered" });
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

        return StatusCode(201, new
        {
            message = "Registration Successful"
        });
    }
}

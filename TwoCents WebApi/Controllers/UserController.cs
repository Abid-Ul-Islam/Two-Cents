using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TwoCents_WebApi.DbContext;

namespace TwoCents_WebApi.Controllers;

[ApiController]
[Route("api/[Controller]")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserController (AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Search ([FromQuery] string? name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return Ok(Array.Empty<object>());

        var users = _context.Users
            .Where(u => EF.Functions.ILike(u.Name, $"%{name}%"))
            .Select(u => new { u.Id, u.Name, u.Email })
            .ToList();

        return Ok(users);
    }

    [HttpGet("{id}")]
    public IActionResult GetById (string id)
    {
        var user = _context.Users
            .Where(u => u.Id == id)
            .Select(u => new { u.Id, u.Name, u.Email, u.Gender })
            .FirstOrDefault();

        if (user is null)
            return NotFound();

        return Ok(user);
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TwoCents_WebApi.DbContext;

namespace TwoCents_WebApi.Controllers;

[ApiController]
[Authorize]
[Route("api/[Controller]")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserController (AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Search ([FromQuery] string? name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return Ok(Array.Empty<object>());

        var users = await _context.Users
            .Where(u => EF.Functions.ILike(u.Name, $"%{name}%"))
            .Select(u => new { u.Id, u.Name})
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById (string id)
    {
        var user = await _context.Users
            .Where(u => u.Id == id)
            .Select(u => new { u.Id, u.Name})
            .FirstOrDefaultAsync();

        if (user is null)
            return NotFound();

        return Ok(user);
    }
}

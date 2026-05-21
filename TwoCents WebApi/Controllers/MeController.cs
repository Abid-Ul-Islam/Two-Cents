using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TwoCents_WebApi.DbContext;
using TwoCents_WebApi.Entities;

namespace TwoCents_WebApi.Controllers;

[ApiController]
[Authorize]
[Route("api/[Controller]")]
public class MeController : ControllerBase
{
    private readonly AppDbContext _context;

    public MeController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetMe()
    {
        string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        User? user = await _context.Users.FindAsync(userId);

        if (user is null) return NotFound();

        return Ok(new { id = user.Id, name = user.Name, email = user.Email });
    }
}

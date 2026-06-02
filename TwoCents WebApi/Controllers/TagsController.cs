using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TwoCents_WebApi.DbContext;

namespace TwoCents_WebApi.Controllers;

[ApiController]
[Authorize]

[Route("api/[controller]")]
public class TagsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TagsController(AppDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetTags()
    {
        var tags = await _context.Tags.ToListAsync();
        return Ok(tags);
    }
}
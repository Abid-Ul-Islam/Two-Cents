using Microsoft.AspNetCore.Mvc;
using TwoCents_WebApi.DbContext;

namespace TwoCents_WebApi.Controllers;

[Route("api/[controller]")]
public class TagsController : ControllerBase
{
    private readonly AppDbContext _context;
    
    tag
    [HttpGet]
    public IActionResult GetTags()
    {
        
    }
}
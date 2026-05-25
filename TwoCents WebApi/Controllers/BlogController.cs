using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TwoCents_WebApi.DbContext;
using TwoCents_WebApi.Entities;
using TwoCents_WebApi.Models;

namespace TwoCents_WebApi.Controllers;

[ApiController]
[Authorize]

[Route("api/[Controller]")]
public class BlogController : ControllerBase
{
    private readonly AppDbContext _context;

    public BlogController (AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> PostBlog (PostBlogRequest request)
    {
        string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId is null)
            return BadRequest();

        Blog blog = new()
        {
            Id = Guid.NewGuid().ToString(),
            Title = request.Title,
            Body = request.Body,
            AuthorId = userId,
            CreatedAt = DateTime.UtcNow,
        };

        await _context.Blogs.AddAsync(blog);
        await _context.SaveChangesAsync();

        return Created();
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetBlog (string id)
    {
        Blog? blog = await _context.Blogs.FindAsync(id);

        if (blog == null)
        {
            return NotFound();
        }

        return Ok(blog);
    }


    [HttpGet]
    public async Task<IActionResult> GetBlogs (string? authorId)
    {
        var query = _context.Blogs.AsQueryable();

        if (!string.IsNullOrWhiteSpace(authorId))
            query = query.Where(b => b.AuthorId == authorId);

        List<Blog> blogs = await query.ToListAsync();

        return Ok(blogs);
    }

}



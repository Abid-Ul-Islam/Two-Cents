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
    
    [HttpGet]
    public async Task<IActionResult> GetBlogs(
        [FromQuery] List<int>? tags,
        [FromQuery] string? authorId)
    {
        var query = _context.Blogs.AsQueryable();

        if (!string.IsNullOrWhiteSpace(authorId))
            query = query.Where(b => b.AuthorId == authorId);

        if (tags is not null && tags.Count > 0) 
            query = query.Where(b => b.Tags.Any(t => tags.Contains(t.Id)));
        
        var blogs = await query
            .Select(b => new {
                b.Id,
                b.Title,
                b.Body,
                b.AuthorId,
                AuthorName = b.User.Name,
                b.CreatedAt,
                Tags = b.Tags.Select(t => new { t.Id, t.Name, t.Slug })
            })
            .ToListAsync();

        return Ok(blogs);
    }
    
    [HttpGet("{blogId}")]
    public async Task<IActionResult> GetBlogByBlogId (string blogId)
    {
        var blog = await _context.Blogs
            .Where(b => b.Id == blogId)
            .Select(b => new {
                b.Id,
                b.Title,
                b.Body,
                b.AuthorId,
                AuthorName = b.User.Name,
                b.CreatedAt,
                Tags = b.Tags.Select(t => new { t.Id, t.Name, t.Slug })
            })
            .FirstOrDefaultAsync();

        if (blog is null)
            return NotFound();

        return Ok(blog);
    }
    
    [HttpPost]
    public async Task<IActionResult> PostBlog ([FromBody] PostBlogRequest request)
    {
        string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId is null)
            return BadRequest();
        
        var tagIds = request.TagIds ?? [];

        var tags = await _context.Tags
            .Where(t => tagIds.Contains(t.Id))
            .ToListAsync();

        if (tags.Count != tagIds.Count)
            return BadRequest("One or more tags are invalid.");
        
        Blog blog = new()
        {
            Id = Guid.NewGuid().ToString(),
            Title = request.Title,
            Body = request.Body,
            AuthorId = userId,
            CreatedAt = DateTime.UtcNow,
            Tags = tags
        };

        await _context.Blogs.AddAsync(blog);
        await _context.SaveChangesAsync();

        return Created();
    }

    [HttpPut]
    public async Task<IActionResult> UpdateBlog([FromBody] UpdateBlogRequest request)
    {
        string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId is null)
            return BadRequest();

        Blog? blog = await _context.Blogs
            .Include(b => b.Tags)
            .FirstOrDefaultAsync(b => b.Id == request.BlogId);

        if (blog is null)
            return NotFound();

        if (blog.AuthorId != userId)
            return Forbid();

        blog.Title = request.Title;
        blog.Body = request.Body;

        if (request.TagIds is not null)
        {
            var tags = await _context.Tags
                .Where(t => request.TagIds.Contains(t.Id))
                .ToListAsync();

            if (tags.Count != request.TagIds.Count)
                return BadRequest("One or more tags are invalid.");

            blog.Tags = tags;
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }
    
    [HttpDelete("{blogId}")]
    public async Task<IActionResult> DeleteBlog(string blogId)
    {
        string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId is null)
            return BadRequest();
        
        Blog? blog = await _context.Blogs.FindAsync(blogId);
        
        if (blog is null)
        {
            return NotFound();
        }

        if (blog.AuthorId != userId)
            return Forbid();


        _context.Blogs.Remove(blog);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
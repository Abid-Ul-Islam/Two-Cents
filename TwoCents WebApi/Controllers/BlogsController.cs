using System.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore.Design;
using TwoCents_WebApi.DbContext;
using TwoCents_WebApi.Entities;
using TwoCents_WebApi.Models;

namespace TwoCents_WebApi.Controllers;

[ApiController]
[Authorize]

[Route("api/[Controller]")]
public class BlogsController : ControllerBase
{
    private readonly AppDbContext _context;

    public BlogsController (AppDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetBlogsByAuthorId([FromQuery] string? authorId)
    {
        var query = _context.Blogs.AsQueryable();

        if (!string.IsNullOrWhiteSpace(authorId))
            query = query.Where(b => b.AuthorId == authorId);

        List<Blog> blogs = await query.ToListAsync();

        return Ok(blogs);
    }
    
    [HttpGet("{blogId}")]
    public async Task<IActionResult> GetBlogByBlogId (string blogId)
    {
        Blog? blog = await _context.Blogs.FindAsync(blogId);

        if (blog is null)
        {
            return NotFound();
        }

        return Ok(blog);
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

    [HttpPut("{blogId}")]

    public async Task<IActionResult> Updateblog(string blogId, PostBlogRequest request)
    {
        Blog? blog = await _context.Blogs.FindAsync(blogId);
        
        if (blog is null)
        {
            return NotFound();
        }
        
        blog.Title = request.Title;
        blog.Body = request.Body;

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
            return Unauthorized();


        _context.Blogs.Remove(blog);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
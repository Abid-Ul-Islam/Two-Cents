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
        string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        var query = _context.Blogs.AsQueryable();

        if (!string.IsNullOrWhiteSpace(authorId))
            query = query.Where(b => b.AuthorId == authorId);

        if (tags is not null && tags.Count > 0) 
            query = query.Where(b => b.Tags.Any(t => tags.Contains(t.Id)));

        var blogs = await query
            .Select(b => new BlogResponseDto
            {
                Id = b.Id,
                Title = b.Title,
                Body = b.Body,
                AuthorName = b.AuthorName,
                UpvoteCount = b.UpvoteCount,
                CommentCount = b.CommentCount,
                CreatedAt = b.CreatedAt,
                AuthorId = b.AuthorId,
                IsUpvotedByCurrentUser =
                    b.Upvotes.Any(u => u.UserId == userId),

                Tags = b.Tags.Select(t => new TagDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Slug = t.Slug
                }).ToList()
            }).ToListAsync<BlogResponseDto>();
        
        return Ok(blogs);
    }

    [HttpPost("{blogId}/vote")]
    public async Task<IActionResult> UpvoteBlog(string blogId)
    {
        string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return BadRequest();

        await using var tx = await _context.Database.BeginTransactionAsync();

        bool alreadyUpvoted = await _context.Upvotes
            .AnyAsync(u => u.UserId == userId && u.BlogId == blogId);

        if (alreadyUpvoted)
        {
            await tx.RollbackAsync();
            return Conflict();
        }

        var rows = await _context.Blogs
            .Where(b => b.Id == blogId)
            .ExecuteUpdateAsync(s => s.SetProperty(
                b => b.UpvoteCount, b => b.UpvoteCount + 1));

        if (rows == 0)
        {
            await tx.RollbackAsync();
            return NotFound();
        }

        _context.Upvotes.Add(new Upvote { UserId = userId, BlogId = blogId });
        await _context.SaveChangesAsync();
        await tx.CommitAsync();

        return Ok();
    }
    
    [HttpDelete("{blogId}/vote")]
    public async Task<IActionResult> RemoveUpvote(string blogId)
    {
        string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (userId is null) return BadRequest();
        
        Upvote? upvote = await _context.Upvotes
            .FindAsync(userId, blogId);
        
        if (upvote is null) return NotFound();
        
        var rows = await _context.Blogs
            .Where(b => b.Id == blogId)
            .ExecuteUpdateAsync(s => s.SetProperty(
                b => b.UpvoteCount, b => b.UpvoteCount - 1));

        if (rows == 0) return NotFound();
        

        _context.Upvotes.Remove(upvote);
        await _context.SaveChangesAsync();

        return NoContent();
    }
    
    [HttpGet("{blogId}")]
    public async Task<IActionResult> GetBlogByBlogId (string blogId)
    {
        string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var blog = await _context.Blogs
            .Where(b => b.Id == blogId)
            .Select(b => new BlogResponseDto
            {
                Id = b.Id,
                Title = b.Title,
                Body = b.Body,
                AuthorName = b.AuthorName,
                UpvoteCount = b.UpvoteCount,
                CommentCount = b.CommentCount,
                CreatedAt = b.CreatedAt,
                AuthorId = b.AuthorId,
                IsUpvotedByCurrentUser =
                    b.Upvotes.Any(u => u.UserId == userId),

                Tags = b.Tags.Select(t => new TagDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Slug = t.Slug
                }).ToList()
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
        
        var user = await _context.Users.FindAsync(userId);
        if (user is null)
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
            AuthorName = user.Name,
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
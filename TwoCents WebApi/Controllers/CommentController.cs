using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TwoCents_WebApi.DbContext;
using TwoCents_WebApi.Entities;
using TwoCents_WebApi.Models;

namespace TwoCents_WebApi.Controllers;

[ApiController]
[Route("api/[Controller]")]
public class CommentController : ControllerBase
{
    private readonly AppDbContext _context;


    public CommentController (AppDbContext context)
    {
        _context = context;
    }
   
    [HttpPost]
    public async Task<IActionResult> PostComment(PostCommentRequest request)
    {
        string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (userId is null)
            return Unauthorized();
        
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Id == userId);
        
        var blog = await _context.Blogs.FindAsync(request.BlogId);
        
        if (blog is null)
            return NotFound();
        
        var comment = new Comment()
        {
            Id = Guid.NewGuid().ToString(),
            Content  = request.Content,
            IsDeleted = false,
            AuthorId = userId,
            BlogId = request.BlogId,
            AuthorName = user.Name,
            CreatedAt = DateTime.UtcNow
        };
        
        await using var tx = await _context.Database.BeginTransactionAsync();
        
        await _context.Blogs
            .Where(b => b.Id == blog.Id)
            .ExecuteUpdateAsync(s => s.SetProperty(
                b => b.CommentCount, b => b.CommentCount + 1));
        
        await _context.Comments.AddAsync(comment);
        await _context.SaveChangesAsync();
        await tx.CommitAsync();

        return Created($"/api/comment/{comment.BlogId}", new
        {
            id = comment.Id,
            content = comment.Content,
            authorName = comment.AuthorName,
            createdAt = comment.CreatedAt,
            isDeleted = comment.IsDeleted
        });
    }

    [HttpGet("{blogId}")]
    public async Task<IActionResult> GetComments(string blogId)
    {
        var res = await _context.Comments
            .Where(c => c.BlogId == blogId && !c.IsDeleted)
            .OrderBy(c => c.CreatedAt)
            .Select(c => new
            {
                id = c.Id,
                content = c.Content,
                authorName = c.AuthorName,
                createdAt = c.CreatedAt,
                isDeleted = c.IsDeleted
            })
            .ToListAsync();

        return Ok(res);
    }
}
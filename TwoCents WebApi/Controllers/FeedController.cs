using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TwoCents_WebApi.DbContext;
using TwoCents_WebApi.Models;

namespace TwoCents_WebApi.Controllers;

[ApiController]
[Authorize]
[Route("api/[Controller]")]
public class FeedController : ControllerBase
{
    private readonly AppDbContext _context;

    public FeedController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetFeed()
    {
        string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var blogs = await _context.Blogs
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => new BlogResponseDto
            {
                Id = b.Id,
                Title = b.Title,
                Body = b.Body,
                AuthorName = b.AuthorName,
                UpvoteCount = b.UpvoteCount,
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
            }).ToListAsync();

        return Ok(blogs);
    }
}

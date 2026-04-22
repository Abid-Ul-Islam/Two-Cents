using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TwoCents_WebApi.DbContext;
using TwoCents_WebApi.Entities;
using TwoCents_WebApi.Helpers;
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

    [HttpPost("postblog")]
    public async Task<IActionResult> PostBlog (PostBlogRequest request)
    {
        string accessToken = Request.Cookies["AccessToken"];

        ClaimsPrincipal? principal = TokenHelper.VerifyAccessToken(accessToken);

        string userId = principal.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        string email = principal.FindFirst(ClaimTypes.Email)!.Value;

        Blog blog = new()
        {
            Id = Guid.NewGuid().ToString(),
            Title = request.Title,
            Body = request.Body,
            AuthorId = userId,
        };

        await _context.Blogs.AddAsync(blog);
        await _context.SaveChangesAsync();

        return Created();
    }

    [HttpGet("getblog/{id}")]
    public async Task<IActionResult> GetBlog (string id)
    {
        Blog? blog = await _context.Blogs.FindAsync(id);

        if (blog == null)
        {
            return NotFound();
        }

        return Ok(blog);
    }


    [HttpGet("getblogs")]
    public async Task<IActionResult> GetBlogs ()
    {
        List<Blog> blogs = await _context.Blogs.ToListAsync();

        return Ok(blogs);
    }

}



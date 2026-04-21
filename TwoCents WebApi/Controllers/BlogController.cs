using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TwoCents_WebApi.DbContext;
using TwoCents_WebApi.Entities;
using TwoCents_WebApi.Models;

namespace TwoCents_WebApi.Controllers;

[ApiController]
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

        ClaimsPrincipal? principal = VerifyToken(accessToken);

        if (principal == null)
        {
            return Unauthorized();
        }

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



    private static ClaimsPrincipal? VerifyToken (string token)
    {
        JwtSecurityTokenHandler tokenHandler = new();

        byte[] key = Encoding.UTF8.GetBytes(
            "chaitey-paro-tmi-ak-mutho-jochona.ak-mutho-golap-r-oi-nil-akash"
        );

        try
        {
            TokenValidationParameters validationParameters = new()
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = "TwoCents_WebApi",
                ValidAudience = "TwoCents_FrontEnd",

                IssuerSigningKey = new SymmetricSecurityKey(key),

                ClockSkew = TimeSpan.Zero // no extra 5 min tolerance
            };

            ClaimsPrincipal principal = tokenHandler.ValidateToken(
                token,
                validationParameters,
                out SecurityToken validatedToken
            );

            return principal;
        }
        catch
        {
            return null;
        }
    }
}



using System.Security.Claims;
using TwoCents_WebApi.Helpers;

namespace TwoCents_WebApi.Middlewares;

public class AuthMiddleware
{
    private readonly RequestDelegate _next;

    public AuthMiddleware (RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync (HttpContext context)
    {
        string accessToken = context.Request.Cookies["AccessToken"];

        ClaimsPrincipal? principal = TokenHelper.VerifyAccessToken(accessToken);

        if (principal == null)
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsync("Ivalid/Missing token");
            return;
        }

        await _next(context);

    }
}

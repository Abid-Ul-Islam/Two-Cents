using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TwoCents_WebApi.DbContext;



WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowReactApp",
//        policy =>
//        {
//            policy
//                .WithOrigins("http://localhost:5173")
//                .AllowAnyHeader()
//                .AllowAnyMethod()
//                .AllowCredentials();
//        });
//});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.SetIsOriginAllowed(origin =>
                {
                    return origin.EndsWith(".vercel.app") ||
                           origin == "http://localhost:5173";
                })
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = "TwoCents_WebApi",
            ValidAudience = "TwoCents_FrontEnd",

            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                "chaitey-paro-tmi-ak-mutho-jochona.ak-mutho-golap-r-oi-nil-akash"
            )),

            ClockSkew = TimeSpan.Zero
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["AccessToken"];
                return Task.CompletedTask;
            }
        };
    });

WebApplication app = builder.Build();

//app.UseCors("AllowReactApp");
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
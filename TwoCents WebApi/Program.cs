using Microsoft.EntityFrameworkCore;
using TwoCents_WebApi.DbContext;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

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
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

WebApplication app = builder.Build();

app.UseHttpsRedirection();

app.UseRouting();



app.UseAuthentication();

app.MapControllers();

app.Run();
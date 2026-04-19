
using Microsoft.EntityFrameworkCore;
using TwoCents_WebApi.Entities;

namespace TwoCents_WebApi.DbContext;

public class AppDbContext : Microsoft.EntityFrameworkCore.DbContext
{
    public AppDbContext()
    {
        
    }

    public AppDbContext (DbContextOptions<AppDbContext> options): base(options) {}
    public DbSet<User> Users { get; set; }
}
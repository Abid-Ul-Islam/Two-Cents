
using Microsoft.EntityFrameworkCore;
using TwoCents_WebApi.Entities;

namespace TwoCents_WebApi.DbContext;

public class AppDbContext : Microsoft.EntityFrameworkCore.DbContext
{
    public AppDbContext ()
    {

    }

    protected override void OnModelCreating (ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Blog>()
            .HasOne(b => b.User)
            .WithMany(u => u.Blogs)
            .HasForeignKey(b => b.UserId);


        modelBuilder.Entity<RefreshToken>()
            .HasOne(b => b.User)
            .WithMany(u => u.RefreshTokens)
            .HasForeignKey(b => b.UserId);
    }

    public AppDbContext (DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<User> Users { get; set; }
    public DbSet<Blog> Blogs { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
}
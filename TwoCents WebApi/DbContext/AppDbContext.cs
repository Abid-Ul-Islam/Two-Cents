
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
            .HasForeignKey(b => b.AuthorId);


        modelBuilder.Entity<RefreshToken>()
            .HasOne(b => b.User)
            .WithMany(u => u.RefreshTokens)
            .HasForeignKey(b => b.UserId);
        
        modelBuilder.Entity<Tag>().HasData(
            new Tag { Id = 1, Name = "Science", Slug = "science" },
            new Tag { Id = 2, Name = "Philosophy", Slug = "philosophy" },
            new Tag { Id = 3, Name = "Math", Slug = "math" },
            new Tag { Id = 4, Name = "Politics", Slug = "politics" },

            new Tag { Id = 5, Name = "Technology", Slug = "technology" },
            new Tag { Id = 6, Name = "Programming", Slug = "programming" },
            new Tag { Id = 7, Name = "Artificial Intelligence", Slug = "artificial-intelligence" },
            new Tag { Id = 8, Name = "Machine Learning", Slug = "machine-learning" },
            new Tag { Id = 9, Name = "Data Science", Slug = "data-science" },

            new Tag { Id = 10, Name = "History", Slug = "history" },
            new Tag { Id = 11, Name = "Economics", Slug = "economics" },
            new Tag { Id = 12, Name = "Psychology", Slug = "psychology" },
            new Tag { Id = 13, Name = "Sociology", Slug = "sociology" },

            new Tag { Id = 14, Name = "Health", Slug = "health" },
            new Tag { Id = 15, Name = "Fitness", Slug = "fitness" },
            new Tag { Id = 16, Name = "Medicine", Slug = "medicine" },

            new Tag { Id = 17, Name = "Literature", Slug = "literature" },
            new Tag { Id = 18, Name = "Art", Slug = "art" },
            new Tag { Id = 19, Name = "Music", Slug = "music" },

            new Tag { Id = 20, Name = "Mathematics", Slug = "mathematics" }
        );
    }

    public AppDbContext (DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<User> Users { get; set; }
    public DbSet<Blog> Blogs { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Tag> Tags { get; set; }
}
namespace TwoCents_WebApi.Entities;

public class User
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }

    public string PasswordHash { get; set; }

    public string Gender { get; set; }
    public ICollection<Blog> Blogs { get; set; } = new List<Blog>();
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    
    public ICollection<Upvote> Upvotes { get; set; } = new List<Upvote>();
}
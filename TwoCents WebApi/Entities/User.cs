namespace TwoCents_WebApi.Entities;

public class User
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }

    public string PasswordHash { get; set; }

    public string Gender { get; set; }
    public List<Blog> Blogs { get; set; } = new();
    public List<RefreshToken> RefreshTokens { get; set; } = new();
}
namespace TwoCents_WebApi.Entities;

public class RefreshToken
{
    public string Id { get; set; }
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public string UserId { get; set; } = string.Empty;

    public User User { get; set; } = null!;
}

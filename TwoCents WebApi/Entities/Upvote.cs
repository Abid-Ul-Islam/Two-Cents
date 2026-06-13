namespace TwoCents_WebApi.Entities;

public class Upvote
{
    public string UserId { get; set; }
    public string BlogId { get; set; }

    public User User { get; set; }
    public Blog Blog { get; set; }
}
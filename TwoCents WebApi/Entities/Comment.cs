namespace TwoCents_WebApi.Entities;

public class Comment
{
    public string Id { get; set; }
    public string Content { get; set; }
    public bool IsDeleted { get; set; }
    public string AuthorId { get; set; }
    public string BlogId { get; set; }
    public string AuthorName { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public User User { get; set; }
    public Blog Blog { get; set; }

}
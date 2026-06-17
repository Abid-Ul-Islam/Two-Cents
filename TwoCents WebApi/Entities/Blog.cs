using System.ComponentModel.DataAnnotations;

namespace TwoCents_WebApi.Entities;

public class Blog
{
    [Key]
    public string Id { get; set; }
    public string Body { get; set; }
    public string Title { get; set; }
    public string AuthorId { get; set; }

    public string AuthorName { get; set; }

    
    public long UpvoteCount { get; set; }
    
    public long CommentCount { get; set; }

    public DateTime CreatedAt { get; set; }

    public User User { get; set; }
    public ICollection<Tag> Tags { get; set; } = new List<Tag>();
    
    public ICollection<Upvote>Upvotes  { get; set; } = new List<Upvote>();
    
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
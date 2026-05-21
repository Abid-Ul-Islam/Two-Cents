using System.ComponentModel.DataAnnotations;

namespace TwoCents_WebApi.Entities;

public class Blog
{
    [Key]
    public string Id { get; set; }
    public string Title { get; set; }
    public string AuthorId { get; set; }

    public string Body { get; set; }

    public DateTime CreatedAt { get; set; }

    public User User { get; set; }
}
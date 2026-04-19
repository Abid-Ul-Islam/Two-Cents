using System.ComponentModel.DataAnnotations;

namespace TwoCents_WebApi.Entities;

public class Blog
{
    [Key]
    public string BlogId { get; set; }
    
    public string Title { get; set; }
    public string UserId { get; set; }
    
    public string Text { get; set; }
    
    public User User  { get; set; }
}
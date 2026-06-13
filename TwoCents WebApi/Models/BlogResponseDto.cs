using TwoCents_WebApi.Entities;

namespace TwoCents_WebApi.Models;

public class BlogResponseDto
{
    public string Id { get; set; }
    public string Title { get; set; }

    public string AuthorId { get; set; }
    public string AuthorName  { get; set; }

    public string Body { get; set; }
    
    public long UpvoteCount { get; set; }

    public DateTime CreatedAt { get; set; }
    
    public Boolean IsUpvotedByCurrentUser  { get; set; }
    
    public List<TagDto> Tags { get; set; }
}
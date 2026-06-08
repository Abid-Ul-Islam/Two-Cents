namespace TwoCents_WebApi.Models;

public class PostBlogRequest
{
    public string Title { get; set; }
    public string Body { get; set; }
    
    public List<string> Tags { get; set; }
}

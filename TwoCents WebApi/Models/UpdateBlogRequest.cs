namespace TwoCents_WebApi.Models;

public class UpdateBlogRequest
{
    public string BlogId { get; set; }
    public string Title { get; set; }
    public string Body { get; set; }
    public List<int>? TagIds { get; set; }
}

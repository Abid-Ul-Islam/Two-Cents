namespace TwoCents_WebApi.Entities;

public class User
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    
    public string Password { get; set; }
    public List<Blog> Blogs { get; set; } = new();
}
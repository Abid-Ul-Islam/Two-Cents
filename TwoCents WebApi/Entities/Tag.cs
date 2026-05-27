namespace TwoCents_WebApi.Entities;

public class Tag
{
    public int Id { get; set; }   // Primary Key, auto-increment

    public string Name { get; set; } = null!;

    public string Slug { get; set; } = null!;
}
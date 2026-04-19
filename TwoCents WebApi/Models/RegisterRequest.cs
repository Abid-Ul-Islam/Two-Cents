using System.ComponentModel.DataAnnotations;

namespace TwoCents_WebApi.Models;

public class RegisterRequest
{
    [EmailAddress]
    public string Email { get; set; }
    public string Name { get; set; }
    public string Gender { get; set; }
    public string Password { get; set; }
}

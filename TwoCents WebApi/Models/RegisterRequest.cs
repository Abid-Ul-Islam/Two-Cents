using System.ComponentModel.DataAnnotations;

namespace Two_Cetns_Backend.Models;

public class RegisterRequest
{
    [EmailAddress]
    public string Email { get; set; }
    public string Name { get; set; }
    public Gender Gender { get; set; }
}

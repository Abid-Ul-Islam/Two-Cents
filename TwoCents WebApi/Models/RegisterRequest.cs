using System.ComponentModel.DataAnnotations;

namespace TwoCents_WebApi.Models;

public class RegisterRequest
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Enter a valid email address")]
    public string Email { get; set; }

    [Required(ErrorMessage = "Full name is required")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Name must be between 3 and 50 characters")]
    public string Name { get; set; }

    [Required(ErrorMessage = "Password is required")]
    [StrongPassword]
    public string Password { get; set; }
}

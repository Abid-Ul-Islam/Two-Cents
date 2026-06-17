using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace TwoCents_WebApi.Models;

/// <summary>
/// Enforces a strong-password policy that mirrors the frontend signup rules:
/// minimum length plus lowercase, uppercase, digit and special character.
/// </summary>
public class StrongPasswordAttribute : ValidationAttribute
{
    public int MinimumLength { get; set; } = 8;

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is not string password || string.IsNullOrEmpty(password))
        {
            return new ValidationResult("Password is required");
        }

        List<string> missing = new();

        if (password.Length < MinimumLength) missing.Add($"at least {MinimumLength} characters");
        if (!password.Any(char.IsLower)) missing.Add("a lowercase letter");
        if (!password.Any(char.IsUpper)) missing.Add("an uppercase letter");
        if (!password.Any(char.IsDigit)) missing.Add("a number");
        if (password.All(char.IsLetterOrDigit)) missing.Add("a special character");

        if (missing.Count > 0)
        {
            return new ValidationResult($"Password must contain {string.Join(", ", missing)}");
        }

        return ValidationResult.Success;
    }
}

using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using TwoCents_WebApi.Entities;


namespace TwoCents_WebApi.Helpers;

public static class TokenHelper
{
    public static RefreshToken GenerateRefreshTokenForCurrentUser (User user)
    {
        byte[] randomBytes = new byte[64];
        RandomNumberGenerator.Fill(randomBytes);
        string token = Convert.ToBase64String(randomBytes)
            .Replace("+", "-")
            .Replace("/", "_")
            .TrimEnd('=');

        RefreshToken refreshToken = new()
        {
            Id = Guid.NewGuid().ToString(),
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddDays(3),
            UserId = user.Id
        };

        return refreshToken;
    }

    public static string GenerateAccessToken (User user)
    {
        SymmetricSecurityKey key = new(
            Encoding.UTF8.GetBytes("chaitey-paro-tmi-ak-mutho-jochona.ak-mutho-golap-r-oi-nil-akash")
        );

        SigningCredentials credentials = new(key, SecurityAlgorithms.HmacSha256);

        Claim[] claims =
        [
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
        ];

        JwtSecurityToken token = new(
            issuer: "TwoCents_WebApi",
            audience: "TwoCents_FrontEnd",
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(10),
            signingCredentials: credentials
        );

        string accessToken = new JwtSecurityTokenHandler().WriteToken(token);

        return accessToken;
    }
}

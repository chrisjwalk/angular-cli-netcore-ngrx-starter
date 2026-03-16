using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

public class TokenService
{
  private readonly IConfiguration _config;

  public TokenService(IConfiguration config)
  {
    _config = config;
  }

  public string GenerateAccessToken(AppUser user)
  {
    var key = new SymmetricSecurityKey(
      Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
    );
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var claims = new List<Claim>
    {
      new(JwtRegisteredClaimNames.Sub, user.Id),
      new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
      new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
    };

    var token = new JwtSecurityToken(
      issuer: _config["Jwt:Issuer"],
      audience: _config["Jwt:Audience"],
      claims: claims,
      expires: DateTime.UtcNow.AddHours(1),
      signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
  }

  public static string GenerateRefreshToken()
  {
    var bytes = new byte[64];
    RandomNumberGenerator.Fill(bytes);
    return Convert.ToBase64String(bytes);
  }
}

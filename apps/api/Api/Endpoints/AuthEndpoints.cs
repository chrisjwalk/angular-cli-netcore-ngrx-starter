using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;

public record LoginRequest(string Email, string Password, string? TwoFactorCode, string? TwoFactorRecoveryCode);

public static class AuthEndpoints
{
  private const string RefreshTokenCookie = "refreshToken";
  // JS-readable indicator that a refresh-token cookie exists.
  // Lets Angular skip /api/auth/refresh on startup when the user has never logged in.
  private const string AuthStatusCookie = "auth_status";
  private static readonly TimeSpan RefreshTokenLifetime = TimeSpan.FromDays(7);

  public static IEndpointRouteBuilder MapAuthEndpoints(
    this IEndpointRouteBuilder app,
    bool isDevelopment
  )
  {
    var group = app.MapGroup("/api/auth").WithTags("Auth");

    group.MapPost("/login", async (
      [FromBody] LoginRequest req,
      UserManager<AppUser> userManager,
      SignInManager<AppUser> signInManager,
      TokenService tokenService,
      AppDbContext db,
      HttpContext context
    ) =>
    {
      var user = await userManager.FindByEmailAsync(req.Email);
      if (user is null)
        return Results.Unauthorized();

      var result = await signInManager.CheckPasswordSignInAsync(
        user,
        req.Password,
        lockoutOnFailure: true
      );

      if (result.RequiresTwoFactor)
      {
        // No code supplied yet — tell the client to ask for it.
        if (string.IsNullOrEmpty(req.TwoFactorCode) && string.IsNullOrEmpty(req.TwoFactorRecoveryCode))
          return Results.Ok(new { requiresTwoFactor = true });

        // Validate the supplied code.
        var twoFactorResult = !string.IsNullOrEmpty(req.TwoFactorCode)
          ? await signInManager.TwoFactorAuthenticatorSignInAsync(req.TwoFactorCode, false, false)
          : await signInManager.TwoFactorRecoveryCodeSignInAsync(req.TwoFactorRecoveryCode!);

        if (!twoFactorResult.Succeeded)
          return Results.Unauthorized();
      }
      else if (!result.Succeeded)
      {
        return Results.Unauthorized();
      }

      return await IssueTokensAsync(user, tokenService, db, context, isDevelopment);
    })
    .RequireRateLimiting("account");

    group.MapPost("/refresh", async (
      TokenService tokenService,
      AppDbContext db,
      HttpContext context
    ) =>
    {
      var incoming = context.Request.Cookies[RefreshTokenCookie];
      if (string.IsNullOrEmpty(incoming))
        return Results.Unauthorized();

      var stored = await db.RefreshTokens
        .Include(t => t.User)
        .SingleOrDefaultAsync(t => t.Token == incoming);

      if (stored is null || stored.ExpiresAt <= DateTimeOffset.UtcNow)
      {
        // Remove expired token if it exists
        if (stored is not null)
          db.RefreshTokens.Remove(stored);
        await db.SaveChangesAsync();
        return Results.Unauthorized();
      }

      return await IssueTokensAsync(stored.User, tokenService, db, context, isDevelopment, stored);
    })
    .RequireRateLimiting("account");

    group.MapPost("/logout", async (
      AppDbContext db,
      HttpContext context
    ) =>
    {
      var incoming = context.Request.Cookies[RefreshTokenCookie];

      if (!string.IsNullOrEmpty(incoming))
      {
        var stored = await db.RefreshTokens.SingleOrDefaultAsync(t => t.Token == incoming);
        if (stored is not null)
          db.RefreshTokens.Remove(stored);

        await db.SaveChangesAsync();
      }

      context.Response.Cookies.Delete(RefreshTokenCookie, GetCookieOptions(isDevelopment));
      context.Response.Cookies.Delete(AuthStatusCookie, GetIndicatorCookieOptions(isDevelopment));
      return Results.Ok();
    });

    return app;
  }

  private static async Task<IResult> IssueTokensAsync(
    AppUser user,
    TokenService tokenService,
    AppDbContext db,
    HttpContext context,
    bool isDevelopment,
    RefreshToken? existing = null
  )
  {
    // Rotate: remove the old token and issue a new one.
    if (existing is not null)
      db.RefreshTokens.Remove(existing);

    var newRefreshToken = new RefreshToken
    {
      UserId = user.Id,
      Token = TokenService.GenerateRefreshToken(),
      ExpiresAt = DateTimeOffset.UtcNow.Add(RefreshTokenLifetime),
    };

    db.RefreshTokens.Add(newRefreshToken);
    await db.SaveChangesAsync();

    context.Response.Cookies.Append(
      RefreshTokenCookie,
      newRefreshToken.Token,
      GetCookieOptions(isDevelopment)
    );

    // Presence indicator — not HttpOnly so Angular can read it to decide
    // whether to attempt a silent refresh on startup.
    context.Response.Cookies.Append(
      AuthStatusCookie,
      "1",
      GetIndicatorCookieOptions(isDevelopment)
    );

    var accessToken = tokenService.GenerateAccessToken(user);

    return Results.Ok(new
    {
      tokenType = "Bearer",
      accessToken,
      expiresIn = 3600,
    });
  }

  private static CookieOptions GetCookieOptions(bool isDevelopment) =>
    new()
    {
      HttpOnly = true,
      Secure = !isDevelopment, // allow non-HTTPS in dev
      SameSite = SameSiteMode.Strict,
      Expires = DateTimeOffset.UtcNow.Add(RefreshTokenLifetime),
    };

  // lgtm[cs/web/cookie-httponly-not-set] - intentionally JS-readable presence indicator
  private static CookieOptions GetIndicatorCookieOptions(bool isDevelopment) =>
    new()
    {
      HttpOnly = false, // must be JS-readable so Angular can check cookie presence
      Secure = !isDevelopment,
      SameSite = SameSiteMode.Strict,
      Expires = DateTimeOffset.UtcNow.Add(RefreshTokenLifetime),
    };
}

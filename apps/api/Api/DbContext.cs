using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class AppUser : IdentityUser { }

public class RefreshToken
{
  public string Id { get; set; } = Guid.NewGuid().ToString();
  public string UserId { get; set; } = null!;
  public string Token { get; set; } = null!;
  public DateTimeOffset ExpiresAt { get; set; }
  public AppUser User { get; set; } = null!;
}

public class AppDbContext : IdentityDbContext<AppUser>
{
  public AppDbContext(DbContextOptions<AppDbContext> options)
    : base(options) { }

  public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;

  protected override void OnModelCreating(ModelBuilder builder)
  {
    base.OnModelCreating(builder);

    builder.Entity<RefreshToken>(entity =>
    {
      entity.HasIndex(t => t.Token).IsUnique();
      entity.HasOne(t => t.User)
            .WithMany()
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    });
  }
}

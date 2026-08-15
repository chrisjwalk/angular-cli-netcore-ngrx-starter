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

public class TodoItem
{
  public string Id { get; set; } = Guid.NewGuid().ToString();
  public string Title { get; set; } = null!;
  public string Description { get; set; } = "";
  public bool Completed { get; set; }

  // UTC DateTime rather than DateTimeOffset: the todos query sorts by this column,
  // and SQLite (used by the xUnit tests) cannot ORDER BY DateTimeOffset. A UTC
  // DateTime is unambiguous and sortable on both providers.
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class AppDbContext : IdentityDbContext<AppUser>
{
  public AppDbContext(DbContextOptions<AppDbContext> options)
    : base(options) { }

  public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;

  public DbSet<TodoItem> Todos { get; set; } = null!;

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

    builder.Entity<TodoItem>(entity =>
    {
      entity.Property(t => t.Title).HasMaxLength(200).IsRequired();
      entity.Property(t => t.Description).HasMaxLength(1000);
      entity.HasIndex(t => t.CreatedAt);
    });
  }
}

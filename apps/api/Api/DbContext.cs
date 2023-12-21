using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class AppUser : IdentityUser
{
}

public class AppDbContext : IdentityDbContext<AppUser>
{
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
  {
  }
}

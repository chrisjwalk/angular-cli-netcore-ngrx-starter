using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace Api.Test
{
  /// <summary>
  /// Uses SQLite in-memory instead of the EF InMemory provider so the LINQ
  /// (ToLower/Contains, OrderBy, Skip/Take) is exercised through real SQL
  /// translation — the same query shape runs against SQL Server in prod.
  /// </summary>
  public class TodoRepositoryTests : IDisposable
  {
    private readonly SqliteConnection _connection;
    private readonly AppDbContext _db;
    private readonly TodoRepository _repo;

    public TodoRepositoryTests()
    {
      _connection = new SqliteConnection("DataSource=:memory:");
      _connection.Open();
      var options = new DbContextOptionsBuilder<AppDbContext>().UseSqlite(_connection).Options;
      _db = new AppDbContext(options);
      _db.Database.EnsureCreated();
      _repo = new TodoRepository(_db);
    }

    public void Dispose()
    {
      _db.Dispose();
      _connection.Dispose();
    }

    private async Task<TodoItem> AddAsync(
      string title,
      string description = "",
      bool completed = false,
      DateTime? createdAt = null
    )
    {
      var todo = await _repo.AddAsync(new CreateTodoRequest(title, description, completed));
      if (createdAt is not null)
      {
        todo.CreatedAt = createdAt.Value;
        await _db.SaveChangesAsync();
      }
      return todo;
    }

    // --- CRUD ---

    [Fact]
    public async Task GetPagedAsync_ReturnsEmpty_WhenNoTodosAdded()
    {
      var (items, totalCount) = await _repo.GetPagedAsync(null, "createdAt", "desc", 1, 10);
      Assert.Empty(items);
      Assert.Equal(0, totalCount);
    }

    [Fact]
    public async Task Add_ReturnsTodoWithGeneratedId()
    {
      var result = await _repo.AddAsync(new CreateTodoRequest("Buy milk", "From the store", false));

      Assert.NotNull(result.Id);
      Assert.NotEmpty(result.Id);
      Assert.Equal("Buy milk", result.Title);
      Assert.Equal("From the store", result.Description);
      Assert.False(result.Completed);
    }

    [Fact]
    public async Task Add_MultipleTodos_AreAllReturned()
    {
      await AddAsync("First");
      await AddAsync("Second");

      var (items, totalCount) = await _repo.GetPagedAsync(null, "createdAt", "desc", 1, 10);
      Assert.Equal(2, totalCount);
      Assert.Equal(2, items.Count);
    }

    [Fact]
    public async Task Update_ExistingTodo_ReturnsUpdated()
    {
      var todo = await AddAsync("Original");

      var updated = await _repo.UpdateAsync(todo.Id, new UpdateTodoRequest("Updated", null, true));

      Assert.NotNull(updated);
      Assert.Equal("Updated", updated!.Title);
      Assert.True(updated.Completed);
      Assert.Equal("", updated.Description); // unchanged
    }

    [Fact]
    public async Task Update_NonExistentId_ReturnsNull()
    {
      var result = await _repo.UpdateAsync("missing-id", new UpdateTodoRequest("x", null, null));
      Assert.Null(result);
    }

    [Fact]
    public async Task Update_OnlyPatchesProvidedFields()
    {
      var todo = await AddAsync("Title", "Desc");

      var updated = await _repo.UpdateAsync(todo.Id, new UpdateTodoRequest(null, null, true));

      Assert.Equal("Title", updated!.Title);
      Assert.Equal("Desc", updated.Description);
      Assert.True(updated.Completed);
    }

    [Fact]
    public async Task Remove_ExistingTodo_ReturnsTrueAndRemoves()
    {
      var todo = await AddAsync("Delete me");

      var removed = await _repo.RemoveAsync(todo.Id);

      Assert.True(removed);
      Assert.Empty(_db.Todos);
    }

    [Fact]
    public async Task Remove_NonExistentId_ReturnsFalse()
    {
      Assert.False(await _repo.RemoveAsync("missing-id"));
    }

    // --- Paging / filtering / sorting ---

    private async Task SeedTwelveAsync()
    {
      var now = new DateTime(2026, 8, 15, 12, 0, 0, DateTimeKind.Utc);
      var titles = new[]
      {
        "Alpha",
        "Bravo",
        "Charlie",
        "Delta",
        "Echo",
        "Foxtrot",
        "Golf",
        "Hotel",
        "India",
        "Juliett",
        "Kilo",
        "Lima",
      };
      for (var i = 0; i < titles.Length; i++)
        await AddAsync(titles[i], $"desc {titles[i].ToLower()}", i % 3 == 0, now.AddMinutes(i));
    }

    [Fact]
    public async Task GetPagedAsync_PagesAndCounts()
    {
      await SeedTwelveAsync();

      var (firstPage, total) = await _repo.GetPagedAsync(null, "title", "asc", 1, 10);
      var (secondPage, _) = await _repo.GetPagedAsync(null, "title", "asc", 2, 10);

      Assert.Equal(12, total);
      Assert.Equal(10, firstPage.Count);
      Assert.Equal("Alpha", firstPage[0].Title);
      Assert.Equal(2, secondPage.Count);
      Assert.Equal("Kilo", secondPage[0].Title);
      Assert.Equal("Lima", secondPage[1].Title);
    }

    [Fact]
    public async Task GetPagedAsync_FiltersTitleOrDescription_CaseInsensitive()
    {
      await SeedTwelveAsync();

      var (items, total) = await _repo.GetPagedAsync("BRAVO", "title", "asc", 1, 10);

      Assert.Equal(1, total);
      Assert.Single(items);
      Assert.Equal("Bravo", items[0].Title);
    }

    [Fact]
    public async Task GetPagedAsync_SortsByTitle_Ascending()
    {
      await SeedTwelveAsync();

      var (items, _) = await _repo.GetPagedAsync(null, "title", "asc", 1, 50);
      Assert.Equal(
        new[] { "Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliett", "Kilo", "Lima" },
        items.Select(t => t.Title).ToArray()
      );
    }

    [Fact]
    public async Task GetPagedAsync_SortsByCreatedAt_Descending()
    {
      await SeedTwelveAsync();

      var (items, _) = await _repo.GetPagedAsync(null, "createdAt", "desc", 1, 50);
      Assert.Equal("Lima", items[0].Title); // newest first
      Assert.Equal("Alpha", items[^1].Title);
    }
  }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

public sealed class TodoRepository(AppDbContext db)
{
  /// <summary>
  /// Whitelist of sortable columns. Requests never flow into EF query code
  /// directly — unknown sort keys are rejected by the endpoint (400) and
  /// defense-in-depth here.
  /// </summary>
  public static readonly IReadOnlyDictionary<string, Expression<Func<TodoItem, object>>> SortMap =
    new Dictionary<string, Expression<Func<TodoItem, object>>>
    {
      ["title"] = t => t.Title,
      ["completed"] = t => t.Completed,
      ["createdAt"] = t => t.CreatedAt,
    };

  public async Task<(IReadOnlyList<TodoItem> Items, int TotalCount)> GetPagedAsync(
    string? filter,
    string sortBy,
    string sortDir,
    int page,
    int pageSize
  )
  {
    var query = db.Todos.AsNoTracking();

    if (!string.IsNullOrWhiteSpace(filter))
    {
      var normalized = filter.ToLower();
      query = query.Where(t =>
        t.Title.ToLower().Contains(normalized) || t.Description.ToLower().Contains(normalized)
      );
    }

    var totalCount = await query.CountAsync();

    if (!SortMap.TryGetValue(sortBy, out var sortExpression))
      throw new ArgumentException($"Unknown sortBy '{sortBy}'.", nameof(sortBy));

    query = sortDir == "asc"
      ? query.OrderBy(sortExpression).ThenBy(t => t.Id)
      : query.OrderByDescending(sortExpression).ThenBy(t => t.Id);

    var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
    return (items, totalCount);
  }

  public async Task<TodoItem> AddAsync(CreateTodoRequest req)
  {
    var todo = new TodoItem
    {
      Title = req.Title.Trim(),
      Description = req.Description.Trim(),
      Completed = req.Completed,
    };
    db.Todos.Add(todo);
    await db.SaveChangesAsync();
    return todo;
  }

  public async Task<TodoItem?> UpdateAsync(string id, UpdateTodoRequest req)
  {
    var todo = await db.Todos.FindAsync(id);
    if (todo is null)
      return null;

    if (req.Title is not null)
      todo.Title = req.Title.Trim();
    if (req.Description is not null)
      todo.Description = req.Description.Trim();
    if (req.Completed is not null)
      todo.Completed = req.Completed.Value;

    await db.SaveChangesAsync();
    return todo;
  }

  public async Task<bool> RemoveAsync(string id)
  {
    var todo = await db.Todos.FindAsync(id);
    if (todo is null)
      return false;

    db.Todos.Remove(todo);
    await db.SaveChangesAsync();
    return true;
  }
}

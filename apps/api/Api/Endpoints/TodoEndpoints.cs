using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

public record TodoItem(
  string Id,
  string Title,
  string Description,
  bool Completed,
  string CreatedAt
);

public record CreateTodoRequest(string Title, string Description, bool Completed = false);

public record UpdateTodoRequest(string? Title, string? Description, bool? Completed);

public class TodoRepository
{
  private readonly ConcurrentDictionary<string, TodoItem> _todos = new();

  public IEnumerable<TodoItem> GetAll() =>
    _todos.Values.OrderBy(t => t.CreatedAt);

  public TodoItem Add(CreateTodoRequest req)
  {
    var todo = new TodoItem(
      Id: Guid.NewGuid().ToString(),
      Title: req.Title,
      Description: req.Description,
      Completed: req.Completed,
      CreatedAt: DateTime.UtcNow.ToString("O")
    );
    _todos[todo.Id] = todo;
    return todo;
  }

  public TodoItem? Update(string id, UpdateTodoRequest req)
  {
    if (!_todos.TryGetValue(id, out var existing))
      return null;

    var updated = existing with
    {
      Title = req.Title ?? existing.Title,
      Description = req.Description ?? existing.Description,
      Completed = req.Completed ?? existing.Completed,
    };
    _todos[id] = updated;
    return updated;
  }

  public bool Remove(string id) => _todos.TryRemove(id, out _);
}

public static class TodoEndpoints
{
  public static IEndpointRouteBuilder MapTodoEndpoints(this IEndpointRouteBuilder app)
  {
    var group = app.MapGroup("/api/todos").WithTags("Todos");

    group.MapGet("", (TodoRepository repo) =>
      Results.Ok(repo.GetAll()));

    group.MapPost("", (CreateTodoRequest req, TodoRepository repo) =>
    {
      var todo = repo.Add(req);
      return Results.Created($"/api/todos/{todo.Id}", todo);
    });

    group.MapPatch("{id}", (string id, UpdateTodoRequest req, TodoRepository repo) =>
    {
      var todo = repo.Update(id, req);
      return todo is null ? Results.NotFound() : Results.Ok(todo);
    });

    group.MapDelete("{id}", (string id, TodoRepository repo) =>
      repo.Remove(id) ? Results.NoContent() : Results.NotFound());

    return app;
  }
}

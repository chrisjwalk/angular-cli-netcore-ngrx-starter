using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

public record TodoDto(
  string Id,
  string Title,
  string Description,
  bool Completed,
  string CreatedAt
);

public record TodoPageDto(TodoDto[] Items, int TotalCount, int Page, int PageSize);

public record CreateTodoRequest(string Title, string Description, bool Completed = false);

public record UpdateTodoRequest(string? Title, string? Description, bool? Completed);

public record TodoQuery(
  int Page = 1,
  int PageSize = 10,
  string SortBy = "createdAt",
  string SortDir = "desc",
  string? Filter = null
);

public static class TodoEndpoints
{
  private const int MaxPageSize = 50;
  private const int MaxFilterLength = 100;
  private const int MaxTitleLength = 200;
  private const int MaxDescriptionLength = 1000;

  public static IEndpointRouteBuilder MapTodoEndpoints(this IEndpointRouteBuilder app)
  {
    var group = app.MapGroup("/api/todos").WithTags("Todos");

    group.MapGet("", async ([AsParameters] TodoQuery query, TodoRepository repo) =>
    {
      var errors = new Dictionary<string, string[]>();
      if (query.Page < 1)
        errors["page"] = ["page must be >= 1"];
      if (query.PageSize is < 1 or > MaxPageSize)
        errors["pageSize"] = [$"pageSize must be between 1 and {MaxPageSize}"];
      if (!TodoRepository.SortMap.ContainsKey(query.SortBy))
        errors["sortBy"] = [$"sortBy must be one of: {string.Join(", ", TodoRepository.SortMap.Keys)}"];
      if (query.SortDir is not ("asc" or "desc"))
        errors["sortDir"] = ["sortDir must be 'asc' or 'desc'"];
      if (query.Filter is { Length: > MaxFilterLength })
        errors["filter"] = [$"filter must be {MaxFilterLength} characters or fewer"];
      if (errors.Count > 0)
        return Results.ValidationProblem(errors);

      var (items, totalCount) = await repo.GetPagedAsync(
        query.Filter?.Trim(), query.SortBy, query.SortDir, query.Page, query.PageSize);

      return Results.Ok(new TodoPageDto(items.Select(ToDto).ToArray(), totalCount, query.Page, query.PageSize));
    });

    group.MapPost("", async (CreateTodoRequest req, TodoRepository repo) =>
    {
      var errors = Validate(req);
      if (errors.Count > 0)
        return Results.ValidationProblem(errors);

      var todo = await repo.AddAsync(req);
      return Results.Created($"/api/todos/{todo.Id}", ToDto(todo));
    });

    group.MapPatch("{id}", async (string id, UpdateTodoRequest req, TodoRepository repo) =>
    {
      var errors = Validate(req);
      if (errors.Count > 0)
        return Results.ValidationProblem(errors);

      var todo = await repo.UpdateAsync(id, req);
      return todo is null ? Results.NotFound() : Results.Ok(ToDto(todo));
    });

    group.MapDelete("{id}", async (string id, TodoRepository repo) =>
      await repo.RemoveAsync(id) ? Results.NoContent() : Results.NotFound());

    return app;
  }

  private static Dictionary<string, string[]> Validate(CreateTodoRequest req)
  {
    var errors = new Dictionary<string, string[]>();
    if (string.IsNullOrWhiteSpace(req.Title))
      errors["title"] = ["Title is required"];
    else if (req.Title.Trim().Length > MaxTitleLength)
      errors["title"] = [$"Title must be {MaxTitleLength} characters or fewer"];
    if (req.Description.Trim().Length > MaxDescriptionLength)
      errors["description"] = [$"Description must be {MaxDescriptionLength} characters or fewer"];
    return errors;
  }

  private static Dictionary<string, string[]> Validate(UpdateTodoRequest req)
  {
    var errors = new Dictionary<string, string[]>();
    if (req.Title is not null && string.IsNullOrWhiteSpace(req.Title))
      errors["title"] = ["Title is required"];
    else if (req.Title is not null && req.Title.Trim().Length > MaxTitleLength)
      errors["title"] = [$"Title must be {MaxTitleLength} characters or fewer"];
    if (req.Description is not null && req.Description.Trim().Length > MaxDescriptionLength)
      errors["description"] = [$"Description must be {MaxDescriptionLength} characters or fewer"];
    return errors;
  }

  private static TodoDto ToDto(TodoItem todo) =>
    new(todo.Id, todo.Title, todo.Description, todo.Completed, todo.CreatedAt.ToString("O"));
}

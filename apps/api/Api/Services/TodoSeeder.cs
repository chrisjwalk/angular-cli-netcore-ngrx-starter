using System;
using System.Collections.Generic;

public static class TodoSeeder
{
  /// <summary>
  /// 12 demo todos with staggered CreatedAt values (2+ pages at pageSize 10)
  /// so the paged/sorted UI and e2e tests have deterministic data in dev.
  /// </summary>
  public static IReadOnlyList<TodoItem> DemoTodos { get; } = CreateDemoTodos();

  private static IReadOnlyList<TodoItem> CreateDemoTodos()
  {
    var now = DateTime.UtcNow;
    var titles = new[]
    {
      "Plan the week",
      "Review pull requests",
      "Fix the login bug",
      "Write release notes",
      "Update dependencies",
      "Refactor the todo store",
      "Add dark mode",
      "Ship the design system",
      "Prepare the demo",
      "Draft the blog post",
      "Triage dependabot alerts",
      "Archive old branches",
    };

    var todos = new List<TodoItem>(titles.Length);
    for (var i = 0; i < titles.Length; i++)
    {
      todos.Add(new TodoItem
      {
        Title = titles[i],
        Description = $"Seed item {i + 1}",
        Completed = i % 3 == 0,
        CreatedAt = now.AddMinutes(-(titles.Length - i) * 37),
      });
    }
    return todos;
  }
}

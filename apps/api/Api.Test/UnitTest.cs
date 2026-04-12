namespace Api.Test
{
  public class UnitTest
  {
    [Fact]
    public void Test()
    {
      Assert.True(true);
    }
  }

  public class TodoRepositoryTests
  {
    private static TodoRepository CreateRepo() => new();

    [Fact]
    public void GetAll_ReturnsEmpty_WhenNoTodosAdded()
    {
      var repo = CreateRepo();
      Assert.Empty(repo.GetAll());
    }

    [Fact]
    public void Add_ReturnsTodoWithGeneratedId()
    {
      var repo = CreateRepo();
      var result = repo.Add(new CreateTodoRequest("Buy milk", "From the store", false));

      Assert.NotNull(result.Id);
      Assert.NotEmpty(result.Id);
      Assert.Equal("Buy milk", result.Title);
      Assert.Equal("From the store", result.Description);
      Assert.False(result.Completed);
    }

    [Fact]
    public void Add_MultipleTodos_AreAllReturned()
    {
      var repo = CreateRepo();
      repo.Add(new CreateTodoRequest("First", "", false));
      repo.Add(new CreateTodoRequest("Second", "", false));

      Assert.Equal(2, repo.GetAll().Count());
    }

    [Fact]
    public void Update_ExistingTodo_ReturnsUpdated()
    {
      var repo = CreateRepo();
      var todo = repo.Add(new CreateTodoRequest("Original", "", false));

      var updated = repo.Update(todo.Id, new UpdateTodoRequest("Updated", null, true));

      Assert.NotNull(updated);
      Assert.Equal("Updated", updated!.Title);
      Assert.True(updated.Completed);
      Assert.Equal("", updated.Description); // unchanged
    }

    [Fact]
    public void Update_NonExistentId_ReturnsNull()
    {
      var repo = CreateRepo();
      var result = repo.Update("missing-id", new UpdateTodoRequest("x", null, null));
      Assert.Null(result);
    }

    [Fact]
    public void Update_OnlyPatchesProvidedFields()
    {
      var repo = CreateRepo();
      var todo = repo.Add(new CreateTodoRequest("Title", "Desc", false));

      var updated = repo.Update(todo.Id, new UpdateTodoRequest(null, null, true));

      Assert.Equal("Title", updated!.Title);
      Assert.Equal("Desc", updated.Description);
      Assert.True(updated.Completed);
    }

    [Fact]
    public void Remove_ExistingTodo_ReturnsTrueAndRemoves()
    {
      var repo = CreateRepo();
      var todo = repo.Add(new CreateTodoRequest("Delete me", "", false));

      var removed = repo.Remove(todo.Id);

      Assert.True(removed);
      Assert.Empty(repo.GetAll());
    }

    [Fact]
    public void Remove_NonExistentId_ReturnsFalse()
    {
      var repo = CreateRepo();
      Assert.False(repo.Remove("missing-id"));
    }
  }
}


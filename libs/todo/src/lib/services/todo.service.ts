import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import {
  CreateTodoRequest,
  Todo,
  TodoPageDto,
  TodoQuery,
  UpdateTodoRequest,
} from '../models/todo';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly http = inject(HttpClient);

  getAll(params: TodoQuery) {
    return this.http.get<TodoPageDto>('/api/todos', { params: { ...params } });
  }

  create(todo: CreateTodoRequest) {
    return this.http.post<Todo>('/api/todos', todo);
  }

  update(id: string, changes: UpdateTodoRequest) {
    return this.http.patch<Todo>(`/api/todos/${id}`, changes);
  }

  remove(id: string) {
    return this.http.delete<void>(`/api/todos/${id}`);
  }
}

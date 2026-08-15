import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Todo, TodoPage, TodoQuery } from '../models/todo';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TodoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should GET /api/todos with paging, sorting, and filter query params', () => {
    const query: TodoQuery = {
      page: 2,
      pageSize: 5,
      sortBy: 'title',
      sortDir: 'asc',
      filter: 'buy',
    };
    const page: TodoPage = { items: [], totalCount: 12, page: 2, pageSize: 5 };
    let result: TodoPage | undefined;

    service.getAll(query).subscribe((value) => (result = value));

    const req = http.expectOne((request) => request.url === '/api/todos');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('pageSize')).toBe('5');
    expect(req.request.params.get('sortBy')).toBe('title');
    expect(req.request.params.get('sortDir')).toBe('asc');
    expect(req.request.params.get('filter')).toBe('buy');

    req.flush(page);
    expect(result).toEqual(page);
  });

  it('should POST /api/todos to create a todo', () => {
    const todo: Todo = {
      id: '1',
      title: 'Buy milk',
      description: '',
      completed: false,
      createdAt: '2026-08-15T12:00:00Z',
    };
    let result: Todo | undefined;

    service
      .create({ title: 'Buy milk', description: '', completed: false })
      .subscribe((value) => (result = value));

    const req = http.expectOne('/api/todos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      title: 'Buy milk',
      description: '',
      completed: false,
    });

    req.flush(todo);
    expect(result).toEqual(todo);
  });

  it('should PATCH /api/todos/:id to update a todo', () => {
    const updated: Todo = {
      id: '1',
      title: 'Updated',
      description: '',
      completed: true,
      createdAt: '2026-08-15T12:00:00Z',
    };
    let result: Todo | undefined;

    service
      .update('1', { title: 'Updated', completed: true })
      .subscribe((value) => (result = value));

    const req = http.expectOne('/api/todos/1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ title: 'Updated', completed: true });

    req.flush(updated);
    expect(result).toEqual(updated);
  });

  it('should DELETE /api/todos/:id to remove a todo', () => {
    let completed = false;

    service.remove('1').subscribe({ complete: () => (completed = true) });

    const req = http.expectOne('/api/todos/1');
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
    expect(completed).toBe(true);
  });
});

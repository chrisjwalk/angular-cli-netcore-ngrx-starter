export type Todo = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
};

export type CreateTodoRequest = Omit<Todo, 'id' | 'createdAt'>;
export type UpdateTodoRequest = Partial<Omit<Todo, 'id' | 'createdAt'>>;

export type TodoSortBy = 'createdAt' | 'title' | 'completed';
export type SortDir = 'asc' | 'desc';

/** Query params for the server-side paged/sorted/filtered GET /api/todos. */
export type TodoQuery = {
  page: number;
  pageSize: number;
  sortBy: TodoSortBy;
  sortDir: SortDir;
  filter: string;
};

/** Response envelope of the paged GET /api/todos (mirrors the C# TodoPageDto). */
export type TodoPageDto = {
  items: Todo[];
  totalCount: number;
  page: number;
  pageSize: number;
};

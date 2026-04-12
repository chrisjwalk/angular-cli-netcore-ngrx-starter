export type Todo = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
};

export type CreateTodoRequest = Omit<Todo, 'id' | 'createdAt'>;
export type UpdateTodoRequest = Partial<Omit<Todo, 'id' | 'createdAt'>>;

import { Route } from '@angular/router';

import { TodoPage } from './components/todo-page/todo-page';
import { TodoStore } from './state/todo.store';

export const todoRoutes: Route[] = [
  {
    path: '',
    component: TodoPage,
    providers: [TodoStore],
  },
];

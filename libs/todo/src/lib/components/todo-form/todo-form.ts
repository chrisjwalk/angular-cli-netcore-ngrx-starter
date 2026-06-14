import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { SignalFormControl } from '@angular/forms/signals/compat';
import { required } from '@angular/forms/signals';
import {
  HlmButton,
  HlmField,
  HlmInput,
  HlmLabel,
} from '@myorg/spartan';
import { Plus, LucideAngularModule } from 'lucide-angular';

import { CreateTodoRequest } from '../../models/todo';

@Component({
  selector: 'lib-todo-form',
  imports: [
    ReactiveFormsModule,
    HlmField,
    HlmLabel,
    HlmInput,
    HlmButton,
    LucideAngularModule,
  ],
  template: `
    <form
      class="flex flex-col gap-4 rounded-2xl bg-surface-container p-4 sm:flex-row sm:items-start"
      [formGroup]="form"
      (ngSubmit)="submit()"
    >
      <hlm-field class="flex-1">
        <label hlmLabel for="todo-title">Title</label>
        <input
          hlmInput
          id="todo-title"
          formControlName="title"
          placeholder="What needs to be done?"
          autocomplete="off"
        />
        @if (form.controls.title.touched && form.controls.title.errors?.['required']) {
          <p class="text-xs text-error mt-1">Title is required</p>
        }
      </hlm-field>
      <hlm-field class="flex-1">
        <label hlmLabel for="todo-desc">Description</label>
        <input
          hlmInput
          id="todo-desc"
          formControlName="description"
          placeholder="Optional details…"
          autocomplete="off"
        />
      </hlm-field>
      <button
        hlmButton
        variant="default"
        type="submit"
        class="h-14 shrink-0"
        [disabled]="form.invalid"
      >
        <lucide-icon [name]="plusIcon" class="h-4 w-4" />
        Add
      </button>
    </form>
  `,
  host: {
    class: 'block',
    'data-testid': 'lib-todo-form',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoForm {
  readonly create = output<CreateTodoRequest>();
  readonly plusIcon = Plus;

  readonly form = new FormGroup({
    title: new SignalFormControl('', (s) => {
      required(s, { message: 'Title is required' });
    }),
    description: new SignalFormControl(''),
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.create.emit({
      title: (this.form.value.title ?? '').trim(),
      description: (this.form.value.description ?? '').trim(),
      completed: false,
    });
    this.form.reset({ title: '', description: '' });
  }
}

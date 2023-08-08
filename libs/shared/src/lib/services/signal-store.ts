import {
  Inject,
  Injectable,
  InjectionToken,
  Optional,
  WritableSignal,
  computed,
  signal,
} from '@angular/core';

const INITIAL_STATE_TOKEN = new InjectionToken('SignalStore Initial State');

@Injectable()
export class SignalStore<T extends object> {
  readonly state: WritableSignal<T>;

  constructor(@Optional() @Inject(INITIAL_STATE_TOKEN) initialState?: T) {
    this.state = signal(initialState);
  }

  setState(state: T): void {
    this.state.update(() => state);
  }

  patchState(partialState: Partial<T>): void {
    this.state.update((state) => ({
      ...state,
      ...partialState,
    }));
  }

  select<Result>(projector: (state: T) => Result) {
    return computed(() => projector(this.state()));
  }

  updater(updaterFn: (state: T) => T): () => void {
    return () => this.state.update(updaterFn);
  }
}

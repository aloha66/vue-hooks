import { ComputedRef, Ref, WatchOptions, WatchSource } from 'vue-demi';
import { ref, unref } from 'vue-demi';
export type Fn = () => void;
export type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export type FunctionArgs<Args extends any[] = any[], Retrun = void> = (...args: Args) => Retrun;

export interface FunctionWrapperOptions<Args extends any[] = any[], This = any> {
  fn: FunctionArgs<Args, This>;
  args: Args;
  thisArg: This;
}
export type EventFilter<Args extends any[] = any[], This = any> = (
  invoke: Fn,
  options: FunctionWrapperOptions<Args, This>,
) => void;

export function createFilterWrapper<T extends FunctionArgs>(filter: EventFilter, fn: T) {
  function wrapper(this: any, ...args: any[]) {
    filter(() => fn.apply(this, args), { fn, thisArg: this, args });
  }

  return (wrapper as any) as T;
}

export function debounceFilter(ms: MaybeRef<number>) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const filter: EventFilter = (invoke) => {
    const duration = unref(ms);

    if (timer) clearTimeout(timer);

    if (duration <= 0) return invoke();

    timer = setTimeout(invoke, duration);
  };

  return filter;
}

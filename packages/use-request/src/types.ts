import { Ref } from 'vue-demi';
import { CachedKeyType } from './utils/cache';
export type noop = (...args: any[]) => void;
export type Service<R, P extends any[]> = (...args: P) => Promise<R>;
export type BaseOptions<R, P extends any[]> = {
  refreshDeps: ReadonlyArray<any>; // 如果 deps 变化后，重新请求
};

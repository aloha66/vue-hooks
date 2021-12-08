import type Fetch from './Fetch'

import { Ref } from 'vue-demi'

export type Subscribe = () => void

export type Service<TData, TParams extends any[]> = (
  ...args: TParams
) => Promise<TData>

export type ServiceObject = {
  url?: string
  [key: string]: any // backward compatibility
}

export type CombineService<TData, TParams extends any[]> =
  | string
  | ServiceObject
  | ((...args: TParams) => ServiceObject)
  | Service<TData, TParams>

// for Fetch
export interface FetchState<TData, TParams extends any[]> {
  loading: boolean
  params?: TParams
  data?: TData
  error?: unknown
}

export interface PluginReturn<TData, TParams extends any[]> {
  onBefore?: (params: TParams) =>
    | ({
        stopNow?: boolean
        returnNow?: boolean
      } & Partial<FetchState<TData, TParams>>)
    | void

  onRequest?: (
    service: Service<TData, TParams>,
    params: TParams
  ) => {
    servicePromise?: Promise<TData>
  }

  onSuccess?: (data: TData, params: TParams) => void
  onError?: (e: unknown, params: TParams) => void
  onFinally?: (params: TParams, data?: TData, e?: unknown) => void
  onCancel?: () => void
  onMutate?: (data: TData) => void
}

// for useRequestImplement

export interface Options<TData, TParams extends any[]> {
  manual?: boolean

  onBefore?: (params: TParams) => void
  onSuccess?: (data: TData, params: TParams) => void
  onError?: (e: unknown, params: TParams) => void
  formatResult?: (res: any) => TData
  onFinally?: (params: TParams, data?: TData, e?: unknown) => void

  defaultParams?: TParams

  // refreshDeps
  refreshDeps?: ReadonlyArray<any>

  // loading delay
  loadingDelay?: number

  // polling
  pollingInterval?: number
  pollingWhenHidden?: boolean

  // refresh on window focus
  refreshOnWindowFocus?: boolean
  focusTimespan?: number

  // debounce
  debounceWait?: number
  debounceLeading?: boolean
  debounceTrailing?: boolean
  debounceMaxWait?: number

  // throttle
  throttleWait?: number
  throttleLeading?: boolean
  throttleTrailing?: boolean

  // cache
  cacheKey?: string
  cacheTime?: number
  staleTime?: number

  // retry
  retryCount?: number
  retryInterval?: number

  // ready
  ready?: boolean
  requestMethod?: Service<TData, TParams>
  // [key: string]: any;
}

export type Plugin<TData, TParams extends any[]> = {
  (
    fetchInstance: Fetch<TData, TParams>,
    options: Options<TData, TParams>
  ): PluginReturn<TData, TParams>
  onInit?: (
    options: Options<TData, TParams>
  ) => Partial<FetchState<TData, TParams>>
}

export interface Result<TData, TParams extends any[]> {
  loading: Ref<boolean>
  data?: Ref<TData>
  error?: Ref<unknown>
  params: Ref<TParams | []>
  cancel: Fetch<TData, TParams>['cancel']
  refresh: Fetch<TData, TParams>['refresh']
  refreshAsync: Fetch<TData, TParams>['refreshAsync']
  run: Fetch<TData, TParams>['run']
  runAsync: Fetch<TData, TParams>['runAsync']
  mutate: Fetch<TData, TParams>['mutate']
}

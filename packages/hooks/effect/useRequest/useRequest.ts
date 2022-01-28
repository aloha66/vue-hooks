import useRefreshDeps from './plugins/useRefreshDeps'
import useLoadingDelayPlugin from './plugins/useLoadingDelayPlugin'
import useRetryPlugin from './plugins/useRetryPlugin'
import useThrottlePlugin from './plugins/useThrottlePlugin'
import useDebouncePlugin from './plugins/useDebouncePlugin'
import usePollingPlugin from './plugins/usePollingPlugin'
import useRefreshOnWindowFocusPlugin from './plugins/useRefreshOnWindowFocusPlugin'
import useCachePlugin from './plugins/useCachePlugin'
import type { Options, Plugin, CombineService } from './types'
import useRequestImplement from './useRequestImplement'

function useRequest<TData, TParams extends any[]>(
  service: CombineService<TData, TParams>,
  options?: Options<TData, TParams>,
  plugins?: Plugin<TData, TParams>[]
) {
  return useRequestImplement<TData, TParams>(service, options, [
    ...(plugins || []),
    useRefreshDeps,
    useLoadingDelayPlugin,
    useRetryPlugin,
    useThrottlePlugin,
    useDebouncePlugin,
    usePollingPlugin,
    useRefreshOnWindowFocusPlugin,
    useCachePlugin,
  ] as Plugin<TData, TParams>[])
}

export default useRequest

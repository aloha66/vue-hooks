import useRefreshDeps from './plugins/useRefreshDeps'
import useLoadingDelayPlugin from './plugins/useLoadingDelayPlugin'
import type { Options, Plugin, Service, CombineService } from './types'
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
  ] as Plugin<TData, TParams>[])
}

export default useRequest

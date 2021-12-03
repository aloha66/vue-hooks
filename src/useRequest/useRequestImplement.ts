import { inject, onUnmounted, ref, shallowRef } from 'vue-demi'
import Fetch from './Fetch'
import type { Options, Plugin, Result, Service, CombineService } from './types'

function getType(target: unknown) {
  return Object.prototype.toString.call(target).match(/\[object (.*)\]/)![1]
}

function useRequestImplement<TData, TParams extends any[]>(
  service: CombineService<TData, TParams>,
  options: Options<TData, TParams> = {},
  plugins: Plugin<TData, TParams>[] = []
) {
  // 拿到全局配置的内容
  const contextConfig = inject('UseRequestConfigContext', {})
  const { manual = false, ...rest } = options

  const fetchOptions = {
    ...contextConfig,
    // manual,
    ...options,
  }

  // @ts-expect-error
  const { requestMethod } = contextConfig
  // // service = requestMethod.bind(null, service(options.defaultParams))
  // service = requestMethod
  let promiseService: CombineService<TData, TParams> = service

  switch (getType(service)) {
    // object和string都需要与requestMethod绑定一下再执行
    case 'String':
    // promiseService = requestMethod.bind(service, service)
    // break
    case 'Object':
      promiseService = requestMethod.bind(service, service)
      break

    case 'Function':
      promiseService = (...params: TParams) => {
        const s = (service as Function)(...params)
        // 判断service有没有promise（请求库）包裹
        return s.then ? s : requestMethod(s)
      }
      break
  }

  const loading = ref(false)
  const data = shallowRef<TData>()
  const error = ref<any>(undefined)
  const params = shallowRef<TParams | []>([])
  const update = () => {
    loading.value = fetchInstance.state.loading
    data.value = fetchInstance.state.data
    error.value = fetchInstance.state.error
    params.value = fetchInstance.state.params ?? []
  }

  const getFetchInstance = () => {
    const initState = plugins
      .map(p => p?.onInit?.(fetchOptions))
      .filter(Boolean)

    return new Fetch(
      // service,
      promiseService as Service<TData, TParams>,
      fetchOptions,
      update,
      Object.assign({}, ...initState)
    )
  }

  const fetchInstance = getFetchInstance()

  fetchInstance.options = fetchOptions
  // run all plugins hooks
  fetchInstance.pluginImpls = plugins.map(p => p(fetchInstance, fetchOptions))

  if (!fetchOptions.manual) {
    // useCachePlugin can set fetchInstance.state.params from cache when init
    const params = fetchInstance.state.params || options.defaultParams || []
    // @ts-ignore
    fetchInstance.run(...params)
  }

  onUnmounted(() => {
    fetchInstance.cancel()
  })

  return {
    loading,
    data,
    error,
    params,
    cancel: fetchInstance.cancel.bind(fetchInstance),
    // @ts-expect-error
    run: fetchInstance.run.bind(fetchInstance),
    refresh: fetchInstance.refresh.bind(fetchInstance),
    // @ts-expect-error
    runAsync: fetchInstance.runAsync.bind(fetchInstance),
    refreshAsync: fetchInstance.refreshAsync.bind(fetchInstance),
  } as Result<TData, TParams>
}

export default useRequestImplement

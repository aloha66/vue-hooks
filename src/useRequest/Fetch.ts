import type {
  FetchState,
  Options,
  PluginReturn,
  Service,
  Subscribe,
} from './types'

export default class Fetch<TData, TParams extends any[]> {
  pluginImpls: PluginReturn<TData, TParams>[] = []

  count: number = 0 // 取消请求

  state: FetchState<TData, TParams> = {
    loading: false,
    params: undefined,
    data: undefined,
    error: undefined,
  }

  constructor(
    public service: Service<TData, TParams>,
    public options: Options<TData, TParams>,
    public subscribe: Subscribe,
    public initState: Partial<FetchState<TData, TParams>>
  ) {
    this.state = {
      ...this.state,
      loading: !options.manual,
      ...initState,
    }
  }

  setState(s: Partial<FetchState<TData, TParams>> = {}) {
    this.state = {
      ...this.state,
      ...s,
    }
    // 触发页面更新
    this.subscribe()
  }

  runPluginHandler(event: keyof PluginReturn<TData, TParams>, ...rest: any[]) {
    //   @ts-ignore
    const r = this.pluginImpls.map(i => i[event]?.(...rest)).filter(Boolean)
    return Object.assign({}, ...r)
  }

  async runAsync(...params: TParams): Promise<TData> {
    this.count += 1
    const currentCount = this.count

    //   请求前
    const {
      stopNow = false,
      returnNow = false,
      ...state
    } = this.runPluginHandler('onBefore', params)

    this.setState({
      loading: true,
      params,
      ...state,
    })

    this.options.onBefore?.(params)

    try {
      // 请求中
      // TODO 缓存插件
      let servicePromise = this.service(...params)

      const res = await servicePromise

      if (currentCount !== this.count) {
        // prevent run.then when request is canceled
        return new Promise(() => {})
      }
      const { formatResult } = this.options
      const formattedResult = formatResult?.(res) ?? res

      this.setState({
        data: formattedResult,
        error: undefined,
        loading: false,
      })

      this.options.onSuccess?.(res, params)
      this.runPluginHandler('onSuccess', res, params)

      this.options.onFinally?.(params, res, undefined)

      if (currentCount === this.count) {
        this.runPluginHandler('onFinally', params, res, undefined)
      }

      return formattedResult
    } catch (error) {
      if (currentCount !== this.count) {
        // prevent run.then when request is canceled
        return new Promise(() => {})
      }

      this.setState({
        error,
        loading: false,
      })

      this.options.onError?.(error, params)
      this.runPluginHandler('onError', error, params)

      this.options.onFinally?.(params, undefined, error)

      if (currentCount === this.count) {
        this.runPluginHandler('onFinally', params, undefined, error)
      }

      throw error
    }
  }

  run(...params: TParams) {
    this.runAsync(...params).catch(error => {
      if (!this.options.onError) {
        console.error(error)
      }
    })
  }

  cancel() {
    this.count += 1
    this.setState({
      loading: false,
    })

    this.runPluginHandler('onCancel')
  }

  refresh() {
    // @ts-ignore
    this.run(...(this.state.params || []))
  }

  refreshAsync() {
    // @ts-ignore
    return this.runAsync(...(this.state.params || []))
  }

  mutate(data?: TData | ((oldData?: TData) => TData | undefined)) {
    let targetData: TData | undefined
    if (typeof data === 'function') {
      // @ts-expect-error
      targetData = data(this.state.data)
    } else {
      targetData = data
    }
    this.runPluginHandler('onMutate', targetData)

    this.setState({
      data: targetData,
    })
  }
}

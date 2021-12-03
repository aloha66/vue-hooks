import type { Plugin } from '../types'

const useLoadingDelayPlugin: Plugin<any, any[]> = (
  fetchInstance,
  { loadingDelay }
) => {
  let timer: ReturnType<typeof setTimeout>
  if (!loadingDelay) return {}

  const cancelTimeout = () => {
    if (timer) {
      clearTimeout(timer)
    }
  }

  return {
    onBefore: () => {
      cancelTimeout()

      timer = setTimeout(() => {
        fetchInstance.setState({ loading: true })
      }, loadingDelay)
      return {
        loading: false,
      }
    },
    onFinally: () => {
      cancelTimeout()
    },
    onCancel: () => {
      cancelTimeout()
    },
  }
}

export default useLoadingDelayPlugin
import type { Plugin, Timeout } from '../types'

const useRetryPlugin: Plugin<any, any> = (
  fetchInstance,
  { retryInterval, retryCount }
) => {
  let timer: Timeout
  let count = 0

  let triggerByRetry = false

  if (!retryCount) return {}

  return {
    onBefore: () => {
      if (!triggerByRetry) {
        count = 0
      }
      triggerByRetry = false

      if (timer) {
        clearTimeout(timer)
      }
    },
    onSuccess: () => {
      count = 0
    },
    onError: () => {
      count++
      if (retryCount === -1 || count <= retryCount) {
        // Exponential backoff
        const timeout = retryInterval ?? Math.min(1000 * 2 * count, 30000)
        timer = setTimeout(() => {
          triggerByRetry = true
          fetchInstance.refresh()
        }, timeout)
      } else {
        count = 0
      }
    },
    onCancel: () => {
      count = 0
      if (timer) {
        clearTimeout(timer)
      }
    },
  }
}

export default useRetryPlugin

import type { Plugin, Timeout } from '../types'
import isDocumentVisible from '../utils/isDocumentVisible'
import subscribeReVisible from '../utils/subscribeReVisible'

const usePollingPlugin: Plugin<any, any[]> = (
  fetchInstance,
  { pollingInterval, pollingWhenHidden = true }
) => {
  let timer: Timeout
  let unsubscribeFn: () => void

  const stopPolling = () => {
    if (timer) {
      clearTimeout(timer)
    }
    unsubscribeFn?.()
  }

  if (!pollingInterval) {
    stopPolling()
  }

  if (!pollingInterval) {
    return {}
  }

  return {
    onBefore: () => {
      stopPolling()
    },
    onFinally: () => {
      // if pollingWhenHidden = false && document is hidden, then stop polling and subscribe revisible
      // 不可视的时候不进行轮询
      if (!pollingWhenHidden && !isDocumentVisible()) {
        unsubscribeFn = subscribeReVisible(() => {
          fetchInstance.refresh()
        })
        return
      }

      timer = setTimeout(() => {
        fetchInstance.refresh()
      }, pollingInterval)
    },
    onCancel: () => {
      stopPolling()
    },
  }
}

export default usePollingPlugin

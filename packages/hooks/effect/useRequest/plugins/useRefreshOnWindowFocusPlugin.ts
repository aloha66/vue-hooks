import type { Plugin } from '../types'
import limit from '../utils/limit'
import subscribeFocus from '../utils/subscribeFocus'
import { onUnmounted } from 'vue-demi'

const useRefreshOnWindowFocusPlugin: Plugin<any, any[]> = (
  fetchInstance,
  { refreshOnWindowFocus, focusTimespan = 5000 }
) => {
  let unsubscribeFn: () => void

  const stopSubscribe = () => {
    unsubscribeFn?.()
  }

  if (refreshOnWindowFocus) {
    const limitRefresh = limit(
      fetchInstance.refresh.bind(fetchInstance),
      focusTimespan
    )
    unsubscribeFn = subscribeFocus(() => {
      limitRefresh()
    })
  }

  onUnmounted(() => {
    stopSubscribe()
  })

  return {}
}

export default useRefreshOnWindowFocusPlugin

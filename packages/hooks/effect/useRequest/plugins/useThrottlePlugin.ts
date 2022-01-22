import type { DebouncedFunc, ThrottleSettings } from 'lodash'
import throttle from 'lodash/throttle'
import type { Plugin } from '../types'

const useThrottlePlugin: Plugin<any, any[]> = (
  fetchInstance,
  { throttleWait, throttleLeading, throttleTrailing }
) => {
  let throttled: DebouncedFunc<any>

  const options: ThrottleSettings = {}
  if (throttleLeading !== undefined) {
    options.leading = throttleLeading
  }
  if (throttleTrailing !== undefined) {
    options.trailing = throttleTrailing
  }

  function getThrottle() {
    if (throttleWait) {
      // 存储runAsync原函数
      const _originRunAsync = fetchInstance.runAsync.bind(fetchInstance)

      //   定义节流函数
      throttled = throttle(
        (callback: () => void) => {
          callback()
        },
        throttleWait,
        options
      )

      // throttle runAsync should be promise
      // https://github.com/lodash/lodash/issues/4400#issuecomment-834800398
      //   改造runAsync
      fetchInstance.runAsync = (...args) => {
        return new Promise((resolve, reject) => {
          throttled?.(() => {
            _originRunAsync(...args)
              .then(resolve)
              .catch(reject)
          })
        })
      }

      return () => {
        fetchInstance.runAsync = _originRunAsync
        throttled?.cancel()
      }
    }
  }

  getThrottle()

  if (!throttleWait) {
    return {}
  }

  return {
    onCancel: () => {
      throttled?.cancel()
    },
  }
}

export default useThrottlePlugin

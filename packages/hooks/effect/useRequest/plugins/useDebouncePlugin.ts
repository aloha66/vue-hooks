import type { DebouncedFunc, DebounceSettings } from 'lodash'
import debounce from 'lodash/debounce'
import type { Plugin } from '../types'

const useDebouncePlugin: Plugin<any, any[]> = (
  fetchInstance,
  { debounceWait, debounceLeading, debounceTrailing, debounceMaxWait }
) => {
  let debounced: DebouncedFunc<any>

  const options: DebounceSettings = {}
  if (debounceLeading !== undefined) {
    options.leading = debounceLeading
  }
  if (debounceTrailing !== undefined) {
    options.trailing = debounceTrailing
  }
  if (debounceMaxWait !== undefined) {
    options.maxWait = debounceMaxWait
  }

  function getDebounce() {
    if (debounceWait) {
      const _originRunAsync = fetchInstance.runAsync.bind(fetchInstance)

      debounced = debounce(
        (callback: () => void) => {
          callback()
        },
        debounceWait,
        options
      )

      // debounce runAsync should be promise
      // https://github.com/lodash/lodash/issues/4400#issuecomment-834800398
      fetchInstance.runAsync = (...args) => {
        return new Promise((resolve, reject) => {
          debounced?.(() => {
            _originRunAsync(...args)
              .then(resolve)
              .catch(reject)
          })
        })
      }

      return () => {
        debounced?.cancel()
        fetchInstance.runAsync = _originRunAsync
      }
    }
  }
  getDebounce()

  if (!debounceWait) {
    return {}
  }

  return {
    onCancel: () => {
      debounced?.cancel()
    },
  }
}
export default useDebouncePlugin

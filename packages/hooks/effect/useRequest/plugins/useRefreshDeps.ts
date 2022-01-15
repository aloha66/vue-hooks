import { watch } from 'vue-demi'
import type { Plugin } from '../types'

const useRefreshDeps: Plugin<any, any[]> = (
  fetchInstance,
  { manual, refreshDeps = [] }
) => {
  watch(refreshDeps, () => {
    if (!manual) {
      fetchInstance.refresh()
    }
  })

  return {}
}

export default useRefreshDeps

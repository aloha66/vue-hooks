import { canUseDom } from './canUseDom'
import isDocumentVisible from './isDocumentVisible'

const listeners: any[] = []

// 订阅和解除订阅
function subscribe(listener: () => void) {
  listeners.push(listener)
  return function unsubscribe() {
    const index = listeners.indexOf(listener)
    listeners.splice(index, 1)
  }
}

// 可视的时候 依次执行方法
if (canUseDom()) {
  const revalidate = () => {
    if (!isDocumentVisible()) return
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }
  }
  window.addEventListener('visibilitychange', revalidate, false)
}

export default subscribe

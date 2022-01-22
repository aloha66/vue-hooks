import { canUseDom } from './canUseDom'
import isDocumentVisible from './isDocumentVisible'
import isOnline from './isOnline'

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
    if (!isDocumentVisible() || !isOnline()) return
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }
  }
  window.addEventListener('visibilitychange', revalidate, false)
  window.addEventListener('focus', revalidate, false)
}

export default subscribe

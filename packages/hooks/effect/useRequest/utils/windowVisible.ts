// from swr
import { isDocumentVisible } from './index';

// 待执行的事件
const listeners: any[] = [];

function subscribe(listener: () => void) {
  listeners.push(listener); // 事件进队
  return function unsubscribe() {
    // 销毁前卸载
    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
  };
}

let eventsBinded = false;
if (typeof window !== 'undefined' && window.addEventListener && !eventsBinded) {
  const revalidate = () => {
    if (!isDocumentVisible()) return;
    // 顺序执行所有事件
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  };
  window.addEventListener('visibilitychange', revalidate, false);
  // only bind the events once
  eventsBinded = true;
}

export default subscribe;

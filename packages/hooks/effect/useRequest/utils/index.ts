export function isDocumentVisible(): boolean {
  if (typeof document !== 'undefined' && typeof document.visibilityState !== 'undefined') {
    return document.visibilityState !== 'hidden';
  }
  return true;
}

export function isOnline(): boolean {
  // https://developer.mozilla.org/zh-CN/docs/Web/API/NavigatorOnLine/onLine
  if (typeof navigator.onLine !== 'undefined') {
    return navigator.onLine;
  }
  return true;
}

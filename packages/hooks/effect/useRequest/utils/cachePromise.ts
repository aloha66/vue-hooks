import type { CachedKey } from './cache'

const cachePromise = new Map<CachedKey, Promise<any>>()

const getCachePromise = (cacheKey: CachedKey) => {
  return cachePromise.get(cacheKey)
}

/**
 * 设置promise缓存，
 * promise结束之后删除
 * @param cacheKey 请求的key
 * @param promise  请求的promise
 */
const setCachePromise = (cacheKey: CachedKey, promise: Promise<any>) => {
  // promise.finally会修改promise的引用地址导致不匹配
  // Should cache the same promise, cannot be promise.finally
  // Because the promise.finally will change the reference of the promise
  cachePromise.set(cacheKey, promise)

  // no use promise.finally for compatibility
  promise
    .then(res => {
      cachePromise.delete(cacheKey)
      return res
    })
    .catch(() => {
      cachePromise.delete(cacheKey)
    })
}

export { getCachePromise, setCachePromise }

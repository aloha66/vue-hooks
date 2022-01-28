/**
 * 缓存核心封装
 * set,get,clear
 */

import { Timeout } from '../types'

export type CachedKey = string | number

export interface CachedData<TData = any, TParams = any> {
  data: TData
  params: TParams
  time: number
}

interface RecordData extends CachedData {
  timer: Timeout | undefined
}

const cache = new Map<CachedKey, RecordData>()

/**
 * 设置缓存
 * @param key 请求唯一标识
 * @param cacheTime 缓存数据回收时间
 * @param cachedData 缓存数据的数据结构
 */
const setCache = (
  key: CachedKey,
  cacheTime: number,
  cachedData: CachedData
) => {
  const currentCache = cache.get(key)
  if (currentCache?.timer) {
    clearTimeout(currentCache.timer)
  }
  let timer: Timeout | undefined = undefined

  // 设置缓存的时候，同时设置定时器清除数据
  // -1 数据不过期
  if (cacheTime > -1) {
    // if cache out, clear it
    timer = setTimeout(() => {
      cache.delete(key)
    }, cacheTime)
  }

  cache.set(key, {
    ...cachedData,
    timer,
  })
}
const getCache = (key: CachedKey) => {
  return cache.get(key)
}

const clearCache = (key?: string | string[]) => {
  if (key) {
    const cacheKeys = Array.isArray(key) ? key : [key]
    cacheKeys.forEach(cacheKey => cache.delete(cacheKey))
  } else {
    cache.clear()
  }
}

export { getCache, setCache, clearCache }

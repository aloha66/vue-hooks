/**
 * 缓存插件流程（两个相同请求）
 * 1. 首次onBefore 根据key获取缓存为空,无操作
 * 2. 首次onRequest 根据key获取promise缓存为空,正常发送请求
 *    修改当前promise指向
 *    设置缓存（确保不会出现相同请求）
 *    然后发出请求
 * 3. 第二次onBefore 根据key获取缓存为空,无操作
 * 4. 第二次onRequest 根据key获取缓存有数据（servicePromise），currentPromise为undedfine时，
 *    返回缓存过的请求（promise）
 * 5. 执行完所有的onBefore和onRequest之后，开始执行onMounted
 * 6. 第一次onMounted 根据key获取缓存为空,无操作
 *    订阅key，listener数组有一个元素
 * 7. 第二次onMounted 根据key获取缓存为空,无操作
 *    订阅key，listener数组有两个元素
 * 8. 等到后端有数据返回，执行 promise.then或catch内的逻辑
 *    移除当前请求的key，后续可以重新发出新请求了
 * 9. 第一次onSuccess 当前是自己，不需要触发设置数据fetchInstance.setState({ data: d })
 *    所以需要执行unsubscribeFn
 * 10. _setCache设置缓存并触发更新
 *
 *
 */
import type { Plugin } from '../types'
import * as cache from '../utils/cache'
import type { CachedData } from '../utils/cache'
import * as cacheSubscribe from '../utils/cacheSubscribe'
import * as cachePromise from '../utils/cachePromise'
import { onMounted, onUnmounted } from 'vue-demi'

const useCachePlugin: Plugin<any, any[]> = (
  fetchInstance,
  {
    cacheKey,
    cacheTime = 5 * 60 * 1000,
    staleTime = 0,
    setCache: customSetCache,
    getCache: customGetCache,
  }
) => {
  let unsubscribeFn: () => void
  let currentPromise: Promise<any>

  const _setCache = (key: string, cachedData: CachedData) => {
    if (customSetCache) {
      customSetCache(cachedData)
    } else {
      cache.setCache(key, cacheTime, cachedData)
    }

    // 通知更新
    cacheSubscribe.trigger(key, cachedData.data)
  }

  const _getCache = (key: string, params?: any[]) => {
    if (customGetCache) {
      return customGetCache(params!)
    }

    return cache.getCache(key)
  }

  // 初始化
  onMounted(() => {
    if (!cacheKey) {
      return
    }

    // get data from cache when init
    const cacheData = _getCache(cacheKey)
    if (cacheData && Object.hasOwnProperty.call(cacheData, 'data')) {
      fetchInstance.state.data = cacheData.data
      fetchInstance.state.params = cacheData.params
      // 当前时间是新鲜时间
      if (
        staleTime === -1 ||
        // 当前时间 - 缓存时间小于等于保持新鲜时间
        new Date().getTime() - cacheData.time <= staleTime
      ) {
        fetchInstance.state.loading = false
      }
    }

    // 订阅key并通知更新
    // subscribe same cachekey update, trigger update
    unsubscribeFn = cacheSubscribe.subscribe(cacheKey, data => {
      fetchInstance.setState({ data })
    })
  })

  onUnmounted(() => {
    unsubscribeFn?.()
  })

  if (!cacheKey) {
    return {}
  }

  return {
    // 判断是否需要请求
    // 回填data
    onBefore: params => {
      const cacheData = _getCache(cacheKey, params)
      if (!cacheData || !Object.hasOwnProperty.call(cacheData, 'data')) {
        return {}
      }

      // If the data is fresh, stop request
      if (
        staleTime === -1 ||
        new Date().getTime() - cacheData.time <= staleTime
      ) {
        return {
          loading: false,
          data: cacheData?.data,
          returnNow: true,
        }
      } else {
        // 先返回旧数据再做请求
        // If the data is stale, return data, and request continue
        return {
          data: cacheData?.data,
        }
      }
    },
    /**
     * 用缓存替换请求的promise
     * @param service
     * @param args
     * @returns
     */
    onRequest: (service, args) => {
      let servicePromise = cachePromise.getCachePromise(cacheKey)

      // If has servicePromise, and is not trigger by self, then use it
      if (servicePromise && servicePromise !== currentPromise) {
        return { servicePromise }
      }
      servicePromise = service(...args)
      currentPromise = servicePromise
      // 缓存当前的promise
      cachePromise.setCachePromise(cacheKey, servicePromise)
      return { servicePromise }
    },
    onSuccess: (data, params) => {
      if (cacheKey) {
        // cancel subscribe, avoid trgger self
        unsubscribeFn?.()
        _setCache(cacheKey, {
          data,
          params,
          time: new Date().getTime(),
        })
        // resubscribe
        unsubscribeFn = cacheSubscribe.subscribe(cacheKey, d => {
          fetchInstance.setState({ data: d })
        })
      }
    },
    onMutate: data => {
      if (cacheKey) {
        // cancel subscribe, avoid trgger self
        unsubscribeFn?.()
        _setCache(cacheKey, {
          data,
          params: fetchInstance.state.params,
          time: new Date().getTime(),
        })
        // resubscribe
        unsubscribeFn = cacheSubscribe.subscribe(cacheKey, d => {
          fetchInstance.setState({ data: d })
        })
      }
    },
  }
}

export default useCachePlugin

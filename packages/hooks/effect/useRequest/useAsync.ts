import {
  reactive,
  ref,
  toRefs,
  onMounted,
  watchEffect,
  watch,
  computed,
  onUnmounted,
} from 'vue-demi';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import { BaseOptions, BaseResult, Service, FetchConfig } from './types';
import { isDocumentVisible } from './utils';
import subscribeVisible from './utils/windowVisible';
import subscribeFocus from './utils/windowFocus';
import { getCache, setCache } from './utils/cache';
import limit from './utils/limit';

const DEFAULT_KEY = 'VUE_HOOKS_REQUEST_DEFAULT_KEY';

function useFetch<R, P extends any[]>(
  service: Service<R, P>,
  config: FetchConfig<R, P>,
  initState?: { data?: any; error?: any; params?: any; loading?: any },
) {
  // 请求时序
  let count = 0;
  // 是否卸载
  let unmountedFlag = false;
  let loadingDelayTimer: ReturnType<typeof setTimeout>; // 返回类型是setTimeout的类型
  let retryDelayTimer: ReturnType<typeof setTimeout>; // 延迟重新请求
  let pollingTimer: ReturnType<typeof setTimeout>;
  // visible 后，是否继续轮询
  let pollingWhenVisibleFlag = false;
  let failureCount = 0; // 改为在useAsync计数，保证每次手动都重新开始

  const unsubscribe = [];
  const state = reactive({
    loading: initState?.loading ?? false,
    params: initState?.params ?? [],
    data: initState?.data,
    error: initState?.error,
  });

  const _run = (...args: any) => {
    // 取消已有定时器
    if (pollingTimer) {
      clearTimeout(pollingTimer);
    }
    // 取消 loadingDelayTimer
    if (loadingDelayTimer) {
      clearTimeout(loadingDelayTimer);
    }
    count++;
    const currentCount = count;
    state.loading = !config.loadingDelay;
    state.params = args;

    if (config.loadingDelay) {
      loadingDelayTimer = setTimeout(() => {
        state.loading = true;
      }, config.loadingDelay);
    }

    // 抛弃该次请求结果
    const shoundAbandon = () => unmountedFlag || currentCount !== count;

    const doRetry = () => {
      const retryAction = () => {
        _run(...args);
        failureCount++;
        console.warn(
          `useRequest has caught the exception, it will automatically sent the request ${config.retry} times, currently it is the ${failureCount} time`,
        );
      };
      if (config.retryDelay) {
        clearTimeout(retryDelayTimer);
        retryDelayTimer = setTimeout(() => {
          retryAction();
        }, config.retryDelay);
      } else {
        retryAction();
      }
    };

    service(...args)
      .then((res: any) => {
        if (shoundAbandon()) return;
        if (loadingDelayTimer) {
          clearTimeout(loadingDelayTimer);
        }
        const formattedResult = config.formatResult ? config.formatResult(res) : res;
        state.error = undefined;
        state.loading = false;
        state.data = formattedResult;

        // 如果满足条件须在返回成功onSuccess之前进行拦截
        // 这里不能把retry写死为true,否则会死循环
        const retry = config.retry;
        const shouldRetry = typeof retry === 'function' && retry(formattedResult, failureCount);
        if (shouldRetry) {
          doRetry();
          return;
        }

        if (config.onSuccess) {
          config.onSuccess(formattedResult, args);
        }
        return formattedResult;
      })
      .catch((err: Error) => {
        if (shoundAbandon()) return;
        if (loadingDelayTimer) {
          clearTimeout(loadingDelayTimer);
        }
        state.error = err;
        state.loading = false;
        state.data = undefined;
        // 错误重试逻辑
        const retry = config.retry;
        const shouldRetry =
          retry === true ||
          (typeof retry === 'number' && retry > failureCount) ||
          (typeof retry === 'function' && retry(err, failureCount));
        if (shouldRetry) {
          doRetry();
        }
        if (config.onError) {
          config.onError(err, args);
        }
        // If throwOnError, user should catch the error self,
        // or the page will crash
        if (config.throwOnError) {
          throw err;
        }
        console.error(err);
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject(
          'useRequest has caught the exception, if you need to handle the exception yourself, you can set options.throwOnError to true.',
        );
      })
      .finally(() => {
        if (shoundAbandon()) return;
        // 轮询逻辑
        if (config.pollingInterval) {
          // 如果屏幕隐藏，并且 !pollingWhenHidden, 则停止轮询，并记录 flag，等 visible 时，继续轮询
          if (!isDocumentVisible() && !config.pollingWhenHidden) {
            pollingWhenVisibleFlag = true;
            return;
          }
          // 只保留一个poll定时器 ahooks没加可能有bug
          clearTimeout(pollingTimer);
          pollingTimer = setTimeout(() => {
            _run(...args);
          }, config.pollingInterval);
        }
      });
  };

  const debounceRun = config.debounceInterval ? debounce(_run, config.debounceInterval) : undefined;
  const throttleRun = config.throttleInterval ? throttle(_run, config.throttleInterval) : undefined;

  const run = (...args: any) => {
    // 计数开始
    // 如果存在tryReRequestCount，每次在调用run方法时
    // 将进行复位 意图: 调用run方法视为手动触发
    // 每次手动触发复位 可让错误自动重新请求不止运行一次（需求待讨论）
    if (config.retry) {
      failureCount = 0;
    }
    count = 0;

    // 计数结束

    if (debounceRun) {
      debounceRun(...args);
      // TODO 如果 options 存在 debounceInterval，或 throttleInterval，则 run 和 refresh 不会返回 Promise。 带类型需要修复后，此处变成 return;。
      return Promise.resolve(null as any);
    }
    if (throttleRun) {
      throttleRun(...args);
      return Promise.resolve(null as any);
    }
    return _run(...args);
  };
  const cancel = () => {
    if (debounceRun) {
      debounceRun.cancel();
    }
    if (throttleRun) {
      throttleRun.cancel();
    }
    if (loadingDelayTimer) {
      clearTimeout(loadingDelayTimer);
    }

    if (pollingTimer) {
      clearTimeout(pollingTimer);
    }

    pollingWhenVisibleFlag = false;

    count += 1;
    state.loading = false;
  };
  const mutate = (data: any) => {
    if (typeof data === 'function') {
      state.data = data(state.data) || {};
      return;
    }
    state.data = data;
  };
  const refresh = () => {
    run(state.params);
  };

  // 重新轮询
  const rePolling = () => {
    if (pollingWhenVisibleFlag) {
      pollingWhenVisibleFlag = false;
      refresh();
    }
  };

  if (config.pollingInterval) {
    // @ts-ignore
    unsubscribe.push(subscribeVisible(rePolling));
  }

  // 限制请求
  const limitRefresh = limit(refresh, config.focusTimespan);
  if (config.refreshOnWindowFocus) {
    // @ts-ignore
    unsubscribe.push(subscribeFocus(limitRefresh));
  }

  const unmount = () => {
    unmountedFlag = true;
    cancel();
    unsubscribe.forEach((s) => {
      // @ts-ignore
      s();
    });
  };

  return {
    ...toRefs(state),
    run,
    cancel,
    refresh,
    mutate,
    unmount,
  };
}

function useAsync<R, P extends any[]>(
  service: Service<R, P>,
  options?: BaseOptions<R, P>,
): BaseResult<R, P>;
function useAsync(service: any, options: any): any {
  const _options = options;
  const {
    refreshDeps = [],
    fetchKey,
    cacheKey,
    cacheTime = 5 * 60 * 1000,
    staleTime = 0,
    pollingInterval = 0,
    focusTimespan = 5000,
    refreshOnWindowFocus = false,
    defaultParams = [],
    pollingWhenHidden = true,
    initialData,
    retry, // 发生错误自动重新请求的次数
    manual = false,
  } = _options;

  // 需要赋初值传给useFetch的config
  const config = {
    pollingWhenHidden,
    pollingInterval,
    refreshOnWindowFocus,
    focusTimespan,
    retry,
  };

  const newstFetchKey = ref(DEFAULT_KEY);

  const fetches = reactive({});
  const curFetch = ref({});

  const run = (...args: any) => {
    // 缓存处理开始
    // 如果有 缓存，则从缓存中读数据
    if (cacheKey) {
      // 看这里的代码的时候先看下面setCache的内容
      // cacheData的数据结构{fetches,newstFetchKey}
      const cacheData = getCache(cacheKey)?.data;

      if (cacheData) {
        newstFetchKey.value = cacheData.newstFetchKey;
        Object.keys(cacheData.fetches).forEach((key) => {
          const cacheFetch = cacheData.fetches[key];
          // 取回之前请求的其他方法
          // 如果用下面的方法 在多个请求情况下无法改变loading状态
          fetches[key] = cacheFetch;

          // const newFetch = useFetch(service, _options, {
          //   loading: cacheFetch.loading,
          //   params: cacheFetch.params,
          //   data: cacheFetch.data,
          //   error: cacheFetch.error,
          // });

          // fetches[key] = newFetch;
        });
      }
    }
    // 缓存处理结束
    // 并行请求(可能叫并发请求比较合适)
    if (fetchKey) {
      const key = fetchKey(...args);
      newstFetchKey.value = key === undefined ? DEFAULT_KEY : key;
    }

    const currentFetchKey = newstFetchKey.value;
    let currentFetch = fetches[currentFetchKey];
    if (!currentFetch) {
      const newFetch = useFetch(
        service,
        { ..._options, ...config },
        {
          data: initialData,
        },
      );
      currentFetch = newFetch;

      fetches[currentFetchKey] = currentFetch;
    }
    curFetch.value = currentFetch;
    return currentFetch.run(...args);
  };
  // @ts-ignore
  const cancel = () => curFetch.value.cancel();
  const refresh = () => {
    // @ts-ignore
    if (curFetch.value.refresh) {
      // @ts-ignore
      curFetch.value.refresh();
    } else {
      run(...(defaultParams as any));
    }
  };
  // @ts-ignore
  const mutate = (payload: any) => curFetch.value.mutate(payload);

  onMounted(() => {
    if (!manual) {
      // 如果有缓存，则重新请求
      // ahooks的源码是这个条件 if (Object.keys(fetches).length > 0) {
      // 因为初始化的时候我加了一个默认的空对象 所以这里永远都会大于0
      // 改成判断是否有cacheKey会比较准确
      if (cacheKey) {
        // 如果 staleTime 是 -1，则 cache 永不过期
        // 如果 staleTime 超期了，则重新请求
        const cacheStartTime = getCache(cacheKey)?.startTime || 0;

        // 当前时间-缓存开始的时候是否小于等于预设的缓存数据保持新鲜时间
        if (!(staleTime === -1 || new Date().getTime() - cacheStartTime <= staleTime)) {
          /* 重新执行所有的 cache */
          Object.values(fetches).forEach((f) => {
            // @ts-ignore
            f.refresh();
          });
        }
      } else {
        // 第一次默认执行，可以通过 defaultParams 设置参数
        run(...(defaultParams as any));
      }
    }
  });

  onUnmounted(() => {
    Object.values(fetches).forEach((f) => {
      // @ts-ignore
      f.unmount();
    });
  });

  // 能监听的都是响应式数据
  // 所以能检测fetches，newstFetchKey的改动
  watchEffect(() => {
    if (cacheKey) {
      setCache(cacheKey, cacheTime, {
        fetches,
        newstFetchKey: newstFetchKey.value,
      });
    }
  });

  // refreshDeps
  // refreshDeps是一个数组，用watch只会请求一次
  // 但用watchEffect在初次渲染的时候会请求两次，且不会触发change
  // TODO watch与watchEffect的区别
  watch(refreshDeps, () => {
    if (!manual && refreshDeps.length) {
      /* 全部重新执行 */
      Object.values(fetches).forEach((f) => {
        // @ts-ignore
        f.refresh();
      });
    }
  });

  // const list = useRequest(...)
  // 如果在template直接写list.data
  // 会包含其他vue的冗余字段（toRefs转成ref响应式数据），数据层级也是不对
  // 解决方案有三种

  // 1. 解构。const {data,loading} = useRequest(...)
  // 使用toRefs可以保持数据的响应式

  // 2. 在setup的return返回一个新的值，或者通过计算属性返回新的值
  // setup() {
  //   ...
  //   return {
  //     data:list.data
  //   }
  // }

  // 3. 使用list.curRequest.data
  // curRequest的数据是reactive，可直接使用

  return {
    // @ts-ignore
    data: computed(() => curFetch.value.data),
    // @ts-ignore
    loading: computed(() => curFetch.value.loading),
    // @ts-ignore
    params: computed(() => curFetch.value.params),
    // @ts-ignore
    error: computed(() => curFetch.value.error),
    run,
    cancel,
    refresh,
    mutate,
    fetches,
  };
}

export default useAsync;

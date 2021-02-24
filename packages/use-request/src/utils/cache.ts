type Timer = ReturnType<typeof setTimeout>;

export type CachedKeyType = string | number;
export type CachedData = { data: any; timer: Timer | undefined; startTime: number };

const cache = new Map<CachedKeyType, CachedData>();

// 可设置缓存时间 大于缓存时间后自动清除
const setCache = (key: CachedKeyType, cacheTime: number, data: any) => {
  const currentCache = cache.get(key);
  if (currentCache?.timer) {
    clearTimeout(currentCache.timer);
  }
  let timer: Timer | undefined = undefined;
  if (cacheTime > -1) {
    // 有缓存时间
    timer = setTimeout(() => {
      // 数据在不活跃 cacheTime 后，删除掉
      cache.delete(key);
    }, cacheTime);
  }

  cache.set(key, {
    data,
    timer,
    startTime: new Date().getTime(),
  });
};

const getCache = (key: CachedKeyType) => {
  const currentCache = cache.get(key);
  return {
    data: currentCache?.data,
    startTime: currentCache?.startTime,
  };
};
export { getCache, setCache };

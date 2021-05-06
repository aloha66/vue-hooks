### useRequest

### Todo

- ~~默认请求~~
- ~~手动触发~~
- ~~轮询~~
- ~~并行请求（在 vue2 表现有点问题，应该是响应式的问题）~~
- ~~防抖/节流~~
- ~~延迟加载~~
- ~~依赖请求(vue 在业务代码用 watchEffect 实现即可)~~
- ~~refreshDeps~~
- ~~缓存 & SWR~~
- ~~预加载 感觉功能是实现了缓存的 key 跟预加载的 key 是共用的,实现了缓存约等于实现了预加载(文档预加载只是自动请求并替换缓存数据)~~
- ~~突变~~
- ~~屏幕聚焦重新请求~~
- ~~错误重新请求~~
- ts 类型支持(ps：ts 的类型感觉比较复杂 暂时处理不了，并且把 useAsync.ts 去掉检查 方便打包操作)
- 单元测试

## 代码演示

### 默认请求
<Default />

### 轮询
<!-- <Polling/> -->

### 节流
<Throttle />

### 重试
可自定义重试规则进行自动重试,默认http状态码非200进行重试
- `retry?: boolean | number | ((error: R | Error, failureCount: number) => boolean);` 在http状态码为200的时候只能通过函数的形式进行传递,否则会出现请求死循环.
- `retryDelay?: number` 重试的延迟时间
<Retry />

### 参考

- [ahooks](https://github.com/alibaba/hooks/tree/master/packages/use-request)
- [vue-composable/makeAxios](https://github.com/pikax/vue-composable/blob/master/packages/axios/src/makeAxios.ts)
- [vueuse/useAxios](https://github.com/vueuse/vueuse/blob/master/packages/integrations/useAxios/index.ts)
- [ahooks-vue/useRequest](https://github.com/dewfall123/ahooks-vue/blob/master/packages/vhooks/src/useRequest/index.ts)
- [react-query](https://github.com/tannerlinsley/react-query)



<script setup>
import Default from './demo/Default.vue'
import Polling from './demo/Polling.vue'
import Throttle from './demo/Throttle.vue'
import Retry from './demo/Retry.vue'
</script>
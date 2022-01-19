<script setup>
import Default from '../demo/default.vue'
import Manual from '../demo/manual.vue'
</script>

## 特性
useRequest 是一个强大的异步数据管理的 Hooks，React 项目中的网络请求场景使用 useRequest 就够了。

useRequest 通过插件式组织代码，核心代码极其简单，并且可以很方便的扩展出更高级的功能。目前已有能力包括：



### Todo

- ~~默认请求~~
- ~~手动触发~~
- ~~轮询~~
- ~~并行请求~~
- ~~防抖/节流~~
- ~~延迟加载~~
- ~~依赖请求(vue 在业务代码用 watchEffect 实现即可)~~
- ~~refreshDeps~~
- ~~缓存 & SWR~~
- ~~预加载~~ 感觉功能是实现了缓存的 key 跟预加载的 key 是共用的,实现了缓存约等于实现了预加载(文档预加载只是自动请求并替换缓存数据)
- ~~突变~~
- ~~屏幕聚焦重新请求~~
- 优化修复错误


## 默认用法
<Default />
```vue
<script setup lang="ts">
import { useRequest } from '@vue-hooks-ultra/effect'

const { data, loading } = useRequest(
  'https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312'
)
</script>
<template>
  输出
  <template v-if="loading">loading</template>
  <template v-else>
    {{ data?.data.id }}
  </template>
</template>
```

## 手动触发

如果设置了 `options.manual = true`，则 useRequest 不会默认执行，需要通过 `run` 来触发执行。
<Manual/>

```js
const { loading, run } = useRequest(changeUsername, {
  manual: true
});
```

## 参考

- [ahooks](https://github.com/alibaba/hooks/tree/master/packages/use-request)
- [vue-composable/makeAxios](https://github.com/pikax/vue-composable/blob/master/packages/axios/src/makeAxios.ts)
- [vueuse/useAxios](https://github.com/vueuse/vueuse/blob/master/packages/integrations/useAxios/index.ts)
- [ahooks-vue/useRequest](https://github.com/dewfall123/ahooks-vue/blob/master/packages/vhooks/src/useRequest/index.ts)



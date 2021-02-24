# use-request

### 格式化

配置`.prettierrc`优先度大于项目或 ide 的格式化预设

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

### 参考

- [ahooks](https://github.com/alibaba/hooks/tree/master/packages/use-request)
- [vue-composable/makeAxios](https://github.com/pikax/vue-composable/blob/master/packages/axios/src/makeAxios.ts)
- [vueuse/useAxios](https://github.com/vueuse/vueuse/blob/master/packages/integrations/useAxios/index.ts)
- [ahooks-vue/useRequest](https://github.com/dewfall123/ahooks-vue/blob/master/packages/vhooks/src/useRequest/index.ts)

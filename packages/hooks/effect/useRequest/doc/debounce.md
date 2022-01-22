<script setup>
import Debounce from '../demo/debounce.vue'
</script>
通过设置 `options.debounceWait`，进入防抖模式，此时如果频繁触发 `run` 或者 `runAsync`，则会以防抖策略进行请求。

```tsx | pure
const { data, run } = useRequest(getUsername, {
  debounceWait: 300,
  manual: true
});
```

如上示例代码，频繁触发 `run`，只会在最后一次触发结束后等待 300ms 执行。

你可以在下面 input 框中快速输入文本，体验效果
<Debounce/>
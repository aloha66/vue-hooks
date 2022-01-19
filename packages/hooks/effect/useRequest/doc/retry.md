<script setup>
import Retry from '../demo/retry.vue'
</script>

通过设置 `options.retryCount`，指定错误重试次数，则 useRequest 在失败后会进行重试。

```tsx | pure
const { data, run } = useRequest(getUsername, {
  retryCount: 3,
});
```

如上示例代码，在请求异常后，会做 3 次重试。

你可以在下面 input 框中输入文本，并点击 Edit 按钮，体验效果
<Retry/>
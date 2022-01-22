<script setup>
import RefreshOnWindowFocus from '../demo/refreshOnWindowFocus.vue'
</script>


通过设置 `options.refreshOnWindowFocus`，在浏览器窗口 `refocus` 和 `revisible` 时，会重新发起请求。

```tsx | pure
const { data } = useRequest(getUsername, {
  refreshOnWindowFocus: true,
});
```

你可以点击浏览器外部，再点击当前页面来体验效果（或者隐藏当前页面，重新展示），如果和上一次请求间隔大于 5000ms，则会重新请求一次。
<RefreshOnWindowFocus/>
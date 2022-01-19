<script setup>
import RefreshDeps from '../demo/refreshDeps.vue'
</script>

useRequest 提供了一个 `options.refreshDeps` 参数，当它的值变化后，会重新触发请求。

```tsx | pure
const [userId, setUserId] = useState('1');

const { data, run } = useRequest(() => getUserSchool(userId), {
  refreshDeps: [userId],
});
```

上面的示例代码，`useRequest` 会在初始化和 `userId` 变化时，触发函数执行。

与下面代码实现功能完全一致

```tsx | pure
const [userId, setUserId] = useState('1');

const { data, refresh } = useRequest(() => getUserSchool(userId));

useEffect(() => {
  refresh();
}, [userId]);
```

你可以通过下面示例来体验效果
<RefreshDeps/>
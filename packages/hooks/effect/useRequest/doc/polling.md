通过设置 `options.pollingInterval`，进入轮询模式，`useRequest` 会定时触发 service 执行。

```tsx | pure
const { data, run, cancel } = useRequest(getUsername, {
  pollingInterval: 3000,
});
```

例如上面的场景，会每隔 3000ms 请求一次 `getUsername`。同时你可以通过 `cancel` 来停止轮询，通过 `run/runAsync` 来启动轮询。

你可以通过下面的示例来体验效果
<Demo src="hooks/effect/useRequest/demo/polling"/>
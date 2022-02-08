通过设置 `options.throttleWait`，进入节流模式，此时如果频繁触发 `run` 或者 `runAsync`，则会以节流策略进行请求。

```tsx | pure
const { data, run } = useRequest(getUsername, {
  throttleWait: 300,
  manual: true
});
```

如上示例代码，频繁触发 `run`，只会每隔 300ms 执行一次。

你可以在下面 input 框中快速输入文本，体验效果
<Demo src="hooks/effect/useRequest/demo/throttle"/>
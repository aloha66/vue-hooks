通过设置 `options.loadingDelay` ，可以延迟 `loading` 变成 `true` 的时间，有效防止闪烁。

```tsx | pure
const { loading, data } = useRequest(getUsername, {
  loadingDelay: 300
});

return <div>{ loading ? 'Loading...' : data }</div>
```

例如上面的场景，假如 `getUsername` 在 300ms 内返回，则 `loading` 不会变成 `true`，避免了页面展示 `Loading...` 的情况。

你可以快速点击下面示例中的按钮以体验效果
<Demo src="hooks/effect/useRequest/demo/loadingDelay"/>
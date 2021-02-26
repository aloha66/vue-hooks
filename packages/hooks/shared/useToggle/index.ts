import { ref, Ref, isRef } from 'vue';

// 组合类型 typeA | typeB

// 这里组合类型第二个类型纯粹是容错
// 实际使用上很少把已经存在ref再传递给这个hook使用
export function useToggle(defaultValue: boolean | Ref<boolean> = false) {
  // 有了组合类型或者存在多个类型的时候
  // 需要明确判断什么类型应该走那个流程
  // 否则会被ts提示错误

  // 可用unref语法糖代替
  const state = isRef(defaultValue) ? ref(defaultValue.value) : ref(defaultValue);

  const toggle = (value = !state.value) => {
    state.value = value;
  };

  return [state, toggle] as const;
}

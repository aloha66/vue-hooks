<script setup lang="ts">
const props = defineProps<{
  src: string
}>()

const DemoContainer = defineAsyncComponent(
  () => import(`../../../${props.src}.vue`)
)

console.log(`/${props.src}`, DemoContainer)
</script>

<template>
  <div>
    <suspense>
      <template #default>
        <DemoContainer />
      </template>
      <template #fallback> 组件加载中 </template>
    </suspense>
  </div>
</template>

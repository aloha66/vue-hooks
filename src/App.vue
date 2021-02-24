<template>
  <Demo />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import globalProvide from './globalProvide';
import Demo from './components/demo/index.vue';

export default defineComponent({
  name: 'App',
  setup() {
    // 预留全局配置
    globalProvide();
  },
  components: { Demo },
});
</script>

<style>
</style>
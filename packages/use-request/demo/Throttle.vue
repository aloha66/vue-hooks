<script setup lang="ts">
import { reactive } from 'vue-demi';
import useRequest from '../../use-request/src';

// 为什么要用reactive包装
// https://www.yuque.com/wdvu71/cwtt2d/ybh561
const throttleRequest = reactive(
  useRequest('https://cnodejs.org/api/v1/user/alsotang', {
    manual: true,
    throttleInterval: 2990,
  }),
);
</script>
<template>
  <DemoContainer>
    {{ throttleRequest.data?.data?.avatar_url }}
    <button @click="throttleRequest.run">发送</button>
  </DemoContainer>
</template>

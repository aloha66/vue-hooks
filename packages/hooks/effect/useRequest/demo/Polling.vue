<script setup lang="ts">
import useRequest from '../index';

const { data, cancel, run } = useRequest(
  {
    url: 'https://cnodejs.org/api/v1/topic/5fdb44d70f99cb37f45e3410',
    methods: 'get',
  },
  { pollingInterval: 1000, pollingWhenHidden: false },
);

// console.log('rest', rest);
</script>

<template>
  <DemoContainer>
    浏览量： {{ data?.data?.visit_count }}
    <button @click="run">开始</button>
    <button @click="cancel">停用</button>
    <p>通过设置 options.pollingInterval ，进入轮询模式，定时触发函数执行。</p>
  </DemoContainer>
</template>

<script setup lang="ts">
import useRequest from '../../use-request/src';

const { data } = useRequest({
  url: 'https://cnodejs.org/api/v1/topics',
  methods: 'get',
  params: { aa: 2 },
});
</script>

<template>
  <DemoContainer>
    主题： {{ data?.data?.[0].title }}
    <p>
      在这个例子中， useRequest 接收了一个对象 ，在组件初次加载时， 自动触发该函数执行。同时
      useRequest 会自动管理异步请求的 loading , data , error 等状态。
    </p>
  </DemoContainer>
</template>

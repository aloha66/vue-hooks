<script setup lang="ts">
import useRequest from '../index';

const { data } = useRequest('https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312', {
  //   retry(err, failure) {
  //     return err.data.visit_count < 161275;
  //   },
  retry: true,
  retryDelay: 2000,
});
</script>
<template>
  <DemoContainer>
    {{ data?.data?.visit_count }}
  </DemoContainer>
</template>

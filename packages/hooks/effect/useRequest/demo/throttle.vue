<script setup lang="ts">
import { useRequest } from '@vue-hooks-ultra/effect'

const { data, loading, run } = useRequest<{ data: { id: string } }, any>(
  'https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312',
  { throttleWait: 3000 }
)
</script>
<template>
  <div>
    输出
    <button @click="run">发出请求</button>
    <template v-if="loading">loading</template>
    <template v-else>
      {{ data?.data.id }}
    </template>
  </div>
</template>

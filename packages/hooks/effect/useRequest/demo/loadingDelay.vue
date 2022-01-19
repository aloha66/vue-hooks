<script setup lang="ts">
import { useRequest } from '@vue-hooks-ultra/effect'

const { data, loading } = useRequest<{ data: { id: string } }, any>(
  'https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312',
  { loadingDelay: 2000 }
)
</script>
<template>
  <div>
    输出
    <template v-if="loading">loading</template>
    <template v-else>
      {{ data?.data.id }}
    </template>
  </div>
</template>

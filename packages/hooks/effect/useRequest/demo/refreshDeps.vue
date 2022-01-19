<script setup lang="ts">
import { useRequest } from '@vue-hooks-ultra/effect'

const selected = ref('5433d5e4e737cbe96dcef312')

function getUrl() {
  return 'https://cnodejs.org/api/v1/topic/' + selected.value
}

const { data, loading } = useRequest<{ data: { title: string } }, any>(getUrl, {
  refreshDeps: [selected],
})
</script>
<template>
  <div>
    <select v-model="selected">
      <option disabled value="">Please select one</option>
      <option value="618e03abe6c91ab080916c8a">618e03abe6c91ab080916c8a</option>
      <option value="61a9cf353dbd66476d319440">61a9cf353dbd66476d319440</option>
      <option value="61dbd8fd994582918ef7d174">61dbd8fd994582918ef7d174</option>
    </select>
    <div v-if="loading">加载中</div>
    <div v-else>{{ data?.data.title }}</div>
  </div>
</template>

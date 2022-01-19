<script setup lang="ts">
import { useRequest } from '@vue-hooks-ultra/effect'

const retry1Count = ref(-1)
const retry2Count = ref(-1)

const cancel1 = useRequest<{ data: { id: string } }, any>(
  'https://cnodejs.org/api/v1/topic/',
  {
    retryCount: 3,
    onBefore() {
      retry1Count.value++
    },
  }
)

function getUrl() {
  if (retry2Count.value > 1) {
    return 'https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312'
  }
  return 'https://cnodejs.org/api/v1/topic/'
}
const cancel2 = useRequest<{ data: { id: string } }, any>(getUrl, {
  retryCount: 3,
  onBefore() {
    retry2Count.value++
  },
})

watchEffect(() => {
  console.log('cancel1', cancel1)
})
</script>
<template>
  <div>
    <p>请求{{ retry1Count }}次都失败</p>
    <template v-if="cancel1.loading.value">loading</template>
    <template v-else>
      {{ cancel1.data?.value?.data.id }}
    </template>
  </div>
  <div>
    <p>第二次成功</p>
    <p>请求{{ retry2Count }}次都失败</p>
    <template v-if="cancel2.loading.value">loading</template>
    <template v-else>
      {{ cancel2.data?.value?.data.id }}
    </template>
  </div>
</template>

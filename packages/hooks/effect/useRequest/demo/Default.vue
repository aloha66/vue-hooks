<script setup lang="ts">
import { useRequest } from '@vue-hooks-ultra/effect'
const ss = ref('突突突')

const dd = useRequest(
  'https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312'
)
</script>
<template>输出{{ ss }}</template>

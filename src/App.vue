<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import useRequest from './useRequest'
import axios from 'axios'
import { useAxios } from '@vueuse/integrations/useAxios'
import { ref, watchEffect, watch } from 'vue'

const service = axios.create({})

service.interceptors.response.use(response => {
  return response.data
})

function createCategories(id = '5433d5e4e737cbe96dcef312', params: any) {
  return service({
    url: `https://cnodejs.org/api/v1/topic/${id}`,
    // method: 'post',
    // data,
    method: 'GET',
    params: { counter: counter.value, count: count.value },
  })
}

function getUsername(): Promise<string> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Math.random())
    }, 200)
  })
}

interface Data {
  data: {
    id: string
  }
}

const count = ref(0)
setTimeout(() => {
  count.value++
}, 2000)

const counter = ref(4)
setTimeout(() => {
  counter.value++
  count.value++
}, 4000)

const { data, loading, run } = useRequest<Data, any>(getUsername, {
  // refreshDeps: [count, counter],
  loadingDelay: 200,
})
// const { data, run } = useRequest<Data, any>(
//   'https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312'
// )

// const ax = useAxios('https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312')
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <button @click="run('618e03abe6c91ab080916c8a', { ttt: 666 })">test</button>
  <div v-if="loading">加载中</div>
  <!-- <div>
    {{ data?.data.id }}
  </div> -->
  <div>{{ data }}</div>
  <!-- <div>{{ ax.data.value?.data.id }}</div> -->
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

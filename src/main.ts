import axios from 'axios'
import { createApp } from 'vue'
import App from './App.vue'

const service = axios.create({})

service.interceptors.response.use(response => {
  return response.data
})

createApp(App)
  .provide('UseRequestConfigContext', {
    requestMethod: (param: any) => service(param),
    // requestMethod: axios,
  })
  .mount('#app')

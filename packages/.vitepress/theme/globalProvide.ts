import { provide } from 'vue'
import request from './utils/request'

export default function () {
  provide('UseRequestConfigContext', {
    // 提供改变默认请求库的方法
    // 返回值是自己封装的业务请求库
    requestMethod: (param: any) => request(param),
  })
}

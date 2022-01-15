import useRequest from '../index'
import { retry, useInjectedSetup, getEmitter } from '@test'
import { nextTick, watchEffect } from 'vue-demi'
import '@test/mockServer'

describe('useRequest', () => {
  beforeEach(() => {})

  const emitter = getEmitter()

  it('should be defined', () => {
    expect(useRequest).toBeDefined()
  })

  // it('useRequest should auto run', async () => {
  //   let value, success
  //   const successCallback = text => {
  //     success = text
  //   }
  //   const errorCallback = vitest.fn()
  //   const beforeCallback = () => {
  //     value = 'before'
  //   }
  //   const finallyCallback = () => {
  //     value = 'finally'
  //   }
  // })

  it('shoule have message of hello and loading of false and error of undefined', async () => {
    useInjectedSetup(() => {
      const { loading, data, error } = useRequest(
        'https://example.com?text=hello'
      )

      watchEffect(() => {
        // 不能在useInjectedSetup写async，否则expect不能调用
        emitter.emit('data', data?.value)
        emitter.emit('loading', loading.value)
        emitter.emit('error', error?.value)
      })
    })

    // 不能分开写await,否则会超时 5000ms time out
    const [data, loading, error] = await Promise.all([
      emitter.onPromise('data'),
      emitter.onPromise('loading'),
      emitter.onPromise('error'),
    ])

    expect(data).toBe('hello')
    expect(loading).toBe(false)
    expect(error).toBe(undefined)
  })
})

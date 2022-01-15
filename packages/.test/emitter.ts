import mitt from 'mitt'

const emitter = mitt()

export function getEmitter() {
  return {
    ...emitter,
    onPromise<T extends any>(type: string) {
      return new Promise(reslove => {
        emitter.on(type, e => {
          reslove(e)
        })
      })
    },
  }
}

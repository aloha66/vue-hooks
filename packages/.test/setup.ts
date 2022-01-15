import { vitest, beforeEach } from 'vitest'
const createLocalStorage = () => {
  let state: Record<string, any> = {}

  const localStorageMock: Storage = {
    getItem: vitest.fn(x => state[x]),
    setItem: vitest.fn((x, v) => (state[x] = v)),
    // @ts-ignore
    removeItem: vitest.fn((x, v) => delete state[x]),
    clear: vitest.fn(() => (state = {})),
  }

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  })
}

beforeEach(() => {
  createLocalStorage()
  document.body.innerHTML = ''
  document.head.innerHTML = ''
})

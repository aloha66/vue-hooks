/* eslint-disable spaced-comment */
/// <reference types="vitest" />
/// <reference types="vitest/global" />

import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@pack': resolve(__dirname, 'packages'),
      '@vue-hooks-ultra/effect': resolve(
        __dirname,
        'packages/hooks/effect/index.ts'
      ),
      '@test': resolve(__dirname, 'packages/.test'),
    },
    dedupe: ['vue', 'vue-demi', '@vue/runtime-core'],
  },
  define: {
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
  },
  test: {
    global: true,
    environment: 'jsdom',
    setupFiles: [resolve(__dirname, 'packages/.test/setup.ts')],
    reporters: 'dot',
    deps: {
      inline: ['vue2', '@vue/composition-api', 'vue-demi'],
    },
  },
})

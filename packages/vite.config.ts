import { join, resolve } from 'path'
import type { Plugin, UserConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'

const config: UserConfig = {
  resolve: {
    alias: {
      '@vue-hooks-ultra/effect': resolve(__dirname, 'hooks/effect/index.ts'),
      //   '@vueuse/core': resolve(__dirname, 'core/index.ts'),
      //   '@vueuse/components': resolve(__dirname, 'components/index.ts'),
      //   '@vueuse/docs-utils': resolve(__dirname, '.vitepress/utils.ts'),
    },
    dedupe: ['vue', 'vue-demi', '@vue/runtime-core'],
  },
  plugins: [
    AutoImport({
      /* options */
      imports: ['vue'],
      dts: 'packages/auto-imports.d.ts',
    }),
  ],
  server: {
    port: 6002,
  },
}

export default config

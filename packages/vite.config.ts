import { join, resolve } from 'path'
import type { Plugin, UserConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

const config: UserConfig = {
  resolve: {
    alias: {
      '@vue-hooks-ultra/effect': resolve(__dirname, 'hooks/effect/index.ts'),
      '@test': resolve(__dirname, '../packages/.test'),
      //   '@vueuse/core': resolve(__dirname, 'core/index.ts'),
      //   '@vueuse/components': resolve(__dirname, 'components/index.ts'),
      //   '@vueuse/docs-utils': resolve(__dirname, '.vitepress/utils.ts'),
    },
    dedupe: ['vue', 'vue-demi', '@vue/runtime-core'],
  },
  optimizeDeps: {
    exclude: [
      'vue-demi',
      // '@vue/theme',
      // '@vueuse/shared',
      // '@vueuse/core',
      // 'body-scroll-lock',
    ],
    // include: [
    //   'axios',
    //   'dayjs',
    //   'js-yaml',
    //   'nprogress',
    //   'qrcode',
    //   'rxjs',
    //   'tslib',
    //   'universal-cookie',
    // ],
  },
  plugins: [
    // plugins
    Components({
      dirs: resolve(__dirname, '.vitepress/theme/components'),
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: './.vitepress/components.d.ts',
      transformer: 'vue3',
    }),
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

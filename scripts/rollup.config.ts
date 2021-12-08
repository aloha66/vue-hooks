import fs from 'fs'
import { resolve } from 'path'
import esbuild, { Options as ESBuildOptions } from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import type { OutputOptions, Plugin, RollupOptions } from 'rollup'
import { packages } from '../meta/packages'

// const VUE_DEMI_IIFE = fs.readFileSync(
//   require.resolve('vue-demi/lib/index.iife.js'),
//   'utf-8'
// )
const configs: RollupOptions[] = []

// const injectVueDemi: Plugin = {
//   name: 'inject-vue-demi',
//   renderChunk(code) {
//     return `${VUE_DEMI_IIFE};\n;${code}`
//   },
// }

const buildPlugins = [esbuild()]

const dtsPlugin = [dts()]

const externals = ['vue-demi']

const esbuildMinifer = (options: ESBuildOptions) => {
  const { renderChunk } = esbuild(options)

  return {
    name: 'esbuild-minifer',
    renderChunk,
  }
}

for (const { name, globals, external } of packages) {
  const iifeGlobals = {
    'vue-demi': 'VueDemi',
    ...(globals || {}),
  }

  const iifeName = 'VueUse'
  const functionNames = ['index']

  for (const fn of functionNames) {
    const input = `packages/hooks/${name}/index.ts`

    const output: OutputOptions[] = [
      {
        file: `packages/hooks/${name}/dist/${fn}.cjs`,
        format: 'cjs',
      },
      {
        file: `packages/hooks/${name}/dist/${fn}.mjs`,
        format: 'es',
      },
    ]

    // if (iife !== false) {
    //   output.push(
    //     {
    //       file: `packages/${name}/dist/${fn}.iife.js`,
    //       format: 'iife',
    //       name: iifeName,
    //       extend: true,
    //       globals: iifeGlobals,
    //       plugins: [injectVueDemi],
    //     },
    //     {
    //       file: `packages/${name}/dist/${fn}.iife.min.js`,
    //       format: 'iife',
    //       name: iifeName,
    //       extend: true,
    //       globals: iifeGlobals,
    //       plugins: [
    //         injectVueDemi,
    //         esbuildMinifer({
    //           minify: true,
    //         }),
    //       ],
    //     }
    //   )
    // }

    configs.push({
      input,
      output,
      plugins: buildPlugins,
      external: [...externals, ...(external || [])],
    })

    configs.push({
      input,
      output: {
        file: `packages/hooks/${name}/dist/${fn}.d.ts`,
        format: 'es',
      },
      plugins: dtsPlugin,
      external: [...externals, ...(external || [])],
    })
  }
}

export default configs

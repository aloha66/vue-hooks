import fs from 'fs'
import { resolve } from 'path'
import esbuild, { Options as ESBuildOptions } from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import type { OutputOptions, Plugin, RollupOptions } from 'rollup'

const VUE_DEMI_IIFE = fs.readFileSync(
  require.resolve('vue-demi/lib/index.iife.js'),
  'utf-8'
)
const configs: RollupOptions[] = []

const injectVueDemi: Plugin = {
  name: 'inject-vue-demi',
  renderChunk(code) {
    return `${VUE_DEMI_IIFE};\n;${code}`
  },
}

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

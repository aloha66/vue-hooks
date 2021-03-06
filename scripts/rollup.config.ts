import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import fs from 'fs';
import dts from 'rollup-plugin-dts';
import { Plugin } from 'rollup';
import { activePackages } from '../meta/packages';
const VUE_DEMI_IIFE = fs.readFileSync(require.resolve('vue-demi/lib/index.iife.js'), 'utf-8');

const injectVueDemi: Plugin = {
  name: 'inject-vue-demi',
  renderChunk(code) {
    return `${VUE_DEMI_IIFE};\n;${code}`;
  },
};

const iifeName = 'VueHooks';
const iifeGlobals = {
  'vue-demi': 'VueDemi',
  'lodash.debounce': 'debounce',
  'lodash.throttle': 'throttle',
  vue: 'Vue',
};
const configs = [];

for (const { globals, name, external } of activePackages) {
  configs.push({
    input: `packages/hooks/${name}/index.ts`,
    output: [
      {
        file: `packages/hooks/${name}/dist/index.cjs.js`,
        format: 'cjs',
      },
      {
        file: `packages/hooks/${name}/dist/index.esm.js`,
        format: 'es',
      },
      {
        file: `packages/hooks/${name}/dist/index.iife.js`,
        format: 'iife',
        name: iifeName,
        extend: true,
        globals: iifeGlobals,
        plugins: [injectVueDemi],
      },
      {
        file: `packages/hooks/${name}/dist/index.iife.min.js`,
        format: 'iife',
        name: iifeName,
        extend: true,
        globals: iifeGlobals,
        plugins: [
          injectVueDemi,
          terser({
            format: {
              comments: false,
            },
          }),
        ],
      },
    ],
    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            declaration: false,
          },
        },
      }),
    ],
    external: ['vue-demi', ...(external || [])],
  });

  configs.push({
    input: `packages/hooks/${name}/index.ts`,
    output: {
      file: `packages/hooks/${name}/dist/index.d.ts`,
      format: 'es',
    },
    plugins: [dts()],
    external: ['vue-demi', ...(external || [])],
  });
}

export default configs;

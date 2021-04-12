import { resolve } from 'path';
import { UserConfig } from 'vite';
import WindiCSS from 'vite-plugin-windicss';
import Icons, { ViteIconsResolver } from 'vite-plugin-icons';
import Components from 'vite-plugin-components';
import { hasDemo } from '../scripts/utils';

const config: UserConfig = {
  // 如果不排除vue-demi，会导致vitepress环境下出现问题
  //https://github.com/vueuse/vue-demi/issues/55
  optimizeDeps: {
    exclude: ['vue-demi'],
  },
  plugins: [
    Components({
      dirs: ['.vitepress/theme/components'],
      customLoaderMatcher: (id) => id.endsWith('.md'),
      customComponentResolvers: [
        ViteIconsResolver({
          componentPrefix: '',
        }),
      ],
    }),
    Icons(),
    {
      name: 'vueuse-md-transform',
      enforce: 'pre',
      transform(code, id) {
        if (!id.endsWith('.md')) return null;
        // const [pkg, name, i] = id.split('/').slice(-3);
        const regexp = /packages(.*)(index.md)/;
        const [, pkgPath, i] = id.match(regexp);

        if (i === 'index.md') {
          const frontmatterEnds = code.indexOf('---\n\n') + 4;
          let header = '';
          if (hasDemo(pkgPath))
            header =
              "\n<script setup>\nimport Demo from './demo.vue'\n</script>\n<DemoContainer><Demo/></DemoContainer>\n";
          if (header) code = code.slice(0, frontmatterEnds) + header + code.slice(frontmatterEnds);
          return code;
        }
      },
    },
    WindiCSS({
      scan: {
        dirs: ['.'],
        exclude: ['dist'],
      },
      preflight: false,
    }),
  ],
};

export default config;

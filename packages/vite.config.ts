import { resolve } from 'path';
import { UserConfig } from 'vite';
import WindiCSS from 'vite-plugin-windicss';
import Icons, { ViteIconsResolver } from 'vite-plugin-icons';
import Components from 'vite-plugin-components';

const config: UserConfig = {
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

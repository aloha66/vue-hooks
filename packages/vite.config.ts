import { resolve } from 'path';
import { UserConfig } from 'vite';
import WindiCSS from 'vite-plugin-windicss';

const config: UserConfig = {
  plugins: [
    // WindiCSS(),
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

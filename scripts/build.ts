import path from 'path';
import consola from 'consola';
import { execSync as exec } from 'child_process';
const rootDir = path.resolve(__dirname, '..');

async function build() {
  consola.info('Clean up');
  exec('yarn run clean', { stdio: 'inherit' });

  consola.info('Rollup');
  exec('yarn run build:rollup', { stdio: 'inherit' });
}

async function cli() {
  try {
    await build();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

export { build };

if (require.main === module) cli();

// 目前打包只能用yarn
// pnpm有问题
// https://github.com/ezolenko/rollup-plugin-typescript2/issues/234

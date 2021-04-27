import path from 'path';
import consola from 'consola';
import { execSync as exec } from 'child_process';
const rootDir = path.resolve(__dirname, '..');

const args = require('minimist')(process.argv.slice(2));
const targets = args._;

async function build() {
  consola.info('Clean up');
  exec('yarn run clean', { stdio: 'inherit' });

  consola.info('Rollup');
  exec('yarn run build:rollup', { stdio: 'inherit' });
}

async function fuzzyMatchBuild(targetArr: string[]) {
  consola.info('Clean up:' + targetArr.join(','));
  const cmd = targetArr.map((name) => `packages/*/${name}/dist`).join(' ');
  exec(`npx rimraf dist types ${cmd}`, { stdio: 'inherit' });

  consola.info('Rollup' + targetArr.join(','));
  // exec(`yarn run build:rollup`, { stdio: 'inherit' }); // 不能传参数给rollup进行打包
}

async function cli() {
  try {
    if (!targets.length) {
      await build();
    } else {
      // fuzzyMatchBuild(targets);
    }
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

import { execSync } from 'child_process';
import { resolve, join } from 'path';
import { readJSONSync } from 'fs-extra';

const args = require('minimist')(process.argv.slice(2));
// const targets = args._;
const dest = args.d;

function release() {
  const { version: oldVersion } = readJSONSync('package.json');

  execSync('npx bumpp', { stdio: 'inherit' });

  const { version } = readJSONSync('package.json');

  if (oldVersion === version) {
    console.log('canceled');
    process.exit();
  }

  execSync('npm run update', { stdio: 'inherit' });
  execSync('git add .', { stdio: 'inherit' });

  execSync(`git commit -m "chore: release v${version}"`, { stdio: 'inherit' });
  execSync(`git tag -a v${version} -m v${version}`, { stdio: 'inherit' });
}

function fuzzyMatchRelease() {
  const packageDir = `packages/hooks/${dest}`;
  const packagePath = join(packageDir, 'package.json');
  const formatWindowPath = packagePath.replace(/\\/g, '/'); // window下会出现两个\\ 直接执行npx bumpp xxx会报错

  const { version: oldVersion } = readJSONSync(packagePath);
  execSync(`npx bumpp ${formatWindowPath}`, { stdio: 'inherit' });
  const { version } = readJSONSync(packagePath);

  if (oldVersion === version) {
    console.log('canceled');
    process.exit();
  }

  execSync(`git add ${formatWindowPath}`, { stdio: 'inherit' });

  execSync(`git commit -m "chore: release v${version}"`, { stdio: 'inherit' });
  execSync(`git tag -a v${version} -m v${version}`, { stdio: 'inherit' });
}

if (!dest) {
  release();
} else {
  fuzzyMatchRelease();
}

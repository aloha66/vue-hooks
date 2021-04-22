import { resolve, join, relative } from 'path';
import fs from 'fs-extra';
import { activePackages } from '../meta/packages';

const DIR_SRC = resolve(__dirname, '../packages');
// const DIR_SRC = __dirname; // 不知道为什么 曾经这里是正常获取路径

export function hasDemo(pkgPath: string) {
  console.log("join(DIR_SRC, 'demo.vue')", join(DIR_SRC, pkgPath, 'demo.vue'));
  return fs.existsSync(join(DIR_SRC, pkgPath, 'demo.vue'));
}

export async function updatePackageJSON() {
  const { version } = await fs.readJSON('package.json');
  for (const { name, description, author } of activePackages) {
    const packageDir = join(DIR_SRC);
  }
}

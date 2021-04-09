import { resolve, join, relative } from 'path';
import fs from 'fs-extra';

const DIR_SRC = resolve(__dirname, '../packages');
// const DIR_SRC = __dirname; // 不知道为什么 曾经这里是正常获取路径

export function hasDemo(pkgPath: string) {
  console.log("join(DIR_SRC, 'demo.vue')", join(DIR_SRC, pkgPath, 'demo.vue'));
  return fs.existsSync(join(DIR_SRC, pkgPath, 'demo.vue'));
}

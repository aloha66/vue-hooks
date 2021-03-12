import { resolve, join, relative } from 'path';
import fs from 'fs-extra';

// const DIR_SRC = resolve(__dirname, '../packages');
const DIR_SRC = __dirname;

export function hasDemo(pkgPath: string) {
  console.log("join(DIR_SRC, 'demo.vue')", join(DIR_SRC, pkgPath, 'demo.vue'));
  return fs.existsSync(join(DIR_SRC, pkgPath, 'demo.vue'));
}

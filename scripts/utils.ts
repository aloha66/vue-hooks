import { resolve, join, relative } from 'path'
import fs from 'fs-extra'
import { packages } from '../meta/packages'

const DIR_SRC = resolve(__dirname, '../packages')
// const DIR_SRC = __dirname; // 不知道为什么 曾经这里是正常获取路径

export function hasDemo(pkgPath: string) {
  console.log("join(DIR_SRC, 'demo.vue')", join(DIR_SRC, pkgPath, 'demo.vue'))
  return fs.existsSync(join(DIR_SRC, pkgPath, 'demo.vue'))
}

export async function updatePackageJSON() {
  const { version } = await fs.readJSON('package.json')
  for (const { name, description, author } of packages) {
    const packageDir = join(DIR_SRC, 'hooks', name)
    const packageJSONPath = join(packageDir, 'package.json')
    const packageJSON = await fs.readJSON(packageJSONPath)

    packageJSON.version = version
    packageJSON.description = description || packageJSON.description
    packageJSON.author = author || 'aloha66 <https://github.com/aloha66>'
    packageJSON.bugs = {
      url: 'https://github.com/aloha66/vue-hooks-ultra/issues',
    }
    packageJSON.homepage =
      name === 'core'
        ? 'https://github.com/aloha66/vue-hooks-ultra#readme'
        : `https://github.com/aloha66/vue-hooks-ultra/tree/main/packages/${name}#readme`
    packageJSON.main = './dist/index.cjs.js'
    packageJSON.types = './dist/index.d.ts'
    packageJSON.module = './dist/index.mjs'
    packageJSON.unpkg = './dist/index.iife.min.js'
    packageJSON.jsdelivr = './dist/index.iife.min.js'
    packageJSON.exports = {
      '.': {
        import: './dist/index.mjs',
        require: './dist/index.cjs.js',
      },
      "./*": "./*",
    }
    await fs.writeJSON(packageJSONPath, packageJSON, { spaces: 2 })
  }
}

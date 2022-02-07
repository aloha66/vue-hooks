import { execSync } from 'child_process'
import path from 'path'
import consola from 'consola'
import { packages } from '../meta/packages'

const args = require('minimist')(process.argv.slice(2))
const targets = args._

const nameList = targets.length > 0 ? targets : packages.map(item => item.name)

execSync('npm run build', { stdio: 'inherit' })

for (const name of nameList) {
  execSync('npm publish --access public', {
    stdio: 'inherit',
    cwd: path.join('packages/hooks', name),
  })
  consola.success(`Published @vue-hooks-ultra/${name}`)
}

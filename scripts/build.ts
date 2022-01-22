import path from 'path'
import consola from 'consola'
import { execSync as exec } from 'child_process'

const rootDir = path.resolve(__dirname, '..')
const watch = process.argv.includes('--watch')

const args = require('minimist')(process.argv.slice(2))
const targets = args._

async function build() {
  consola.info('Clean up')
  exec('pnpm run clean', { stdio: 'inherit' })

  consola.info('Rollup')
  exec(`pnpm run build:rollup${watch ? ' -- --watch' : ''}`, {
    stdio: 'inherit',
  })
}

async function cli() {
  try {
    if (!targets.length) {
      await build()
    } else {
      // fuzzyMatchBuild(targets);
    }
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

export { build }

if (require.main === module) cli()

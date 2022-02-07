import { execSync } from 'child_process'
import { resolve, join } from 'path'
import { readJSONSync } from 'fs-extra'

const args = require('minimist')(process.argv.slice(2))
// const targets = args._;
const dest = args.d
const isDryRun = args.dry

const run = (bin, opts = {}) => {
  execSync(bin, { stdio: 'inherit', ...opts })
}

const dryRun = (bin, opts = {}) => {
  console.log(`[dryrun] ${bin}`, opts)
}

const runIfNotDry = isDryRun ? dryRun : run

function release() {
  const { version: oldVersion } = readJSONSync('package.json')

  run('npx bumpp', { stdio: 'inherit' })

  const { version } = readJSONSync('package.json')

  if (oldVersion === version) {
    console.log('canceled')
    process.exit()
  }

  run('npm run update', { stdio: 'inherit' })
  runIfNotDry('git add .', { stdio: 'inherit' })

  runIfNotDry(`git commit -m "chore: release v${version}"`, {
    stdio: 'inherit',
  })
  runIfNotDry(`git tag -a v${version} -m v${version}`, { stdio: 'inherit' })
}

function fuzzyMatchRelease() {
  const packageDir = `packages/hooks/${dest}`
  const packagePath = join(packageDir, 'package.json')
  const formatWindowPath = packagePath.replace(/\\/g, '/') // window下会出现两个\\ 直接执行npx bumpp xxx会报错

  const { version: oldVersion } = readJSONSync(packagePath)
  run(`npx bumpp ${formatWindowPath}`, { stdio: 'inherit' })
  const { version } = readJSONSync(packagePath)

  if (oldVersion === version) {
    console.log('canceled')
    process.exit()
  }

  runIfNotDry(`git add ${formatWindowPath}`, { stdio: 'inherit' })

  runIfNotDry(`git commit -m "chore: release ${dest}v${version}"`, {
    stdio: 'inherit',
  })
  runIfNotDry(`git tag -a ${dest}v${version} -m v${version}`, {
    stdio: 'inherit',
  })
}

if (!dest) {
  release()
} else {
  fuzzyMatchRelease()
}

if (isDryRun) {
  console.log(`\nDry run finished - run git diff to see package changes.`)
}

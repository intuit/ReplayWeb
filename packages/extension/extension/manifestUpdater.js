const fs = require('fs')
const path = require('path')

const version = process.env.npm_package_version
const manifestPath = path.resolve(__dirname, 'manifest.json')
if (!version) {
  throw new Error(
    'npm_package_version not defined in environment, this script should only be run from npm'
  )
} else {
  const manifestContents = JSON.parse(fs.readFileSync(manifestPath))
  fs.writeFileSync(
    manifestPath,
    JSON.stringify({ ...manifestContents, version }, null, 4)
  )
}

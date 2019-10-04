import { exec } from 'child_process'
import { expandHome } from './filesystem'
import { LOCATION } from './common'
/**
 * Wraps `exec` in a promise
 * @private
 * @async
 * @param {string} command - The command to exec
 * @returns {Promise} - exec wrapped in a promise
 */
export function promiseExec(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err)
      } else {
        resolve(stdout)
      }
    })
  })
}

/**
 * Executes the `whoami` bash command in the host environment
 * @async
 * @returns {Promise<string>} - The username of the host
 */
export function whoami() {
  return promiseExec('whoami')
}

/**
 * Uses `which` to see if the provided executable is installed on the host
 * @async
 * @param {string} executable - The executable to
 * @returns {Promise<string>} - The output from `which`
 */
export function checkExecutable(executable) {
  return promiseExec(`which "${executable}"`)
}

/**
 * Changes directory to the provided path and builds with npm
 * @async
 * @param {string} dir - The directory to build in
 * @returns {Promise<string>} - The output of the build command
 */
export function buildPackage(dir = LOCATION) {
  return promiseExec(`cd ${expandHome(dir)} && npm run build`)
}

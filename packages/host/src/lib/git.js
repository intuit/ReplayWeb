import gitP from 'simple-git/promise'
import path from 'path'
import {LOCATION} from './common'
import {expandHome} from './filesystem'

const git = gitP(LOCATION)

/**
 * Gets the current version of the repo
 * @async
 * @returns {string} - The version
 */
export async function getCurrentVersion() {
  const branches = await git.branch()
  return branches.current
}

/**
 * Fetches changes from the remote
 * @async
 * @returns {string} - stdout from the git command
 */
export async function fetchChanges() {
  return await git.fetch({'--all': null})
}

/**
 * Gets the tags for the repo
 * @async
 * @returns {Promise<Array>} - An array of the available tags
 */
export function fetchTags() {
  // for some reason this isnt working as a promise though it does in the REPL
  // return git.tags().then(tags => tags.all)
  return new Promise((resolve, reject) => {
    git.tags({}, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result.all)
      }
    })
  })
}

/**
 * Checks out the provided tag
 * @async
 * @returns {string} - stdout from the git command
 */
export async function checkoutTag(tag) {
  return await git.checkout(tag)
}

/**
 * Switches to the specified tag if available
 * @async
 * @returns {string} - The version
 * @throws {Error} - Thrown if the specified tag was not found
 */
export async function switchToTag(tag) {
  const changes = await fetchChanges()
  const tags = await fetchTags()
  if (tags.find(e => e === tag)) {
    return await checkoutTag(tag)
  } else {
    throw new Error(`Tag not found: ${tag}`)
  }
}

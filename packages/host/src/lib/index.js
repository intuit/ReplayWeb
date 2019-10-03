import {
  getDirectoryContents,
  makeDirectory,
  readFile,
  readFiles,
  saveFile,
  deleteFile
} from './filesystem'
import {
  startOrchestrator
} from './docker'
import {
  whoami,
  checkExecutable,
  buildPackage
} from './shell'
import {
  getCurrentVersion,
  switchToTag,
} from './git'

/**
 * Function to be used with `chrome-native-messaging` Transformer
 * @param {Object} msg - The message from chrome
 * @param {Function} push - Function provided by Transformer to push data to stdout
 * @param {Function} done - Function provided by Transformer to indicate that we're done handling the messsage
 */
export function messageHandler (msg, push, done) {
  const success = (data) => {
    push({
      success: true,
      data
    })
    done()
  }
  const failure = (data) => {
    push({
      success: false,
      msg,
      data
    })
    done()
  }
  switch (msg.type) {
    case 'mkdir':
      return makeDirectory(msg.data)
        .then(() => success())
        .catch(e => failure(e.message))
    case 'listDir':
      try {
        success(getDirectoryContents(msg.data))
      } catch (e) {
        failure(e.message)
      }
      break
    case 'readFile':
      try {
        success(readFile(msg.filepath))
      } catch (e) {
        failure(e.message)
      }
      break
    case 'readFiles':
      try {
        success({files: readFiles(msg.filepaths)})
      } catch (e) {
        failure(e.message)
      }
      break
    case 'saveFile':
      try {
        const {folder, fileName, data} = msg.data
        success(saveFile(folder, fileName, data))
      } catch (e) {
        failure(e.message)
      }
      break
    case 'deleteFile':
      try {
        const {folder, fileName} = msg.data
        success(deleteFile(folder, fileName))
      } catch (e) {
        failure(e.message)
      }
      break
    case 'checkExecutable':
      return checkExecutable(msg.executable)
        .then(output => {
          success({output})
        })
        .catch(e => {
          failure(e.message)
        })
    case 'whoami':
      return whoami()
        .then(output => {
          success({output})
        })
        .catch(e => {
          failure(e.message)
        })
    case 'startOrchestrator':
      return startOrchestrator(msg.port)
        .then(details => {
          success(details)
        })
        .catch(e => {
          failure(e.message)
        })
    case 'version':
      return getCurrentVersion()
        .then(version => {
          success(version)
        })
        .catch(e => {
          failure(e.message)
        })
    case 'update':
      return switchToTag(msg.tag)
        .then(() => buildPackage())
        .then(() => getCurrentVersion())
        .then(version => {
          success(version)
        })
        .catch(e => {
          failure(e.message)
        })
    default:
      failure(msg)
      break
  }
}

import path from 'path'
import fs from 'fs'
import mkdirp from 'mkdirp'

/**
 * Expands the ~ shortcut in bash into the absolute path
 * @private
 * @param {string} filePath - The path to expand
 * @returns {string} - The expanded file path
 */
export function expandHome (filePath) {
  if (filePath[0] === '~') {
    return path.join(process.env.HOME, filePath.slice(1))
  }
  return filePath
}

/**
 * Gets the contents of a directory, ommitting dot files/dot directories
 * @param {string} filePath - The directory to get contents for
 * @returns {Array<Object>} - The contents of the directory
 */
export function getDirectoryContents (filePath) {
  const basePath = expandHome(filePath)
  const files = fs.readdirSync(basePath)
  return files.map(f => ({
    name: f,
    isDirectory: fs.lstatSync(path.resolve(basePath, f)).isDirectory(),
    fullpath: path.join(filePath, f)
  }))
    .filter(f => f.name[0] !== '.')
}

/**
 * Create a given directory if it does not exist
 * @async
 * @param {string} filePath - The directory to create
 * @returns {Promise} - A promise that resolves on success
 */
export function makeDirectory (filePath) {
  const fullpath = expandHome(filePath)
  return new Promise((resolve, reject) => {
    mkdirp(fullpath, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

/**
 * Gets the contents of a file and parses the JSON
 * @param {string} filePath - The path to the JSON file to read
 * @returns {Object} - An object containing the parsed JSON data and the filename
 * @throws {SyntaxError} - Thrown if provided filepath is not a JSON file
 */
export function readFile (filePath) {
  const data = fs.readFileSync(expandHome(filePath), 'utf8')
  const JSONdata = JSON.parse(data)
  return {
    file: filePath,
    testName: path.parse(filePath).name,
    data: JSONdata
  }
}

/**
 * Read the contents of multiple files
 * @param {Array<string>} filePaths - The file paths to read data for
 * @returns {Array<Object>} - Array containing parsed JSON
 * @throws {SyntaxError} - Thrown if provided filepath is not a JSON file
 */
export function readFiles (filePaths) {
  return filePaths
    .filter(fp => path.parse(fp).ext.toLowerCase() === '.json')
    .map(fp => readFile(fp))
}

/**
 * Write the provided data to a file
 * @param {string} folder - The folder to write to
 * @param {string} fileName - The name of the file to write out to
 * @param {Object} data - Object to JSON.stringify as the contents of the file
 * @returns {Object} - Data about the resulting saved file
 * @throws {Error} - Thrown if there is a problem writing to the filesystem
 */
export function saveFile (folder, fileName, data) {
  const fullpath = path.resolve(expandHome(folder), `${fileName}.json`)
  const JSONdata = JSON.stringify(data, null, 2)
  fs.writeFileSync(fullpath, JSONdata)
  return {fullpath, JSONdata}
}

/**
 * Delete the specified file from the filesystem
 * @param {string} folder - The folder the file is in
 * @param {string} fileName - The name of the file to delete
 * @throws {Error} - Thrown if there is a problem deleting from the filesystem
 */
export function deleteFile(folder, fileName) {
  const fullpath = path.resolve(expandHome(folder), `${fileName}.json`)
  fs.unlinkSync(fullpath)
}

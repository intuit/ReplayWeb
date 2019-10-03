import path from 'path'
import fs from 'fs'
import { argv } from 'yargs'
import 'isomorphic-fetch'
import { polyfill } from 'es6-promise'
import { AsyncParallelHook } from 'tapable'
import { runCommand } from './command_runner'
import video from 'wdio-video-reporter'
import {
  getCapabilities,
  getSeleniumConfig,
  getServices,
  getEnvironment
} from './configuration'
import { log, loadPlugin } from './utilities'
polyfill()

/**
 * Runs commands for the given test definition object
 * @public
 * @param {Object} testDef - The test object to run, from the replay extension
 * @param {Array} testDef.commands - An array of commands
 * @param {string} testDef.commands[].command - The command to execute
 * @param {Object} testDef.commands[].parameters - The parameters for the command
 * @param {number} implicitWait - The value to use when implicitly waiting for elements
 * @param {string[]|array[]} plugins - Array of plugins from config file to load
 * @returns {Promise} - A promise chain of webdriverio commands
 */
export async function runCommands({ commands, metadata }, implicitWait = 7000, delay = null, plugins = []) {
  const pause = (timeout) => () => new Promise(resolve => setTimeout(() => resolve(true), timeout))
  const context = {}

  const hooks = makeHooks(plugins)

  await hooks.beforeTest.promise(process.env.REPLAY_TEST_NAME || '', browser)

  return commands.reduce(
    (acc, cmd) => acc.then(() => runCommand(cmd, context, implicitWait, hooks).then(delay ? pause(delay) : Promise.resolve())),
    Promise.resolve(true)
  )
    .then(async r => {
      await hooks.afterTest.promise(process.env.REPLAY_TEST_NAME || '', browser, context, metadata)
      return r
    })
    .catch(async e => {
      await hooks.onError.promise(e, browser, process.env.REPLAY_TEST_NAME || '')
      // Rethrow error so test execution still halts
      // Plugins are able to view the error and do cleanup, but not prevent test from failing
      throw e
    })
}

/**
 * Creates the hooks for running tests and registers plugins
 * @param {string[]|array[]} pluginData - Array of plugin data from config file
 */
export function makeHooks(pluginData = []) {
  const hooks = {
    beforeTest: new AsyncParallelHook(["testName", "browser"]),
    afterTest: new AsyncParallelHook(["testName", "browser", "context", "metadata"]),
    beforeCommand: new AsyncParallelHook(["command", "context", "browser"]),
    onElement: new AsyncParallelHook(["element", "browser", "command", "context", "testName"]),
    onError: new AsyncParallelHook(["error", "browser", "testName"])
  }
  hooks.beforeCommand.tapPromise(
    'Running Command',
    async ({ command, parameters }) => console.log(`${process.env.REPLAY_TEST_NAME || ''} - Running command: ${command} | ${JSON.stringify(parameters)}`)
  )
  const plugins = pluginData.map(loadPlugin)
  plugins.forEach(p => p.apply(hooks))
  return hooks
}

/**
 * This function is used to clean up the temporary folders created by the
 * `runInParallel` function
 * @public
 */
export function removeTemporaryFiles() {
  console.log('Cleaning temporary test folders')
  const currentFiles = fs.readdirSync(process.cwd())
  const replayFiles = currentFiles.filter(f => f.includes('.replay-tests'))
  replayFiles.forEach(f => {
    const fullpath = path.resolve(process.cwd(), f)
    const stats = fs.lstatSync(fullpath)
    if (stats.isDirectory()) {
      fs.readdirSync(fullpath).forEach(child => {
        fs.unlinkSync(path.resolve(fullpath, child))
      })
      fs.rmdirSync(fullpath)
    } else {
      fs.unlinkSync(fullpath)
    }
  })
}

/**
 + * Searches directory tree for JSON files.
 + * @param {string} dir - The parent directory representing the tree to search.
 + * @param {function} callback - This function will report a sub-directory when found.
 + * @returns {Array<String>} - If directory exists, then returns an array of full path names to all JSON files found. Otherwise, returns an empty array.
 + */
export function getJsonFiles(dir, callback) {
  const filesList = new Array()
  fs.readdirSync(dir).forEach(f => {
    const dirEntry = path.join(dir, f);
    if (fs.statSync(dirEntry).isDirectory()) {
      typeof callback === 'function' && callback(dirEntry)
      getJsonFiles(dirEntry, callback).map(thisItem => filesList.push(thisItem))
    }
    else {
      filesList.push(dirEntry)
    }
  });
  return filesList.filter(f => path.parse(f).ext.toLowerCase() === '.json')
}

/**
 * Gets the contents of all of the block files for the given directory
 * @private
 * @param {string} blockPath - The path to the blocks
 * @returns {Array<Object>} - An array of Objects that are the blocks
 */
export function getAllBlockContents(blockPath) {
  return getJsonFiles(blockPath, (dir) => {
    log('index.getAllBlockContents; sub-directory found:\t' + dir, true);
  }).map(fileName => ({
    name: path.parse(fileName).name,
    // parse it into json to validate that it is JSON
    data: JSON.parse(fs.readFileSync(fileName))
  }))
}

/**
 * Gets all of the JSON test files that should be run
 * uses flags from `yargs` to determine filtering
 * @private
 * @param {string} testsPath - The path to the test files
 * @returns {Array<string>} - An array of filenames to process as tests
 */
export function getJsonTestFiles(testsPath) {
  return getJsonFiles(testsPath, (dir) => {
    log('index.getJsonTestFiles; sub-directory found:\t' + dir, true);
  }).filter(f => {
    if (argv.test) {
      return path.parse(f).name === argv.test
    } else if (argv.startsWith) {
      return path.parse(f).name.startsWith(argv.startsWith)
    }
    return true
  }).map(value => path.parse(value).base)
}

/**
 * Generates mocha/webdriverio test files at runtime in the current working
 * directory. Creating these files allows the `wdio` testrunner to execute them
 * in parallel
 * @public
 * @param {string} filePath - Path to the folder of tests
 * @param {Object} options - Additional options for configuration
 * @param {string} options.blockPath - The path to a folder of blocks to associate with these tests
 * @param {number} options.timeout - Sets the timeout for mocha for these tests
 * @param {number} options.retries - Sets the retries for mocha for these tests
 * @param {number} options.delay - Delay to add between each command being processed
 * @returns {Array<string>} - Array of filepaths to the generated files
 */
export function runInParallel(filePath, options = {}) {
  const blocks = !options.blockPath ? [] : getAllBlockContents(options.blockPath)
  // put back into a JSON string so it can be inserted into the test files
  const blocksAsString = JSON.stringify(blocks)
  const testsPath = path.resolve(process.cwd(), filePath)
  const tmpDir = fs.mkdtempSync(path.resolve(process.cwd(), '.replay-tests'))
  const testFiles = getJsonTestFiles(testsPath)
    .map(fileName => ({
      path: path.resolve(tmpDir, `${path.parse(fileName).name}.js`),
      contents: `
global.expect = require('chai').expect
const replayRunner = require('@replayweb/testrunner');
const baseCommands = require('${path.resolve(testsPath, fileName)}');
const { expandBlocks } = require('@replayweb/utils');

// Parse the blocks as a string so that we don't have to a file read of all blocks for every test
const expandedCommands = expandBlocks(baseCommands.commands,(${blocksAsString}));
const commands = {commands: expandedCommands, metadata: baseCommands.metadata};
describe('replay', function() {
  ${options.retries ? `this.retries(${options.retries})` : ''}
  ${options.timeout ? `this.timeout(${options.timeout})` : ''}
  it('${fileName}', () => {
    process.env.REPLAY_TEST_NAME = '${fileName}'
    return replayRunner.runCommands(
      commands,
      ${options.elementWait || 7000},
      ${options.delay || null},
      ${JSON.stringify(options.plugins || [])}
      );
  });
});
`
    }))

  if (testFiles.length === 0) {
    throw new Error(`No test files found in ${filePath}. Do the files end in '.json'?`)
  }

  testFiles.forEach(f => {
    fs.writeFileSync(f.path, f.contents)
  })
  return testFiles.map(f => f.path)
}

/**
 * Generates mocha/webdriverio test files by adding each of the login blocks to all the tests
 * at runtime in the current working directory. Creating these files allows the `wdio` testrunner
 * to execute them in parallel
 * @public
 * @param {string} filePath - Path to the folder of tests
 * @param {Object} options - Additional options for configuration
 * @param {string} options.blockPath - The path to a folder of blocks to associate with these tests
 * @param {number} options.timeout - Sets the timeout for mocha for these tests
 * @param {number} options.retries - Sets the retries for mocha for these tests
 * @param {number} options.delay - Delay to add between each command being processed
 * @returns {Array<string>} - Array of filepaths to the generated files
 */
export function runInParallelAllRegions(filePath, options = {}) {
  if (!options.loginBlockPath) {
    throw new Error(`loginBlockPath is undefined in replay.config.json but runInAllRegions is true`)
  }
  const fullLoginBlockPath = options.loginBlockPath ? path.resolve(process.cwd(), options.loginBlockPath) : undefined
  const loginBlocksExist = fs.existsSync(fullLoginBlockPath)

  if (fullLoginBlockPath && !loginBlocksExist) {
    throw new Error(`loginBlockPath is defined in replay.config.json but the path does not exist ${fullLoginBlockPath}`)
  }

  const loginBlocks = !fullLoginBlockPath ? [] : getAllBlockContents(fullLoginBlockPath)

  if (!loginBlocks || loginBlocks.length === 0) {
    throw new Error(`No login blocks found in path: ${options.loginBlockPath}`)
  }

  const blocks = !options.blockPath ? [] : getAllBlockContents(options.blockPath)
  const blocksAsString = JSON.stringify(blocks)

  const testsPath = path.resolve(process.cwd(), filePath)
  const tmpDir = fs.mkdtempSync(path.resolve(process.cwd(), '.replay-tests'))

  const testFiles = getJsonTestFiles(testsPath).map(tmpTest => {
    const fileContent = JSON.parse(fs.readFileSync(`${path.resolve(testsPath, tmpTest)}`))
    const expandedCommands = expandLoginBlockForAllRegions(fileContent.commands, loginBlocks)
    return expandedCommands.map(({ locale, commands }) => ({
      path: path.resolve(tmpDir, `${path.parse(tmpTest).name}_${locale}.js`),
      contents: `
      global.expect = require('chai').expect
      const replayRunner = require('@replayweb/testrunner');
      const { expandBlocks } = require('@replayweb/utils');

      const baseCommands = ${JSON.stringify(commands)}

      const new_expandedCommands = expandBlocks(baseCommands, (${blocksAsString}));

      const commands = {commands: new_expandedCommands, metadata: ${JSON.stringify(fileContent.metadata)}};
      describe('replay', function() {
        ${options.retries ? `this.retries(${options.retries})` : ''}
        ${options.timeout ? `this.timeout(${options.timeout})` : ''}
        it('${path.parse(tmpTest).name} --> ${locale}', () => {
          process.env.REPLAY_TEST_NAME = '${path.parse(tmpTest).name}_${locale}'
          return replayRunner.runCommands(
            commands,
            ${options.elementWait || 7000},
            ${options.delay || 3000},
            ${JSON.stringify(options.plugins || [])}
            );
        });
      });
      `
    }))
  }).reduce((acc, cv) => {
    return acc.concat(cv, [])
  }, [])

  if (testFiles.length === 0) {
    throw new Error(`No test files found in ${filePath}. Do the files end in '.json'?`)
  }

  testFiles.forEach(f => {
    fs.writeFileSync(f.path, f.contents)
  })
  return testFiles.map(f => f.path)
}

export function expandLoginBlockForAllRegions(commands = [], blocks = []) {
  const newCommands = blocks.map(block => ({
    locale: block.data.commands.find(b => b.parameters && b.parameters.locale).parameters.locale,
    commands: block.data.commands.concat(commands)
  }))
  return newCommands
}

/**
 * Reads configuration file information and returns an object with relevant information
 * to be consumed by webdriverio in a wdio.conf.js
 * @public
 * @param {string} folderPath - An optional argument to specify the folder where the config is located
 * @return {Object} An object with specs, and suites
 */
export function loadFromConfig(folderPath = '.', runInAllRegions = false) {
  const configFolder = path.resolve(process.cwd(), folderPath)
  const configLocation = path.resolve(configFolder, 'replay.config.json')
  if (fs.existsSync(configLocation)) {
    const config = fs.readFileSync(configLocation, 'utf8')
    try {
      const configData = JSON.parse(config)
      // Set a default value for suites in case it isn't defined
      const { runOptions, testPath, blockPath, suites = [] } = configData
      // Check for existence of paths
      const fullTestPath = path.resolve(configFolder, testPath)
      if (!fs.existsSync(fullTestPath)) {
        throw new Error(`testPath does not exist at: ${fullTestPath}`)
      }
      const fullBlockPath = blockPath ? path.resolve(configFolder, blockPath) : undefined
      const blocksExist = fs.existsSync(fullBlockPath)

      if (fullBlockPath && !blocksExist) {
        console.warn(`blockPath is defined in replay.config.json but the path does not exist`)
      }

      const specs = runInAllRegions ? runInParallelAllRegions(
        fullTestPath,
        {
          blockPath: blocksExist ? fullBlockPath : undefined,
          ...runOptions
        }
      ) : runInParallel(
        fullTestPath,
        {
          blockPath: blocksExist ? fullBlockPath : undefined,
          ...runOptions
        }
      )
      /*
       * Map through suites object keys and generate a new object with the same keys
       * but the values are arrays pointing to the generated paths from runInParallel
       */
      const suiteContents = Object.keys(suites)
        .map(
          s => ({
            [s]: suites[s].map(
              test => specs.find(tempPath => {
                const p = path.parse(tempPath)
                return p.name === test
              })
            )
          })
        )
        .reduce((acc, cv) => ({ ...acc, ...cv }), {})
      return { specs, suites: suiteContents }
    } catch (e) {
      if (e.message.includes('does not exist at')) {
        throw e
      } else {
        console.log(e)
        throw new Error('replay.config.json did not have valid JSON')
      }
    }
  } else {
    throw new Error('No replay.config.json found in the current directory')
  }
}

/**
 * Returns a default webdriverio configuration
 * @public
 * @param {Object} options - An options object to set the nested properties of some generated objects
 * @param {Object} options.selenium - Version overrides for selenium, and the drivers
 * @param {boolean} options.applitools - Flag to include the applitools service
 * @param {Object} options.capabilities - Object to add more capabilities to the defaults, so the --capabilities flag can be used
 * @return {Object} An object that is a webdriverio config without specs or suites
 */
export function getDefaults(options = {}) {
  const { port: portFlag = 4444, caps: capFlag = undefined } = argv
  const { selenium, applitools, capabilities, logDir = './target/surefire-reports' } = options
  const { hostname, port, path, protocol } = getEnvironment(portFlag)
  const runSelenium = argv['selenium-started'] === undefined
  const seleniumConfig = getSeleniumConfig(selenium, portFlag)
  return {
    capabilities: getCapabilities(capabilities, capFlag),
    port,
    hostname,
    path,
    protocol,
    seleniumArgs: seleniumConfig,
    seleniumInstallArgs: seleniumConfig,
    services: getServices(runSelenium, applitools),
    framework: 'mocha',
    mochaOpts: {
      timeout: 300000
    },
    reporters: [
      'spec',
      [
        'junit',
        {
          outputDir: logDir,
          outputFileFormat: opts => `junit-results-${opts.cid}.xml`
        }
      ]
    ],
    acceptSslCerts: true,
    javascriptEnabled: true,
    locationContextEnabled: true,
    applicationCacheEnabled: true,
    cssSelectorsEnabled: true,
    sync: false,
    logLevel: 'error',
    onComplete: () => { removeTemporaryFiles() }
  }
}


/**
 * overrides default and returns webdriverio configuration to capture video and generate allure reporting for workflows
 */
export function getDefaultsVideoPlusAllure(options = {}) {
  const { reporters, ...defaults } = getDefaults(options)
  return {
    ...defaults,
    reporters: [...reporters,
    [video, {
      saveAllVideos: true,       // If true, also saves videos for successful test cases
      videoSlowdownMultiplier: 5, // Higher to get slower videos, lower for faster videos [Value 1-100]
      videoRenderTimeout: 5,      // Max seconds to wait for a video to finish rendering
    }],
    ['allure', {
      outputDir: './_results_/allure-raw',
      disableWebdriverStepsReporting: false,
      disableWebdriverScreenshotsReporting: false,
    }],
    ],
    runner: 'local',
    services: undefined,
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    sync: true,
    logLevel: 'debug',
    onComplete: () => {
      removeTemporaryFiles();
    }
  }
}


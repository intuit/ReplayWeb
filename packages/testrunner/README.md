# ReplayWeb Test Runner

Test Runner package converts tests recorded by the ReplayWeb extension into webdriverio promise chains to run as functional tests through [webdriverio](https://webdriver.io/).

## Installation

Run the following to install the Test Runner.

```sh
yarn add -D @replayweb/testrunner
```

### Peer Dependencies

`@replayweb/testrunner` requires `webdriverio` version `5.0` or newer, as well as a few of the packages in the `@wdio` scope. These are set as peer dependencies to make it easier for users to control the specific versions of packages

`webdriverio` - The framework that communicates with selenium

`@wdio/cli` - Command line interface for the test runner

`@wdio/local-runner` - A runner for local test running

`@wdio/mocha-framework` - Adapter to use the mocha framework for testing

`@wdio/junit-reporter` - Reporter to output in JUnit format for Jenkins

`@wdio/spec-reporter` - Reporter for output in the CLI

`@wdio/allure-reporter` - Reporter to output with Allure

`@wdio/selenium-standalone-service` - Service to manage running selenium, and downloading drivers for browsers

`chai` - Assertion library that works well with `mocha`

To add these to your project just run:

```sh
yarn add -D @wdio/cli @wdio/local-runner @wdio/junit-reporter @wdio/mocha-framework @wdio/selenium-standalone-service @wdio/spec-reporter webdriverio chai
```

or

```sh
yarn add -D @wdio/cli @wdio/local-runner @wdio/junit-reporter @wdio/mocha-framework @wdio/selenium-standalone-service @wdio/spec-reporter webdriverio chai
```

#### Optional Peer Dependencies

`@wdio/applitools-service` - Service for supplying applitools functionality. This is only needed if you use applitools, and have it configured in [Additional Configuration](#Additional-Configuration).

## Usage details

### Zero Config Setup

If you're setting up UI Automation for the first time, and starting with replay, there is almost no configuration to write, just add this to a file called `wdio.conf.js`:

```js
const { getDefaults, loadFromConfig } = require('@replayweb/testrunner')
exports.config = { ...getDefaults(), ...loadFromConfig() }
```

This configuration will load all your tests and suites from your `replay.config.json`, and run them against chrome by default, starting and stopping selenium for you.

All you need to do to run it is execute the `wdio` command, the preferred method is from a script in `package.json`:

```js
{
    "scripts": {
        // The rest of your scripts
        "replay": "wdio"
    },
    // The rest of your package.json
}
```

### Command Line Flags

When running, there are a few convenience flags you can supply on the command line to make local runs easier:

`--caps` - This flag takes a comma separated list of 1 or more capabilities to run against. By default, capabilities are preconfigured for `chrome`, `firefox` and `headless` (which is chrome in headless mode):

```sh
yarn test -- --caps=chrome,firefox
```

`--port` - This flag changes the port that webdriverio uses to connect to selenium, and if selenium-standalone is handling running selenium for you, it will start it on the same port. This is useful if you have something else occupying the default selenium port of `4444`

```sh
yarn test -- --port=5555
```

`--test` - This flag will filter the tests for just the one specified, the specified test name should not include the `.json` file extension. This changes the `spec` array returned by `loadFromConfig`.

```sh
# To run just SmokeTest.json
yarn test -- --test=SmokeTest
```

`--startsWith` - This flag will filter the tests for anything starting with the string provided. This way you can run arbitrary groups of tests without needing to put them in a suite.

```sh
# To run Smoke*.json
yarn test -- --startsWith=Smoke
```

`--suite` - This flag is handled by webdriverio, but suites are provided by `loadFromConfig` as defined in your `replay.config.json`:

```json
{
    "testPath": "./tests",
    "blockPath": "./blocks",
    "suites": {
        "smoketests": [
            "SmokeTest"
        ]
    }
}
```

```sh
yarn test -- --suite=smoketests
```

`--selenium-started` - This flag disables the `@wdio/selenium-standalone-service` from being used. This is intended for use in CI environments, or if you want to run selenium on your own.

```sh
yarn test -- --selenium-started
```

### Additional Configuration

#### Migrating to Replay

If you're migrating to Replay and need to mix with hand coded webdriverio scripts, it's easy to do. The `loadFromConfig` function returns webdriverio formatted `specs` and `suites` that can be extended:

```javascript
const { getDefaults, loadFromConfig } = require('@replayweb/testrunner')
const { specs, suites } = loadFromConfig()

exports.config = {
    ...getDefaults(),
    specs: [
        ...specs,
        './tests/test.js' // test files to include when running all tests
    ],
    suites: {
        ...suites,
        suite1: [ // any additional suites
            './tests/test.js'
        ]
    }
}
```

#### Enhancing Defaults

There are some configuration options that are deeply nested, such as the selenium standalone install arguments, that you may want to change. Recreating these objects would be tedious and expand your configuration greatly, in order to change one version. To solve this, the `getDefaults` function, takes an object as a parameter, to override some nested properties.

```js
const defaultConfig = getDefaults({
    // Override versions used for selenium standalone
    // without having to create the entire config object yourself
    // any combination of these versions can be provided, the full object
    // is not required
    selenium: {
        seleniumVersion: '',
        chromedriverVersion: '',
        firefoxdriverVersion: '',
        iedriverVersion: ''
    },
    // To add the applitools service to the services, while preserving the
    // --selenium-started flag functionality
    // this requires that you install @wdio/applitools-service@^5.9.0
    applitools: true,
    // Add capabilities to the capability object, so they can be used with the
    // --capabilities flag
    capabilities: {
        // Add a specific version of firefox for --capabilities=firefox55
        firefox55: {
            browserName: 'firefox',
            browserVersion: '55.0'
        }
    },
    // Change log directory
    logDir: './customLogDir'
})
```

#### Override Anything

Since `getDefaults` just returns an object that gets spread out, you can override any properties very easily:

```js
const { getDefaults, loadFromConfig } = require('@replayweb/testrunner')
exports.config = {
    ...getDefaults(), // provides defaults for selenium, hostname, port, capabilities, etc.
    ...loadFromConfig() // provides specs and suites
    mochaOpts: {
    	timeout: 120000 // change mocha timeout to 2 minutes (default is 5)
  }
}
```

##### All Provided Properties

The following properties are provided by `getDefaults`:

`hostname`, `port`, `path`, `protocol`, `capabilities`, `seleniumArgs`, `seleniumInstallArgs`, `services`, `framework`, `mochaOpts`, `reporters`, `acceptSslCerts`, `javascriptEnabled`, `locationContextEnabled`, `applicationCacheEnabled`, `cssSelectorsEnabled`, `sync`, `logLevel`, `onComplete`

#### onComplete

If you override the `onComplete` function, you'll need to call the `removeTemporaryFiles` function to ensure generated test files are cleaned up:

```js
const {
    getDefaults,
    loadFromConfig,
    removeTemporaryFiles
} = require('@replayweb/testrunner')
exports.config = {
    ...getDefaults(),
    ...loadFromConfig()
    onComplete: (exitCode, config, capabilities, result) => {
        someCustomReportCode(result)
        removeTemporaryFiles() // cleans up all generated replay test files
    }
}
```

#### Test Specific Mocha Options

`replay.config.json` can also change the functionality for each of the generated mocha tests, allowing you to add retries and change the timeout for individual tests:

```json
{
    "runOptions": {
      "retries": 3,
      "timeout": 600000
    },
    "testPath": "./tests",
    "blockPath": "./blocks",
    "suites": {
        "smoketests": [
            "SmokeTest"
        ]
    }
}
```

#### replay.config.json

Your config file that stores the location to your tests, and your suite information supports an extra configuration object used only by `@replayweb/testrunner` to configure the individual generated test files.

`retries` - Setting this key adds `this.retries(number)` into the generated mocha test file.

`timeout` - Setting this key adds `this.timeout(number)` into the generated mocha test file.

`elementWait` - Setting this key changes the timeout for commands that implicitly wait for element availability (such as `click` or `type`). The default value for this is `7000` milliseconds.

`delay` - Setting this key adds a delay between each command being processed. This does not send a pause command to selenium, it delays execution in the NodeJS process.

```js
{
    "runOptions": {
        "retries": 3, // sets the number of retries for each test in mocha
        "timeout": 120000, // sets the timeout of each test to the specified value in ms
        "elementWait": 10000, // changes the timeout for commands that implicitly wait
        "delay": 3000, // delay 3 seconds between commands
    },
    "testPath": "",
    "blockPath": "",
    "suites": {}
}
```

### Running on Jenkins

1. Create a new jenkins job
1. For the build execution section, provide the following:

```sh
yarn
yarn replay
```

Assuming that you have an package.json script of `replay` that runs your tests as described above.

## Developing

### Test Runner Development

This section describes how to work on `@replayweb/testrunner`

#### Getting Started

Clone the repository, and navigate into the cloned directory:

```sh
yarn # install dependencies
```

#### Unit Tests

```sh
yarn test
```

This outputs test results in the JUnit format, and code coverage in cobertura format.

#### Integration Tests

In one shell, start up the webserver that hosts the integration test site:

```sh
yarn serve
```

In another shell, run the integration tests:

```sh
yarn test:integration
```

### Test Runner Plugin Development

`@replayweb/testrunner` can accept plugins in the form of npm packages. Plugins can take an options object as a parameter for construction, one that will be supplied by the user in their `replay.config.json` and must implement an `apply` method.

```js
class ExamplePlugin {
  constructor(options) {
    this.configurationOption = options.configKey
  }

  async log = (command, context) => {
    console.log(command)
  }

  apply = (hooks) => {
    // Attach a function to the beforeCommand hook
    hooks.beforeCommand.tapPromise('ExamplePlugin', this.log)
  }
}
```

#### Development

Plugin packages must export the plugin class as the main export. In this monorepo we use a babel plugin to add `module.exports` automatically for our default export. Developing a plugin in this repository will get that for free, if you develop outside of this repo, make sure to add:

```js
module.exports = YourPluginClass
```

Or configure your build process to add it for you.

#### Available Hooks

**beforeTest**

This hook is fired before each test is started, but after the browser is launched.

```js
async (testName, browser) => {
  // testName is the name of the test
  // ex: SampleTest.json

  // browser is the webdriverio browser object
}
```

**afterTest**

This hook is fired after each test is finished, but before the browser instance has been terminated.

```js
async (testName, browser, context, metadata) => {
  // testName is the name of the test
  // ex: SampleTest.json

  // browser is the webdriverio browser object

  // context is the context object passed between commands, this holds any setContext
  // or setEnvironment values, as well as responses from the http command
  // {
  //   ENVIRONMENT: 'dev'
  // }

  // Sample metadata
  // {
  //   title: 'title',
  //   overview: 'overview'
  // }


}
```

**beforeCommand**

This hook is fired before every command is run, after parameters have been replaced with context values and environment variables.

```js
async (command, context, browser) => {
  // command is the command from your JSON test
  // after the parameters have been replaced from context/environment
  // {
  //   "command": "click",
  //   "parameters": {
  //     "target": "id=1"
  //   }
  // }

  // context is the current context object
  // this does not include environment variables, those can be accessed
  // directly with process.env
  // {
  //   "authId": "1234567890"
  // }

  // browser is the webdriverio browser object

}
```

**onElement**

This hook is fired after any element is retrieved.

```js
async (element, browser, command, context, testName) => {
  // element is the webdriverio Element object for the element that was retrieved

  // browser is the webdriverio browser object

  // command is the replay command object
  // {
  //   command: 'open',
  //   parameters: {
  //     url: 'https://app.example.com
  //   }
  // }

  // context is the context object passed between commands, this holds any setContext
  // or setEnvironment values, as well as responses from the http command
  // {
  //   ENVIRONMENT: 'dev'
  // }

  // testName is the name of the test file currently being run
  // Test01.json
}
```

**onError**

This hook is fired if there is an error during the test, before the test execution has halted. This hook cannot prevent the test from failing.

```js
async (error, browser, testName) => {
  // error is the error object that was thrown

  // browser is the webdriverio browser object
  // which can be used for custom cleanup
  // testName is the name of the test file currently being run
  // Test01.json
}
```

# ReplayWeb

![Logo](packages/extension/extension/logo.png)

<!-- TODO badges -->

ReplayWeb is a all-in-one toolbox that allows developers to focus on writing and maintaining application code, not test code. It is comprised of a Chrome extension that you install in your Chrome browser that allows you to record test scripts and saved and played back later. Once you have recorded scripts you can play them back from within the extension or on the command line. The command line execution uses the ReplayWeb Test Runner to automatically convert tests to WebDriverIO scripts that can be played back across different browsers.

### Feature highlights

* Easy script recording via a Chrome extension
* Ability to execute recorded tests locally via Chrome extension or command line
* Integration with source code repositories to enable running tests during CI/CD

## Getting Started with ReplayWeb

### Installing the Chrome Extension

1. Grab the latest release from [the releases](https://github.com/intuit/ReplayWeb/releases); the packaged Chrome extension is a `.crx` file
2. In Chrome navigate to the [extension management page](chrome://extensions) (`chrome://extensions`)
3. Drag and drop the `.crx` file over the page to install
4. In a terminal, run one of the following commands based on how you authenticate with github:
   - Personal Access Token: `curl -L https://raw.githubusercontent.com/intuit/replayweb/master/packages/host/src/static/setup.ssh | bash`
   - SSH Keys: `curl -L https://raw.githubusercontent.com/intuit/replayweb/master/packages/host/src/static/setup-ssh.sh | bash`

For additional details see the [readme](packages/extension/README.md) for the Chrome Extension

### Installing the Test Runner

Available through npm, `@replayweb/testrunner` converts your JSON tests recorded from the Chrome extension into webdriverio tests. To get started, install the required dependencies into your project:

```sh
yarn add -D @replayweb/testrunner @wdio/cli @wdio/local-runner @wdio/junit-reporter @wdio/mocha-framework @wdio/selenium-standalone-service @wdio/spec-reporter webdriverio chai
```

And add a simple `wdio.conf.js`:

```js
const { getDefaults, loadFromConfig } = require('@replayweb/testrunner')
exports.config = { ...getDefaults(), ...loadFromConfig() }
```

This will read the `replay.config.json` from your repository, that was created by the Chrome extension and load all of your tests and suites. To execute the tests in your shell you can do `npx wdio`, or add a script to `package.json` that just executes `wdio`.

For additional details see the [readme](packages/testrunner/README.md) for the Test Runner package.

## Documentation

The documentation is divided into several sections:
* [Chrome Extension](packages/extension/README.md)
* [Test Runner](packages/testrunner/README.md)
* See full list of documentation [here](packages/)

## Contributing

Read below to learn how you can take part in improving ReplayWeb.

### Code of Conduct
Intuit has adopted a Code of Conduct that we expect project participants to adhere to. Please read the [full text](.github/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

### Contributing Guide
Thanks for your interest! Please see the [CONTRIBUTING.md](.github/CONTRIBUTING.md) file for more information on how to develop and test your changes before contributing bug fixes and enhancements for ReplayWeb.

### Good First Issues
To help you get your feet wet with our contribution process, we have a list of [good first issues](https://github.com/intuit/replayweb/labels/good%20first%20issue) that have a relatively limited scope. This is a great place to get started.

## License

This project is licensed under [AGPL 3](LICENSE).

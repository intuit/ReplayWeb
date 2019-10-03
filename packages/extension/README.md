# ReplayWeb Extension


ReplayWeb extension allows you to record and playback functional tests for web applications from within your Chrome browser. These tests can later be fed into webdriverio using [@replayweb/testrunner](../testrunner) and saved into your repositiory using [@replayweb/host](../host) to be run in your CI/CD pipeline.

## Installation

1. Grab the latest release from [the releases](https://github.com/intuit/ReplayWeb/releases); the packaged Chrome extension is a `.crx` file
2. In Chrome navigate to the [extension management page](chrome://extensions) (`chrome://extensions`)
3. Drag and drop the `.crx` file over the page to install
4. In a terminal, run one of the following commands based on how you authenticate with github:
   - Personal Access Token: `curl -L https://raw.githubusercontent.com/intuit/replayweb/master/packages/host/src/static/setup.ssh | bash`
   - SSH Keys: `curl -L https://raw.githubusercontent.com/intuit/replayweb/master/packages/host/src/static/setup-ssh.sh | bash`

## Usage details

### Text substitution

In the parameters for any command, you can use several text substitutions. There are a few defaults, as well as the ability to set your own variables for reuse.

#### Defaults

```
{todaysDate} - gets replaced with todays date in the format MM/DD/YYY
{random} - gets replaced with a random number between 1 and 1000
{millis} - gets replaced with the current time in milliseconds
```

##### Arbitrary

You can set arbitrary values for use later with the `setContext` command, the `key` is the key you will access later, and the `value` is the value you want it to have. This value gets processed at runtime, so you can store other replacements inside of it, like a random number if you want to use that same random number over and over.

For example:

```json
{
    "command": "setContext",
    "parameters": {
        "key": "test",
        "value": "{random}"
    }
}
```

You could then have a `type` command that uses `{test}` that would contain the same number every time, where using `{random}` would have a different value every time.

### Environment variables
Text substitution always prioritizes environment variables for replacement, to support more dynamic testing. For example, an environment variable can be used to change the URL of your test so the same test is reused in multiple environments.

##### Example

```json
[
    {
        "command": "setContext",
        "parameters": {
            "key": "ENVIRONMENT",
            "value": "dev"
		}
    },
    {
        "command": "open",
        "parameters": {
            "url": "https://{ENVIRONMENT}.app.example.com"
        }
    }
]
```

When run from the browser the URL will be `https://dev.app.example.com`

In automation:

```sh
ENVIRONMENT=dev yarn automation
```

The URL will be `https://dev.app.example.com`

## Execution

For executing tests on Jenkins, see [@replayweb/testrunner](../testrunner) to get started running automation quickly.

## Block sharing

This project supports sharing blocks, allowing reusing collections of commands across developers to increase the speed of testing.

To configure this feature, you must create a file at `~/.replay/block_share_config.json` and populate it with a configuration like:

```json
  "blockStore": {
    "authUsername": "<string>",
    "authToken": "<string>",
    "repoUsername": "<string>",
    "repo": "<string>"
  }
```

This configuration points to a repository with corresponding authentication data so that blocks can be read and written, enabling sharing. This configuration must be present on each user's system who wants to use this feature. This configuration is not required if you do not want to use this feature.

## Developing

### System Requirements

NodeJS runtime 8.x (the LTS)

#### Install the unpacked extension

1. Build the app and extension

```shell
yarn
yarn build
```

2. In Chrome navigate to `chrome://extensions`
3. Enable Developer mode by ticking the checkbox in the upper-right corner.
   1. Click `Load unpacked extension`
   2. Choose the `dist/ext` folder to load the extension

#### Native Host

See the instructions for [@replayweb/host](../host) to set up the native host for development alongside the extension.

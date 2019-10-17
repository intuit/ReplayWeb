# ReplayWeb plugin manager

This package takes a list of URLs, fetches the data from that URL, parsees into JavaScript, and then loads the plugins into an object that's returned to the calling code.

## Installation

```sh
yarn add @replayweb/plugin_manager
```

## Usage details

```js
import loadAllPlugins from '@replayweb/plugin_manager'

const urls = [
    'https://example.com/plugin1.js',
    'https://example.com/plugin2.js',
]

...

const plugins = await loadAllPlugins(urls)
```

## Development

#### System Requirements

- [NodeJS](https://nodejs.org/en/) 8+

### QuickStart

```sh
git clone https://github.com/intuit/replayweb.git
cd packages/plugin_manager
yarn
yarn test # outputs test results and coverage
```

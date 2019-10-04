# ReplayWeb Utils

This module contains common functionality used between ReplayWeb Extension and ReplayWeb Test Runner to avoid code duplication.

## Installation

```sh
yarn add @replayweb/utils
```

## Usage details

```js
import { doReplace } from '@replayweb/utils'

doReplace(string) // returns a promise
  .then(replaced => console.log(replaced)) // replaced is the string with all replacements done
```

See individual function information in the [docs](src/README.md).

## Development

#### System Requirements

- [NodeJS](https://nodejs.org/en/) 8+

### QuickStart

```sh
git clone https://github.com/intuit/replayweb.git
cd packages/utils
yarn
yarn test # outputs test results and coverage
```

#### Local Integration

To test changes without publishing a new version, you can use the `link` feature of yarn to use your local build with other locally built applications:

```sh
replay-utils $ yarn build
replay-utils $ yarn link

some-other-repo $ yarn link @replayweb/utils
some-other-repo $ # run your build command, @replayweb/utils is now a symlink to your local build of replay-utils
```

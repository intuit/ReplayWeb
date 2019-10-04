# ReplayWeb Host

This repository contains code for the native host for the ReplayWeb Extension. The native host is used by the extension to interact with the host filesystem. Without this, it would not be possible to interact with files other than through the regular file upload dialog, and sending downloads to the downloads directory.

## Installation

Run this bash command to setup the host repository. It installs to `~/.replay-host`

In a terminal, run one of the following commands based on how you authenticate with github:

- Personal Access Token: `curl -L https://raw.githubusercontent.com/intuit/replayweb/master/packages/host/src/static/setup.ssh | bash`
- SSH Keys: `curl -L https://raw.githubusercontent.com/intuit/replayweb/master/packages/host/src/static/setup-ssh.sh | bash`

## Usage details

See the [docs](src/lib/README.md) for reference on what the methods do.

## Developing

### Building

```sh
npm run build:dev #uses whatever node is in your $PATH
```

### Installing

This package is capable of installing itself on Mac:

```sh
npm run register
```

This will register it with chrome as a native host, linked back to your build directory, this only needs to be run once.

# Contribution Guidelines

We fully embrace the open source model, and if you have something to add, we would love to review it and get it merged in!

## Before You Start

Ensure your development environment meets the system requirements in [Getting Started](https://github.com/intuit/replayweb#getting-started).

## Contribution Process

Please note we have a [Code of Conduct](https://github.com/intuit/replayweb/blob/master/.github/CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

## Communicating with the team

Before starting work, please check the [issues](https://github.com/intuit/replayweb/issues) to see what's being discussed and worked on. If there's an open, unresolved issue for what you want to work on, please comment on it stating that you would like to tackle the changes. If there's not an issue, please add one and also state that you'll work on it.

## Development flow

1. Fork the repo
1. Install the dependencies - run `yarn`
1. Build your packages - run `yarn build` 
1. Optional: create a branch to work off of
1. Write the code
1. Update/write tests:
    1. `yarn test` will run tests and output coverage reports
    1. `yarn jest --watch` is useful for development
1. Ensure all code matches the "Code Expectations" discussed below
1. Commit and push your code to your fork
1. Open a pull request

## Code Expectations

#### Code Coverage

All new code will be unit tested to 90% coverage.

#### Coding Style

Code should be written in a functional manner when possible. This means avoiding mutability and returning copies of data rather than modifying shared variables. For example:

Don't do this:

```js
let someData = [1,2,3,4]
let list = []
for(let i = 0; i< list.someData.length; i++) {
    list.push(i * 2) // This function doesn't return anything, it modifies list
}
console.log(list)
// [2,4,6,8]
```

Instead, do this:

```js
const someData = [1,2,3,4]
const list = someData.map(i => i * 2)
console.log(list)
// [2,4,6,8]
```

## Contact Information

The best way to contact the team is through the [issues](https://github.com/intuit/replayweb/issues); we'll get back to you within 3 business days.

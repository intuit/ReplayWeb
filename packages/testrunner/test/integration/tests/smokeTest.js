// This file is necessary because the generated file would try to
// require @replayweb/testrunner, but we need to import the current src
global.expect = require('chai').expect
const replayRunner = require('../../../src')
const baseCommands = require('../json/smokeTest.json')
const { expandBlocks } = require('@replayweb/utils')

const expandedCommands = expandBlocks(baseCommands.commands, {})
const commands = { commands: expandedCommands }
describe('smokeTest', function() {
  it('smokeTest', () => {
    process.env.REPLAY_TEST_NAME = 'smokeTest'
    return replayRunner.runCommands(commands)
  })
})

const path = require('path')
require('@babel/register')({
  rootMode: 'upward'
})
const { getDefaults } = require('./src')

exports.config = {
  ...getDefaults(),
  specs: ['./test/integration/tests/smokeTest.js']
}

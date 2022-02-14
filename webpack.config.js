'use strict'
const nodeConfig = require('./webpack/webpack.node.js')
const browserConfig = require('./webpack/webpack.browser.js')

module.exports = [nodeConfig, browserConfig]

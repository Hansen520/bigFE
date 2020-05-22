const combineRouters = require('koa-combine-routers')

const arouters = require('./aRouter')
const brouters = require('./bRouter')

module.exports = combineRouters(
  arouters,
  brouters
)
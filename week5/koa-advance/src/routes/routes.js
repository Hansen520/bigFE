// const combineRouters = require('koa-combine-routers')
import combineRouters from 'koa-combine-routers'
import demoRouter from './demoRouter'

// const arouters = require('./aRouter')
// const brouters = require('./bRouter')

// module.exports = combineRouters(
//   arouters,
//   brouters
// )
export default combineRouters(demoRouter)
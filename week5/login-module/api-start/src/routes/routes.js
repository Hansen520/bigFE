// const combineRouters = require('koa-combine-routers')
import combineRouters from 'koa-combine-routers'
import publicRouter from './publicRouter'

// const arouters = require('./aRouter')
// const brouters = require('./bRouter')

// module.exports = combineRouters(
//   arouters,
//   brouters
// )
export default combineRouters(publicRouter)
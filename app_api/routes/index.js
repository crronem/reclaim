
const express = require('express')
const api = express.Router()
const Landing = require('../routes/landing')
const Grade = require('../routes/grade')
const Buy = require('../routes/buy')
const Sell = require('../routes/sell')


// function capitalize(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1)
// }

/*
 * Routes
 */

// Main landing menu & new users
api.get('/', Landing.menu())
api.get('/landing', Landing.menu())
api.get('/gradeSelect/:mode', Grade.sellGrade())
api.get('/grade/:grade/:mode', Grade.grade())
api.get('/buyDataCenter', Buy.buyDataCenter())
api.get('/sellDataCenter', Buy.sellDataCenter())

module.exports = api
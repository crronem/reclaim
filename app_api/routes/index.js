
const express = require('express')
const api = express.Router()
const Landing = require('../routes/landing')


// function capitalize(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1)
// }

/*
 * Routes
 */

// Main landing menu & new users
api.get('/', Landing.menu())
api.get('/landing', Landing.menu())

module.exports = api
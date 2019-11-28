
const express = require('express')
const api = express.Router()
const Landing = require('../routes/landing')
const Grade = require('../routes/grade')
const Buy = require('../routes/buy')
const Sell = require('../routes/sell')
const Contact = require('../routes/contact')


// function capitalize(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1)
// }

/*
 * Routes
 */

// Main landing menu & new users
api.get('/', Landing.menu())
api.get('/landing', Landing.menu())

// Grade Select
api.get('/gradeSelect/:mode', Grade.gradeSelect())
api.get('/grade/:grade/:mode', Grade.grade())

// Buy Equipment
api.get('/buyDataCenter', Buy.buyDataCenter())

// Sell Equipment
api.get('/sellDataCenter', Sell.sellDataCenter())

// Contact Information & Save Data
api.post('/contactInfo/:grade/:mode', Contact.contactInfo())
api.get('/contactSave/:grade/:mode', Contact.contactInfo())

module.exports = api
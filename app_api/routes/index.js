
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
api.get('/buyCommercial', Buy.buyCommercial())
api.get('/buyPersonal', Buy.buyPersonal())
api.get('/buyHistory', Buy.buyHistory())
api.get('/buyShow/:id', Buy.buyShow())

// Sell Equipment
api.get('/sellDataCenter', Sell.sellDataCenter())
api.get('/sellCommercial', Sell.sellCommercial())
api.get('/sellPersonal', Sell.sellPersonal())
api.get('/sellHistory', Sell.sellHistory())
api.get('/sellShow/:id', Sell.sellShow())

// Contact Information & Save Data
api.post('/contactInfo/:grade/:mode', Contact.contactInfo())
api.post('/contactSave/:record/:grade/:mode', Contact.contactSave())

module.exports = api
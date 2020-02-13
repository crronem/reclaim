
const logger = require('debug-level')('reclaim')
const express = require('express')
const api = express.Router()
const Landing = require('../routes/landing')
const Grade = require('../routes/grade')
const Buy = require('../routes/buy')
const Sell = require('../routes/sell')
const Contact = require('../routes/contact')
const Messages = require('../routes/messages')
const Templates = require('../routes/templates')
const Settings = require('../routes/settings')
const jwt = require('jwt-simple')

/*
 * Middleware to grab user
 */
const getUser = function (req, res, next) {
        logger.info("/getUser")
        if (!req.header('Authorization')) {
            logger.error("missing header")
            return res.status(401).send({ message: 'Unauthorized request' })
        }
        const token = req.header('Authorization').split(' ')[1]
        const payload = jwt.decode(token, process.env.TOKEN_SECRET)

        logger.info("payload")
        logger.info(payload)

        if (!payload) {
            return res.status(401).send({ message: 'Unauthorized Request' })
        }
        req.user = payload.sub
        req.master = payload.is_admin
        logger.info("payload:")
        logger.info(payload)
        next()
    
}

// function capitalize(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1)
// }

/*
 * Routes
 */

api.use(getUser)

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
api.get('/buyRevise/:id', Buy.buyRevise())

// Sell Equipment
api.get('/sellDataCenter', Sell.sellDataCenter())
api.get('/sellCommercial', Sell.sellCommercial())
api.get('/sellPersonal', Sell.sellPersonal())
api.get('/sellHistory', Sell.sellHistory())
api.get('/sellShow/:id', Sell.sellShow())
api.get('/sellRevise/:id', Sell.sellRevise())

// Messages
api.get('/messageShow/:id', Messages.messageShow())
api.get('/messagesList/:id', Messages.messagesList())
api.get('/messageSend/:id', Messages.messageSend())

// Contact Information & Save Data
api.get('/contactList', Contact.contactList())
api.post('/contactInfo/:id/:grade/:mode', Contact.contactInfo())
api.post('/contactSave/:record/:grade/:mode', Contact.contactSave())
api.post('/contactEdit/:id/:field', Contact.contactEdit())
api.get('/contactAdminsList', Contact.contactAdminsList())
api.get('/contactAdminShow/:id', Contact.contactAdminShow())
api.get('/contactAdminLogin', Contact.contactAdminLogin())
api.post('/contactAdminEdit/:id', Contact.contactAdminShow())
api.post('/contactAdminSave/:id', Contact.contactAdminSave())

// Templates
api.get('/templatesList', Templates.templatesList())
api.get('/templateShow/:id', Templates.templateShow())
api.get('/templateEdit/:id', Templates.templateEdit())
api.get('/templateFill/:id', Templates.templateFill())
api.get('/templateRun/:id', Templates.templateRun())
api.post('/templateSave/:id', Templates.templateSave())

// Settings
api.get('/settings', Settings.settings())

module.exports = api
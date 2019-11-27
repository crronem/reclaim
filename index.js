require('dotenv').config()
const jwt = require('jwt-simple')

const logger = require('debug-level')('reclaim')

const express = require('express')
const app = express()
const server = require('http').createServer(app)
const morgan = require('morgan')
const path = require('path')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const errorHandler = require('errorhandler')
const config = require('./app_api/common/config')

// Bring in the routes for the API (delete the default routes)
const api = require('./app_api/routes/index.js')
const mode = app.get('env').toLowerCase()

let public_folder

require('./app_api/models/db')

/*
 * Middleware to grab user
 */
const getUser = function () {
    return function (req, res, next) {
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
}
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride())
app.use(getUser())

if (mode === 'development') {
    app.use(errorHandler())
    app.use(morgan('dev'))
    public_folder = 'app_client'
} else {
    public_folder = 'public'
}
// Use the API routes when path starts with /api
app.use('/api', api)

logger.info("public_folder:" + public_folder)

app.use(express.static(path.join(__dirname, public_folder)))

if (config.https.toLowerCase() == 'true' || config.https) {
    app.use(function (req, res, next) {
        const protocol = req.get('x-forwarded-proto')
        protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url)
    })
}

app.get('/', function (req, res, next) {
    res.sendFile('/' + public_folder + '/index.html', { root: __dirname })
})

app.get('*', function (req, res) {
    res.sendFile('/' + public_folder + '/index.html', { root: __dirname })
})

app.get('/*', function (req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('/' + public_folder + '/index.html', { root: __dirname })
})

server.listen(config.httpPort)
logger.info("listening on port:" + config.httpPort)

module.exports = app
const logger = require('debug-level')('reclaim')

const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')

const Templates = require('../models/Model').Templates

const settings = function () {
    return async function (req, res) {
        let data = {}
        try {
            data.templates = await Templates.countDocuments()
            logger.info("-----settings() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./src/app_api/menus/settings.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----settings() Error------")
            console.log(error)
        }
    }
}

module.exports = {
    settings
}
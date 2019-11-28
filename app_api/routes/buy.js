const logger = require('debug-level')('reclaim')

const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')

const buyDataCenter = function () {
    return async function (req, res) {
        let data = {}
        try {
            logger.info("-----sellDataCenter() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/forms/formBuyDataCenter.pug", data) // -> sellGrade
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----sellDataCenter() Error------")
            console.log(error)
        }
    }
}


const buyCommercial = function () {
    return async function (req, res) {
        let data = {}
        try {
            logger.info("-----sellCommercial() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/forms/formBuyCommercial.pug", data) // -> sellGrade
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----sellCommercial() Error------")
            console.log(error)
        }
    }
}

const buyPersonal = function () {
    return async function (req, res) {
        let data = {}
        try {
            logger.info("-----sellPersonal() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/forms/formBuyPersonal.pug", data) // -> sellGrade
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----sellPersonal() Error------")
            console.log(error)
        }
    }
}

module.exports = {
    buyDataCenter,
    buyCommercial,
    buyPersonal,
}
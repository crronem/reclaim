const logger = require('debug-level')('reclaim')

const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')

const gradeSelect = function () {
    return async function (req, res) {
        let data = {}
        let rootTag = {}
        try {
            logger.info("-----gradeSelect() data------")
            logger.info(JSON.stringify(data, {}, 4))
            data.mode = req.params.mode
            rootTag = loadTemplate("./app_api/menus/gradeSelect.pug", data) // 
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----gradeSelect() Error------")
            console.log(error)
        }
    }
}

const grade = function () {
    return async function (req, res) {
        let data = {}
        let rootTag = {}
        try {
            logger.info("-----grade() data------")
            logger.info("-----grade() params------")
            logger.info(JSON.stringify(req.params, {}, 4))
            if (req.params.grade == "dataCenter") {
                if (req.params.mode == "sell") {
                    rootTag = loadTemplate("./app_api/menus/sellDataCenterOption.pug", data)
                } else {
                    rootTag = loadTemplate("./app_api/menus/buyDataCenterOption.pug", data)
                } 
            } else if (req.params.grade == "commercial"){
                if (req.params.mode == "sell") {
                    rootTag = loadTemplate("./app_api/menus/sellCommercialOption.pug", data)
                } else {
                    rootTag = loadTemplate("./app_api/menus/buyCommercialOption.pug", data)
                } 
            } else if (req.params.grade == "personal") {
                if (req.params.mode == "sell") {
                    rootTag = loadTemplate("./app_api/menus/sellPersonalOption.pug", data)
                } else {
                    rootTag = loadTemplate("./app_api/menus/buyPersonalOption.pug", data)
                }         
            }
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----grade() Error------")
            console.log(error)
        }
    }
}

module.exports = {
    gradeSelect,
    grade
}
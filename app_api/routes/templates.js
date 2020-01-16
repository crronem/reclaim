const logger = require('debug-level')('reclaim')

const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')

const Users = require('../models/Model').Users
const Buys = require('../models/Model').Buys
const Templates = require('../models/Model').Templates


const { titleCase, sentenceCase } = require('../routes/utility')

const makeArray = function (thing) {
    let array = []
    if (typeof thing === "object"){
        array = JSON.stringify(thing).replace(/{/g,"").replace(/}/g,"").replace(/"/g,"").split("\n")
    } else {
        array = thing.split("\n")
    }
    let newArray = []
    for (var i = 0; i < array.length; i++) {
        if (array[i] != "" && array[i] != "\n") {
            newArray.push(array[i])
        }
    }
    return newArray
}

const templatesList = function () {
    return async function (req, res) {
        let data = {}
        try {
            data.templates = await Templates.find().lean()
            logger.info("-----templatesList() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/menus/templatesList.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----templatesList() Error------")
            console.log(error)
        }
    }
}

const templateShow = function () {
    return async function (req, res) {
        let data = {}
        try {
            data = await Templates.findOne({_id: ObjectId(req.params.id)}).lean()
            data.variables = makeArray(data.variables)
            data.values = makeArray(data.values)
            logger.info("-----templateShow() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/menus/templateShow.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----templateShow() Error------")
            console.log(error)
        }
    }
}

const templateEdit = function () {
    return async function (req, res) {
        let data = {}
        try {
            if (req.params.id != 0) {
                data = await Templates.findOne({_id: ObjectId(req.params.id)}).lean()
                data.variablesText = data.variables
                data.variables = makeArray(data.variables)
                data.values = JSON.stringify(data.values)
            } else {
                data._id = 0
                data.name = ""
                data.title = ""
                data.description = ""
                data.variables = []
                data.values = "{}"
                data.variablesText = ""
            }
            logger.info("-----templateEdit() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/forms/formTemplateEdit.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----templateEdit() Error------")
            console.log(error)
        }
    }
}

const templateFill = function () {
    return async function (req, res) {
        try {
            let data = await Templates.findOne({_id: ObjectId(req.params.id)}).lean()
            data.variables = data.variables.split("\n")
            logger.info("-----templateFill() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/forms/formTemplateFill.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----templateFill() Error------")
            console.log(error)
        }
    }
}

const templateRun = function () {
    return async function (req, res) {
        try {
            let data = await Templates.findOne({_id: ObjectId(req.params.id)}).lean()
            data.variables = data.variables.split("\n")
            logger.info("-----templateFill() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/forms/formTemplateFill.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----templateFill() Error------")
            console.log(error)
        }
    }
}

const templateSave = function () {
    return async function (req, res) {
        let data = {}
        let query = {}
        let update = {}
        let options = { upsert: true, new: true }
        let template = {}
        try {
            if ( req.params.id != 0 ){
                query = { _id: ObjectId(req.params.id) }
                update = { values: req.body }
            } else {
                query = { name:req.body.name.toLowerCase().replace(".docx","") }
                update = { 
                    name: req.body.name.toLowerCase(),
                    title: sentenceCase(req.body.title),
                    description: req.body.description,
                    variables: req.body.variables,
                    values: {}
                }
            }
            template = await Templates.findOneAndUpdate(query, update, options).lean()
            data.templates = await Templates.count()
            data.preBody = "Template "+template.name+" saved!"
            logger.info("-----templateSave() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/menus/settings.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----templateSave() Error------")
            console.log(error)
        }
    }
}

module.exports = {
    templateEdit,
    templatesList,
    templateShow,
    templateFill,
    templateRun,
    templateSave,
}
const logger = require('debug-level')('reclaim')

const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")

const prepare = require("base64_encode")

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')

const Users = require('../models/Model').Users
const Buys = require('../models/Model').Buys
const Templates = require('../models/Model').Templates

const { sendeMailAttachement } = require('../routes/email')
const { titleCase, sentenceCase } = require('../routes/utility')

const { TemplateHandler } = require('easy-template-x')

const fs = require('fs')
const path = require('path')

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
        let template = {}
        let variables = []
        try {
            template = await Templates.findOne({_id: ObjectId(req.params.id)}).lean()
            const templateFile = fs.readFileSync("./app_api/docx/"+template.name+".docx")
            let lines = template.values.values[0].split("\n")
            for (var i = 0;i < lines.length; i++) {
                variables.push(lines[i])
            }
            logger.info("-----templateRun() variables------")
            logger.info(variables)
            const data = {
                posts: [
                    { author: 'Alon Bar', text: 'Very important\ntext here!' },
                    { author: 'Alon Bar', text: 'Forgot to mention that...' }
                ]
            }
            const handler = new TemplateHandler()
            const doc = await handler.process(templateFile, data)
            const timeStamp = moment(Date.now()).format('MMMDDYYYYHHmm')
            let attachment = prepare.base64_encode(doc)
            let fileName = template.name+"_"+timeStamp+".docx"
            email = {
                toName: "Chris Richardson",
                toEmail: "me@crr56.com",
                fromName: "Anthony Money",
                toName: "anthony@reclaim-uk.com",
                subject: "Your "+ template.name,
                message: "Dear Christopher,\n\nHere is your document",
                id: "1234",
                fileName: fileName,
                attachement: attachment
            }
            await sendEmailAttachment(email)
            data.preBody = "Template "+template.name+" created!"
            logger.info("-----templateRun() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/menus/settings.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----templateRun() Error------")
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
                if (!req.body.value){
                    update = { values: req.body }
                } else {
                    update = { values: JSON.parse(req.body.values) }
                }
            } else {
                query = { name:req.body.name.replace(".docx","") }
                update = { 
                    name: req.body.name,
                    title: sentenceCase(req.body.title),
                    description: req.body.description,
                    variables: req.body.variables,
                    values: JSON.parse(req.body.values)
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
const fs = require("fs")
const { TemplateHandler } = require("easy-template-x")

const makeDocx = async function (docxOutputName, templateDocxName, templateData, templateDataImageName) {

    const templateFile = fs.readFileSync(templateDocxName+".docx")
    let data = {}

    if (imageName) {
        data.docImage = {
            _type: "image",
            source: fs.readFileSync(templateDataImageName),
            format: MimeType.Png,
            width: 200,
            height: 200
        }
    }
    const handler = new TemplateHandler();
    const doc = await handler.process(templateFile, templateData);

    fs.writeFileSync(docxOutputName + '.docx', doc);
    
    data.preBody = "Document " + docxOutputName + '.docx '+"saved!"
    logger.info("-----menu() data------")
    logger.info(JSON.stringify(data, {}, 4))
    let rootTag = loadTemplate("./src/app_api/menus/landing.pug", data)
    let response = Response.fromTag(rootTag)
    return res.json(response.toJSON())
}

module.exports = {
    makeDocx
}
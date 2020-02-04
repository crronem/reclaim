const config = require('../common/config')
const logger = require('debug-level')('reclaim')
const mailjet = require('node-mailjet').connect(`${config.emailAPIKey}`,`${config.emailAPISecret}` )

const sendeMail = async function (email) {
    logger.info("-----sendeMail() email------")
    logger.info(JSON.stringify(email, {}, 4))
    const request = mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": email.fromEmail,
                        "Name": email.fromName
                    },
                    "To": [
                        {
                            "Email": email.toEmail,
                            "Name": email.toName
                        }
                    ],
                    "Bcc": [
                        {
                            "Email": "contact@onem.com",
                            "Name": "Reclaim Bcc Email"
                        }
                    ],
                    "Subject": email.subject,
                    "TextPart": email.message,
                    "HTMLPart": "",
                    "CustomID": email.id
                }
            ]
        })
    request
        .then((result) => {
            console.log(result.body)
            logger.info("-----sendeMail() error------")
            logger.info(JSON.stringify(result.body, {}, 4))
        })
        .catch((err) => {
            console.log(err)
            logger.error("-----sendeMail() error------")
            logger.error(JSON.stringify(err, {}, 4))
        })
}

const sendeMailAttachment = async function (email) {
    const request = mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": email.fromEmail,
                        "Name": email.fromName
                    },
                    "To": [
                        {
                            "Email": email.toEmail,
                            "Name": email.toName
                        }
                    ],
                    "Subject": email.subject,
                    "TextPart": email.message,
                    "HTMLPart": "",
                    "CustomID": email.id,
                    "Attachments": [
                        {
                            "Content-type": "application/docx",
                            "Filename": email.fileName,
                            "content": email.attachement
                        }
                    ]

                }
            ]
        })
    request
        .then((result) => {
            console.log(result.body)
            logger.info("-----sendeMailAttachment() error------")
            logger.info(JSON.stringify(result, {}, 4))
        })
        .catch((err) => {
            console.log(err.statusCode)
            logger.error("-----sendeMailAttachment() error------")
            logger.error(JSON.stringify(err, {}, 4))
        })
}

module.exports = {
    sendeMail,
    sendeMailAttachment
}
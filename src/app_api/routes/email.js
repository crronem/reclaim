const config = require('../common/config')
const mailjet = require('node-mailjet').connect(`${config.emailAPIKey}`,`${config.emailAPISecret}` )

const sendeMail = async function (email) {
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
        })
        .catch((err) => {
            console.log(err.statusCode)
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
        })
        .catch((err) => {
            console.log(err.statusCode)
        })
}

module.exports = {
    sendeMail,
    sendeMailAttachment
}
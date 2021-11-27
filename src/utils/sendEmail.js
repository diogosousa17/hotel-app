const nodemailer = require('nodemailer')
const config = require('../config')

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.USER,
                pass: config.PASS
            }
        })
        await transporter.sendMail({
            from: config.USER,
            to: email,
            subject: subject,
            text: text
        })
        console.log("Email enviado com sucesso.")
    } catch (error) {
        console.log(error, "Email não enviado.")
    }
}

module.exports = sendEmail
const nodemailer = require('nodemailer')
class Email {
    async sendVerificationEmail(email, token) {
        console.log(email, token)

        const transporter = nodemailer.createTransport({
            host: 'smtp.mail.ru', // ❗ Должен быть 'smtp.mail.ru', а не 'service: mail.ru'
            port: 465, // Почта Mail.ru использует порт 465 (SSL)
            secure: true, // Обязательно ставь true для 465 (SSL)
            auth: {
                user: process.env.MAIL_ADDRESS,
                pass: process.env.MAIL_PASSWORD,
            },
        })

        const verificationLink = `${process.env.EMAIL_CONFIRM_URL}?token=${token}`

        const mailOptions = {
            from: `"CryptoSense" <${process.env.MAIL_ADDRESS}>`,
            to: email,
            subject: 'Email Verification',
            text: `Click the link to verify your email: ${verificationLink}`,
            html: `<p>Click the link to verify your email: <a href="${verificationLink}">Verify Email</a></p>`,
        }

        try {
            await transporter.sendMail(mailOptions)
        } catch (error) {
            throw { status: 500, message: 'Error when sending email', error: error.message }
        }
    }
    async sendResetPasswordEmail(email, token) {
        console.log(email, token)

        const transporter = nodemailer.createTransport({
            host: 'smtp.mail.ru', // ❗ Должен быть 'smtp.mail.ru', а не 'service: mail.ru'
            port: 465, // Почта Mail.ru использует порт 465 (SSL)
            secure: true, // Обязательно ставь true для 465 (SSL)
            auth: {
                user: process.env.MAIL_ADDRESS,
                pass: process.env.MAIL_PASSWORD,
            },
        })

        const verificationLink = `${process.env.EMAIL_RESET_PASSWORD_URL}?token=${token}`

        const mailOptions = {
            from: `"CryptoSense" <${process.env.MAIL_ADDRESS}>`,
            to: email,
            subject: 'Email Reset Password',
            text: `Click the link to reset your password: ${verificationLink}`,
            html: `<p>Click the link to verify your email: <a href="${verificationLink}">Verify Email</a></p>`,
        }

        try {
            await transporter.sendMail(mailOptions)
        } catch (error) {
            throw { status: 500, message: 'Error when sending email', error: error.message }
        }
    }
}
module.exports = new Email()

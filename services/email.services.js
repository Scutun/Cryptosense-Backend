const nodemailer = require('nodemailer')
class Email {
    async sendVerificationEmail(email, token) {
        const transporter = nodemailer.createTransport({
            service: 'mail.ru',
            auth: {
                user: process.env.MAIL_ADDRESS,
                pass: process.env.MAIL_PASSWORD,
            },
        })

        const verificationLink = `${process.env.EMAIL_CONFIRM_URL}?token=${token}`

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification',
            text: `Click the link to verify your email: ${verificationLink}`,
            html: `<p>Click the link to verify your email: <a href="${verificationLink}">Verify Email</a></p>`,
        }

        try {
            await transporter.sendMail(mailOptions)
            console.log('Verification email sent to:', email)
        } catch (error) {
            throw { status: 500, message: 'Ошибка при отправке email', error: error.message };
        }
    }
}
module.exports = new Email()

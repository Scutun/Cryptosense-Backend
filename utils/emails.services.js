const nodemailer = require('nodemailer')

async function sendVerificationEmail(email, token) {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_STMP,
        port: process.env.MAIL_PORT,
        secure: process.env.MAIL_SECURE,
        auth: {
            user: process.env.MAIL_ADDRESS,
            pass: process.env.MAIL_PASSWORD,
        },
    })

    const verificationLink = `${process.env.EMAIL_CONFIRM_URL}?token=${token}`

    const mailOptions = {
        from: `"CryptoSense" <${process.env.MAIL_ADDRESS}>`,
        to: email,
        subject: 'Подтверждение электронной почты',
        text: `Здравствуйте!  
    
    Вы зарегистрировались в CryptoSense. Для завершения регистрации подтвердите ваш email, перейдя по ссылке:  
    
    ${verificationLink}  
    
    Если вы не запрашивали регистрацию, просто проигнорируйте это сообщение.  
    
    С уважением,  
    Команда CryptoSense`,
        html: `<p>Здравствуйте!</p>
                <p>Вы зарегистрировались в <b>CryptoSense</b>. Для завершения регистрации подтвердите ваш email, нажав на кнопку ниже:</p>
                <p><a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Подтвердить Email</a></p>
                <p>Если вы не запрашивали регистрацию, просто проигнорируйте это сообщение.</p>
                <p>С уважением,<br>Команда CryptoSense</p>`,
    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        throw { status: 500, message: `Ошибка при отправке письма: ${error.message}` }
    }
}

async function sendResetPasswordEmail(email, token) {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_STMP,
        port: process.env.MAIL_PORT,
        secure: process.env.MAIL_SECURE,
        auth: {
            user: process.env.MAIL_ADDRESS,
            pass: process.env.MAIL_PASSWORD,
        },
    })

    const verificationLink = `${process.env.EMAIL_RESET_PASSWORD_URL}?token=${token}`

    const mailOptions = {
        from: `"CryptoSense" <${process.env.MAIL_ADDRESS}>`,
        to: email,
        subject: 'Восстановление пароля',
        text: `Здравствуйте!  
    
    Вы запросили восстановление пароля в CryptoSense. Чтобы создать новый пароль, перейдите по следующей ссылке:  
    
    ${verificationLink}  
    
    Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.  
    
    С уважением,  
    Команда CryptoSense`,
        html: `<p>Здравствуйте!</p>
                <p>Вы запросили <b>восстановление пароля</b> в <b>CryptoSense</b>. Чтобы создать новый пароль, нажмите на кнопку ниже:</p>
                <p><a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Сбросить пароль</a></p>
                <p>Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.</p>
                <p>С уважением,<br>Команда CryptoSense</p>`,
    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        throw { status: 500, message: `Ошибка при отправке письма: ${error.message}` }
    }
}

module.exports = { sendResetPasswordEmail, sendVerificationEmail }

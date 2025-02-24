const bcrypt = require('bcrypt')
const modelUser = require('../models/users.models')

class UsersService {
    async createUser(userInfo) {
        try {
            const { email, password, login, name, surname } = userInfo

            if (
                email.length === 0 ||
                password.length === 0 ||
                login.length === 0 ||
                name.length === 0 ||
                surname.length === 0
            ) {
                throw { status: 422, message: 'Все поля обязательны для заполнения' }
            }

            const hashPassword = await bcrypt.hash(password, 10)
            const date = new Date().toISOString().split('T')[0]
            const info = { email, hashPassword, login, name, surname, date }

            return await modelUser.newUser(info)
        } catch (error) {
            throw { status: 400, message: `Ошибка при создании пользователя: ${error.message} ` }
        }
    }

    async searchUsers(email, login) {
        try {
            if (email.length === 0 || login.length === 0) {
                throw { status: 422, message: 'Необходимо передать e-mail или логин' }
            }

            const users = await modelUser.searchUsers(email, login)
            
            if (users.length > 0) {
                throw {
                    status: 409,
                    message: `Этот ${users[0].email == email ? 'e-mail уже занят' : 'логин уже занят'}`,
                }
            }
            
        } catch (error) {
            throw error            
        }
    }

    async loginUser(info) {
        try {
            const { email, password } = info

            if (email.length === 0 || password.length === 0) {
                throw { status: 422, message: 'E-mail и пароль обязательны' }
            }

            const user = await modelUser.loginUser(email)

            if (user.length === 0) {
                throw { status: 404, message: 'Пользователь не найден' }
            } else if (user.activated == false) {
                throw { status: 403, message: 'Пользователь не подтвердил почту' }
            }
            if (!bcrypt.compare(user.password, password)) {
                throw { status: 401, message: 'Неправильный пароль' }
            }

            return user.id
        } catch (error) {
            throw { status: 400, message: `Ошибка при авторизации пользователя: ${error.message}` }
        }
    }

    async activateUser(email) {
        try {
            if (email.length === 0) {
                throw { status: 422, message: 'E-mail обязателен' }
            }

            await modelUser.activateUser(email)
        } catch (error) {
            throw { status: 400, message: `Ошибка при активации пользователя: ${error.message}` }
        }
    }

    async resetUserPassword(info) {
        try {
            if (info.email.length === 0) {
                throw { status: 422, message: 'E-mail обязателен' }
            }

            const user = await modelUser.loginUser(info.email)

            if (user.length === 0) {
                throw { status: 404, message: 'Пользователь не найдеть' }
            } else if (user.activated === false) {
                throw { status: 403, message: 'Пользователь не подтвердил почту' }
            }
            return user.id
        } catch (error) {
            throw { status: 400, message: `Ошибка при сбросе пароля: ${error.message}` }
        }
    }

    async newUserPassword(info) {
        try {
            const { email, password } = info

            if (email.length === 0 || password.length === 0) {
                throw { status: 422, message: 'E-mail и новый пароль обязательны' }
            }

            const hashPassword = await bcrypt.hash(password, 10)
            await modelUser.updateUserPassword(email, hashPassword)
        } catch (error) {
            throw { status: 400, message: `Ошибка при обновлении пароля: ${error.message}` }
        }
    }
}

module.exports = new UsersService()

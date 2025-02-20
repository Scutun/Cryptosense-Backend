const bcrypt = require('bcrypt')
const modelUser = require('../models/users.models')
class UsersService {
    async createUser(userInfo) {
        try {
            const { email, password, login, name, surname } = userInfo
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
            const users = await modelUser.searchUsers(email, login)

            if (users.length === 2) {
                throw { status: 404, message: 'e-mail и логин заняты' }
            } else if (users.length === 1) {
                throw {
                    status: 404,
                    message: `${users.email === email ? 'e-mail уже занят' : 'логин уже занят'}`,
                }
            }
        } catch (error) {
            throw { status: 400, message: `Ошибка при поиске пользователя: ${error.message}` }
        }
    }

    async loginUser(info) {
        try {
            const { email, password } = info

            const user = await modelUser.loginUser(email)

            if (user.length === 0) {
                throw { status: 404, message: 'Пользователь не найден' }
            } else if (user.activated == false) {
                throw { status: 403, message: 'Пользователь не поддтвердил почту' }
            }
            if (!bcrypt.compare(user.password, password)) {
                throw { status: 401, message: 'Неправильный пароль' }
            }

            return user.id
        } catch (error) {
            throw { status: 400, message: `Ошибка при авторизации пользователя: ${error.message}` }
        }
    }

    async activateUser(id) {
        try {
            await modelUser.activateUser(id)
        } catch (error) {
            throw { status: 400, message: `Ошибка при активации пользователя: ${error.message}` }
        }
    }

    async resetUserPassword(info) {
        const user = await modelUser.loginUser(info.email)

        if (user.length === 0) {
            throw { status: 404, message: 'Пользовател не найдет' }
        } else if (user.activated === false) {
            throw { status: 403, message: 'Пользователь не поддтвердил почту' }
        }
        return user.id
    }

    async newUserPassword(info) {
        try {
            const { email, password } = info
            const hashPassword = await bcrypt.hash(password, 10)
            await modelUser.updateUserPassword(email, hashPassword)
        } catch (error) {
            throw { status: 400, message: `Ошибка при обновлении пароля: ${error.message}` }
        }
    }
}

module.exports = new UsersService()

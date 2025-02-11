const express = require('express')
const service = require('../services/users.servies')
const model  = require('../models/users.model')

class UsersController {
    async createUser(rec, require) {
        try {
            const { email, password, login, name, sername } = req.body
            const hasPassword = await service.hashPassword(password)
            const date = service.dateNow()
            const user = await model.createUser(email, hasPassword, login, name, sername, date)
            res.status(201).json(user)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new UsersController()

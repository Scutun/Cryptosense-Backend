const express = require('express')
const service = require('../services/users.servies')

class UsersController {
    async createUser(req, res) {
        try {
            const user = await service.createUser(req)
            res.status(201).json(user)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new UsersController()

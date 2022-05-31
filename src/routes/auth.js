const express = require('express')
const { User } = require('../models/User')
const router = new express.Router()

router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(500).send("Registration failed. Please try again later.")
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        let error = "Login failed. Please try again later."
        res.status(400).send(error)
    }
})

module.exports = router
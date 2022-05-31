const express = require('express')
const router = new express.Router()
const { auth, verifyAuthAndAdmin } = require('../middleware/auth')
const { User } = require('../models/User')

router.get('/', auth, (req, res) => {
    try {
        const user = req.user
        res.status(201).send(user)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/allUsers', verifyAuthAndAdmin, async (req, res) => {
    try {
        const users = await User.find()
        return res.status(201).send(users)
    } catch (e) {

    }
})

router.patch('/', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['userName', 'email', 'password', 'isAdmin']
    const invalidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!invalidUpdate) {
        return res.status(400).send("Error: Invalid updates")
    }
    try {
        const user = req.user
        updates.forEach(update => user[update] = req.body[update])
        await user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/', verifyAuthAndAdmin, async (req, res) => {
    try {
        await req.user.remove()
        return res.status(201).send("User has been deleted successfully!")
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/stats', verifyAuthAndAdmin, async (req, res) => {
    try {
        const date = new Date()
        const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            { $project: { month: { $month: "$createdAt" } } },
            { $group: { _id: "$month", total: { $sum: 1 } } }
        ])
        // console.log(lastYear)
        return res.status(201).send(data)
        res.status(403).send("You are not an Admin to perform this operation.")
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router
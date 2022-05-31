const express = require('express')
const { auth, verifyAuthAndAdmin } = require('../middleware/auth')
const Order = require('../models/Order')
const router = new express.Router()


router.post('/', auth, async (req, res) => {
    try {
        if (req.body.userId === req.user._id.toString()) {
            const newOrder = new Order(req.body)
            const order = await newOrder.save()
            return res.status(201).send(order)
        }
        res.status(403).send("User's can order any product only with their userId.")
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/allOrders', verifyAuthAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
        return res.status(201).send(orders)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/income', verifyAuthAndAdmin, async (req, res) => {
    try {
        const date = new Date()
        const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
        const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project:
                {
                    month: { $month: "$createdAt" },
                    sales: "$amount"
                }
            },
            { $group: { _id: "$month", total: { $sum: "$sales" } } }
        ])
        return res.status(201).send(income)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/:userId', auth, async (req, res) => {
    try {
        if (req.params.userId === req.user._id.toString()) {
            const order = await Order.find({ userId: req.params.userId })
            return res.status(201).send(order)
        }
        res.status(201).send("No products found in orders list.")
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/:id', verifyAuthAndAdmin, async (req, res) => {
    try {
        const updateOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        return res.status(201).send(updateOrder)
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/:id', verifyAuthAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        return res.status(201).send("Order has been deleted successfully!")
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
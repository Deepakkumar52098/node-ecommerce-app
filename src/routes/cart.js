const express = require('express')
const { auth, verifyAuthAndAdmin } = require('../middleware/auth')
const Cart = require('../models/Cart')
const router = new express.Router()

router.post('/', auth, async (req, res) => {
    try {
        if(req.body.userId === req.user._id.toString()){
            const newCart = new Cart(req.body)
        const cart = await newCart.save()
        return res.status(201).send(cart)
        }
        res.status(403).send("User's can add product to their cart only with their userId.")
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/allCarts', verifyAuthAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find()
        res.status(201).send(carts)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/:userId', auth, async (req, res) => {
    try {
        if (req.params.userId === req.user._id.toString()) {
            const cart = await Cart.find({ userId: req.params.userId })
            return res.status(201).send(cart)
        }
        res.status(201).send("No products added to cart.")
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        const cart = await Cart.findById(_id)
        if (cart && req.user._id.toString() === cart.userId) {
            const updateCart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            return res.status(201).send(updateCart)
        }
        res.status(403).send("Only user can update item from their cart.")
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        const cart = await Cart.findById(_id)
        if (cart && req.user._id.toString() === cart.userId) {
            await Cart.findByIdAndDelete(req.params.id)
            return res.status(201).send("Product has been deleted from the cart successfully!")
        }
        res.status(403).send("Only user can delete products from their cart.")
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
const express = require('express')
const Product = require('../models/Product')
const { auth, verifyAuthAndAdmin } = require('../middleware/auth')
const router = new express.Router()

router.post('/', auth, async (req, res) => {
    try {
        const newProduct = new Product(req.body)
        const product = await newProduct.save()
        res.status(201).send(product)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/allProducts', async (req, res) => {
    const qNew = req.query.new
    const qCategory = req.query.category
    let products
    try {
        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(2)
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory]
                }
            })
        } else {
            products = await Product.find()
        }
        res.status(201).send(products)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.status(201).send(product)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/:id', verifyAuthAndAdmin, async (req, res) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        return res.status(201).send(updateProduct)
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/:id', verifyAuthAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        return res.status(201).send("Product has been deleted successfully!")
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
const jwt = require('jsonwebtoken')
const { User, SECRET_KEY } = require('../models/User')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decodedToken = jwt.verify(token, SECRET_KEY)
        const user = await User.findOne({ _id: decodedToken._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(403).send({ error: 'You are not Authenticated!' })
    }
}

const verifyAuthAndAdmin = async (req, res, next) => {
    try {
        auth(req, res, () => {
            if (req.user.isAdmin) {
                return next()
            }
            res.status(403).send({ error: 'You are not Authenticated!' })
        })
    } catch (e) {
        res.status(500).send()
    }
}

module.exports = { auth, verifyAuthAndAdmin }
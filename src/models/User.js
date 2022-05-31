const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }
    ]
}, {
    timestamps: true
})

const SECRET_KEY = 'my-ecommerce-app'

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString(), isAdmin: this.isAdmin }, SECRET_KEY)
    this.tokens = [...this.tokens, { token }]
    await this.save()
    return token
}

userSchema.methods.toJSON = function () {
    const userObject = this.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    const isPasswordMatched = await bcrypt.compare(password, user.password)
    if (!user) {
        throw new Error('No user found. Please try again.')
    }
    if (!isPasswordMatched) {
        throw new Error('Please enter the correct password to login.')
    }
    return user
}

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = { User, SECRET_KEY }
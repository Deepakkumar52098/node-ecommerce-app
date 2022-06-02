const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true
}).then(
    console.log("DB connected")
)
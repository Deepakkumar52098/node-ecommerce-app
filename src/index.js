require('./db/mongoose')
const express = require('express')
const cors =require("cors");
const user = require('./routes/user')
const product = require('./routes/product')
const cart = require('./routes/cart')
const order = require('./routes/order')
const auth = require('./routes/auth')



const app = express();
const port = process.env.PORT || 4000
app.use(express.json())
app.use(cors());

app.use('/api/user',user)
app.use('/api/product',product)
app.use('/api/cart',cart)
app.use('/api/order',order)
app.use('/api/auth',auth)

app.listen(port,()=>{
    console.log("Server is up on port", port)
})



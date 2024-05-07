const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const userRouter = require('./routes/userRoutes')
const itemRouter = require('./routes/itemRoutes')
const cartRouter = require('./routes/cartRoutes')
const globalError = require('./controllers/error')
// 
const app = express()
app.use(express.json())
// dotenc config
dotenv.config({ path: './config.env' })

// Routes 
app.use('/commerce/users', userRouter)
app.use('/commerce/items', itemRouter)
app.use('/commerce/cart', cartRouter)

// database connection
mongoose.connect("mongodb://127.0.0.1/E-Commerce", {

}).then(() => console.log('Database Connected'))

// Handling not-created routes
app.all('*', (req, res, next) => {
    // const err = new Error(`can't find the ${req.originalUrl} on this server`)
    // err.status = 'fail';
    // err.statusCode = 404;

    next(new AppError(`can't find the ${req.originalUrl} on this server`, 404));
})

// Error handler
app.use(globalError)


// Starting of the server
app.listen(2003, () => {
    console.log('Server Connected')
})
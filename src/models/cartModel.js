const mongoose = require('mongoose')


const cartSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    items: [{
        itemId: {
            type: String,
            required: true,
            ref: 'Item',
            required: true
        },
        name: String,
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
        price: Number
    }],
    bill: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true })

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart
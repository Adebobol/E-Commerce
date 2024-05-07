const catchAsync = require('../utils/catchAsync')
const Item = require('./../models/itemModel')
const Cart = require('./../models/cartModel')
const AppError = require('./../utils/AppError')
// const { getAll, getOne, deleteOne, updateOne, createOne, } = require('./baseCtrl')


exports.getCart = catchAsync(async (req, res, next) => {
    const cartOwner = req.user._id

    const cart = await Cart.findOne({ cartOwner })
    if (!cart) {
        next(new AppError('No cart available', 500))
    }
    console.log(cart)
})


exports.createCart = catchAsync(async (req, res, next) => {
    const owner = req.user.id
    const { itemId, quantity } = req.body
    const cart = await Cart.findOne({ owner })
    const item = await Item.findOne({ _id: itemId })
    const price = item.price
    const name = item.name

    if (cart) {
        const getIndexOfItem = cart.items.findIndex(item => item.itemId == itemId)
        console.log(getIndexOfItem)


        if (getIndexOfItem > -1) {
            let product;
            product = cart.items[getIndexOfItem]
            product.quantity += quantity
            cart.bill = cart.items.reduce((acc, curr) => {
                return acc + curr.quantity * curr.price
            }, 0)
            cart.items[getIndexOfItem] = product;
            await cart.save()
        } else {
            cart.items.push({ itemId, name, quantity, price })
            cart.bill = cart.items.reduce((acc, curr) => {
                return acc + curr.quantity * curr.price
            }, 0)
            await cart.save()
        }
        res.status(201).json({
            message: "success"
        })

    } else {

        const newCart = await Cart.create({
            owner,
            items: [{ itemId, name, quantity, price }],
            bill: quantity * price
        })
        // console.log(newCart)
        res.status(201).json({
            message: "success",
            data: {
                newCart
            }
        })
    }
})

exports.deleteCart = catchAsync(async (req, res, next) => {
    const owner = req.user.id
    const itemId = req.query.itemId
    console.log(itemId)

    const cart = await Cart.findOne({ owner })
    console.log(cart)
    const getIndexOfItem = cart.items.findIndex(item => item.itemId == itemId)
    console.log(getIndexOfItem)
    if (getIndexOfItem > -1) {
        let product;
        product = cart.items[getIndexOfItem]
        cart.bill -= product.quantity * product.price
        console.log(cart.bill)
        if (cart.bill < 0) {
            cart.bill = 0
        }
        cart.items.splice(getIndexOfItem, 1)
        cart.items.reduce((acc, curr) => {
            return acc + curr.quantity * curr.price
        }, 0)
        await cart.save()
        res.status(200).json({
            message: "success"
        })
    } else {
        next(new AppError('Item not found', 404))
    }

})
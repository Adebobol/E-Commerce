const express = require('express')
const router = express.Router()
const { getCart, createCart, deleteCart } = require('./../controllers/cartCtrl')
const { protect } = require('./../controllers/userCtrl')

router.route('/').get(protect, getCart).post(protect, createCart).delete(protect, deleteCart)

module.exports = router
const express = require('express')
const router = express.Router()
const { createItem, getAllItems, getItem, deleteItem, updateItem } = require('./../controllers/itemCtrl')




router.route('/').post(createItem).get(getAllItems)
router.route('/:id').get(getItem).delete(deleteItem).patch(updateItem)
module.exports = router
const Item = require('./../models/itemModel')
const { getAll, getOne, deleteOne, updateOne, createOne, } = require('./baseCtrl')



exports.createItem = createOne(Item)
exports.getAllItems = getAll(Item)
exports.getItem = getOne(Item)
exports.deleteItem = deleteOne(Item)
exports.updateItem = updateOne(Item)
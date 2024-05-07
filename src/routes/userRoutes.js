const express = require('express')
const router = express.Router()
const { signUp, login, getAllUser, getUser, updateUser, deleteUser } = require('./../controllers/userCtrl')


router.route('/signUp').post(signUp)
router.route('/login').post(login)

router.route('/').get(getAllUser)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router
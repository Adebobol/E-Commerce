const { promisify } = require('util')
const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/AppError')
const jwt = require('jsonwebtoken')
const { getOne, getAll, deleteOne, updateOne } = require('./../controllers/baseCtrl')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })

    if (!newUser) {
        return next(new AppError('No user input', 404))
    }
    res.status(201).json({
        message: "success",
        data: {
            newUser
        }
    })
})
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new AppError('Please provide your email or password', 401))
    }
    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.comparePassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }
    const token = signToken(user._id)

    res.status(200).json({
        status: "success",
        token
    })

})

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to gain access', 401))
    }

    // 2) VERIFICATION TOKEN
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    console.log(decoded)
    // 3) CHECK IF USER STILL EXISTS
    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist', 401))
    }
    // 4) CHECK IF USER CHANGED PASSWORD AFTER THE TOKEN WAS ISSUED
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again', 401))
    }
    // 5) GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser
    next()
})



exports.getUser = getOne(User)
exports.getAllUser = getAll(User)
exports.updateUser = updateOne(User)
exports.deleteUser = deleteOne(User)
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercse: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 5,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please provide a password'],
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: 'Password are not the same.'
        }
    },
    passwordChangedAt: Date,
})

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next()

    this.passwordChangedAt = Date.now() - 1000

    next()
})

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 10)

    this.passwordConfirm = undefined
})


userSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        console.log(this.passwordChangedAt, changedTimeStamp)

        return JWTTimestamp < changedTimeStamp
    }

    return false
}

const User = mongoose.model('User', userSchema)

module.exports = User
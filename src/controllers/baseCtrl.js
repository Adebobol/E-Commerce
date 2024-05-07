const AppError = require('./../utils/AppError')
const catchAsync = require('./../utils/catchAsync')

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)

    if (!doc) {
        return next(new AppError('No document Found with this id', 404))
    }

    res.status(204).json({
        status: "Success",
        data: null
    })

});

exports.updateOne = Model => catchAsync(async (req, res, next) => {

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        returnOrginal: false,
        runValidators: true
    })

    if (!doc) {
        return next(new AppError('No document Found with this id', 404))
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        },
    });


});


exports.createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body)

    if (!doc) {
        return next(new AppError('No document input to be created', 404))
    }

    res.status(201).json({
        status: "Success",
        data: doc
    })

});


exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id)
    if (!doc) {
        return next(new AppError('No document Found with this id', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            doc,
        },
    });
})

exports.getAll = Model => exports.getAllTours = catchAsync(async (req, res, next) => {
    const doc = await Model.find()
    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            doc,
        },
    });


});
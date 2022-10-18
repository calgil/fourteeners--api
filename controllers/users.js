const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { findByIdAndUpdate } = require('../models/User');

// get all users
// GET /api/v1/auth/users
// PRIVATE/ADMIN
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.filteredResults);
});

// get single user
// GET /api/v1/auth/users/:id
// PRIVATE/ADMIN
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorResponse(`No user found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ 
        success: true,
        data: user
    });
});

//  create user
// POST /api/v1/auth/users
// PRIVATE/ADMIN
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(200).json({ 
        success: true,
        data: user
    });
});

//  update user
// PUT /api/v1/auth/users/:id
// PRIVATE/ADMIN
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({ 
        success: true,
        data: user
    });
});

//  delete user
// DELETE /api/v1/auth/users/:id
// PRIVATE/ADMIN
exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({ 
        success: true,
        data: {}
    });
});


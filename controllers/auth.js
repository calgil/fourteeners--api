const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// register user
// POST /api/v1/auth/register
// Public
exports.register = asyncHandler(async (req, res, next) => {

    const { name, email, password, role } = req.body;

    const user = await User.create({
        name, 
        email,
        password,
        role
    });

    sendTokenResponse(user, 200, res);
});

// login user
// POST /api/v1/auth/login
// Public
exports.login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password'))
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);

});

// Get logout user
// GET /api/v1/auth/logout
// public
exports.logout = asyncHandler(async (req, res, next) => {

    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 1 * 1000),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        data: {}
    });
});

// Get logged in  user
// GET /api/v1/auth/me
// Private
exports.getLoggedInUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    })
});

// update user details
// GET /api/v1/auth/updatedetails
// Private
exports.updateDetails = asyncHandler(async (req, res, next) => {

    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true 
    });


    res.status(200).json({
        success: true,
        data: user
    })
});

// update user password
// POST /api/v1/auth/updatepassword
// Private
exports.updatePassword = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
    
});

//  forgot password
// POST /api/v1/auth/forgotpassword
// Private
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorResponse('There is no user with that email', 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `
        You are receiving this email because you 
        (or someone else Yikes!)
        has requested a new password
        Submit a put request to ${resetUrl}
    `;

    const options = {
        email: user.email,
        subject: 'Password Reset',
        message
    };
    
    try {
        await sendEmail(options);
        res.status(200).json({ success: true, message: 'Email sent' });
    } catch (error) {
        console.error(error);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpired = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorResponse('Email could not be sent', 500));
    }
});

// reset password
// PUT /api/v1/auth/resetpassword/:resettoken
// public
exports.resetPassword = asyncHandler(async (req, res, next) => {

    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpired: { $gt: Date.now() }
    });
    
    if (!user) {
        return next(new ErrorResponse('Invalid Token', 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);

});


const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwt();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({ success: true, token });
};
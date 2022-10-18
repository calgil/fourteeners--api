const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const PeakClimbedSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    dateClimbed: {
        type: Date,
        required: [true, 'Please add a date climbed']
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter valid email'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'publisher', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please include a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpired: Date,
    createAt: {
        type: Date,
        default: Date.now
    },
    peaksClimbed: [{
        type: PeakClimbedSchema,
    }]
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedJwt = function(next) {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)
        // expiresIn: process.env.JWT_EXPIRE
    })
};

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.resetPasswordExpired = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

module.exports = mongoose.model('User', UserSchema);
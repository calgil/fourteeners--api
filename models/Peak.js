const mongoose = require('mongoose');
const slugify = require('slugify');

const RouteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add route name']
    },
    mileage: {
        type: Number,
        required: [true, 'Please add mileage'],
    },
    gain: {
        type: Number,
        required: [true, 'Please add elevation gain'],
    },
    difficulty: {
        type: String,
        required: [true, 'Please add difficulty'],
    },
    exposure: {
        type: Number,
        required: [true, 'Please add exposure rating'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
})

const PeakSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    slug: String,
    elevation: {
        type: Number,
        required: [true, 'Please add elevation'],
        maxlength: [5, 'Elevation cannot exceed 5 characters'],
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    rank: {
        type: Number,
        required: [true, 'Please add rank'],
        maxlength: [2, 'Rank cannot exceed 2 characters'],
    },
    range: {
        type: String,
        required: [true, 'Please add range'],
        maxlength: [50, 'Range cannot exceed 50 characters'],
    },
    forest: {
        type: String,
        maxlength: [50, 'Forest name cannot exceed 50 characters'],
    },
    numberOfRoutes: {
        type: Number,
    },
    routes: [{
        type: RouteSchema,
        required: true,
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        // required: true
    }
});

PeakSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true })
    next();
})

module.exports = mongoose.model('Peak', PeakSchema);
const mongoose = require('mongoose');

// this could probably go in separate file
const PhotoSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
});

const ReportSchema = new mongoose.Schema({
    routeId: {
        type: String,
        required: [true, 'Please add route']
    },
    peakId: {
        type: String,
        required: [true, 'Please add peak']
    },
    userId: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    dateClimbed: {
        type: Date,
    },
    details: {
        type: String,
        maxlength: [1000, 'Report cannot exceed 1000 characters'],
    },
    rating: {
        type: Number,
    },
    photos: [{
        type: PhotoSchema,
        required: [true, 'Please add photo'],
    }]
})

module.exports = mongoose.model('Report', ReportSchema);
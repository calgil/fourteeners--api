const Peak = require('../models/Peak');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// create peak
// POST /api/v1/peaks
// Private
exports.createPeak = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id;
    const peak = await Peak.create(req.body);
    res.status(200).json({
         success: true, 
         data: peak 
    });
});

// get all peaks
// GET /api/v1/peaks
// Public
exports.getPeaks = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.filteredResults);
});

// get peak
// GET /api/v1/peaks/:id
// Public
exports.getPeak = asyncHandler(async (req, res, next) => {
        const peak = await Peak.findById(req.params.id);
        if(!peak) {
            return next(new ErrorResponse(`Peak not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: peak });
});

// update peak
// PUT /api/v1/peaks/:id
// Private
exports.updatePeak = asyncHandler(async (req, res, next) => {
        let peak = await Peak.findById(req.params.id);

        if (!peak) {
            return next(new ErrorResponse(`Peak not found with id of ${req.params.id}`, 404));
        }

        if (peak.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this peak`, 401));
        }

        peak = await Peak.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: peak });   
});
// delete peak
// DELETE /api/v1/peaks/:id
// Private
exports.deletePeak = asyncHandler(async (req, res, next) => {
        const peak = await Peak.findById(req.params.id);
        if (!peak) {
            return next(new ErrorResponse(`Peak not found with id of ${req.params.id}`, 404));
        }

        if (peak.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this peak`, 401));
        }

        peak.remove();

        res.status(200).json({ success: true });       
});

// upload peak photo
// PUT /api/v1/peaks/:id/photo
// Private
// This function seemed pointless when I can just use the endpoint to change photo info
// exports.peakUploadPhoto = asyncHandler(async (req, res, next) => {
//     const peak = await Peak.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true
//     })
//     if (!peak) {
//         return next(new ErrorResponse(`Peak not found with id of ${req.params.id}`, 404));
//     }
//     res.status(200).json({ success: true, data: peak });   

// });

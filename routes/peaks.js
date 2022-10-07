const express = require('express');
const router = express.Router();
const filteredResults = require('../middleware/filteredResults');
const Peak = require('../models/Peak');

const {
    createPeak,
    getPeaks,
    getPeak,
    updatePeak,
    deletePeak,
    // peakUploadPhoto
} = require('../controllers/peaks');

const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(filteredResults(Peak), getPeaks)
    .post(protect, authorize('publisher', 'admin'), createPeak);

router.route('/:id')
    .get(getPeak)
    .put(protect, authorize('publisher', 'admin'), updatePeak)
    .delete(protect, authorize('publisher', 'admin'), deletePeak);

router.route('/:id/photo')
.put(protect, authorize('publisher', 'admin'), updatePeak)

module.exports = router;
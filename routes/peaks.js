const express = require('express');
const router = express.Router();
const filteredResults = require('../middleware/filteredResults');
const Peak = require('../models/Peak');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const {
    createPeak,
    getPeaks,
    getPeak,
    updatePeak,
    deletePeak,
    uploadPeakPhoto
} = require('../controllers/peaks');

const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(filteredResults(Peak), getPeaks)
    .post(protect, authorize('admin'), createPeak);

router.route('/:id')
    .get(getPeak)
    .put(protect, authorize('admin'), updatePeak)
    .delete(protect, authorize('admin'), deletePeak);


router.route('/uploadphoto')
.post(protect, upload.single('image'), authorize('admin'), uploadPeakPhoto);
    
module.exports = router;
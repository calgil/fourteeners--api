const express = require('express');
const router = express.Router();
// const Report = require('../models/Report');

const { createReport, uploadReportPhoto } = require('../controllers/reports')

router.route('/')
    .post(createReport)

router.route('/photo')
    .post(uploadReportPhoto)

module.exports = router;
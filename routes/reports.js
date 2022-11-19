const express = require('express');
const router = express.Router();
// const Report = require('../models/Report');

const { createReport } = require('../controllers/reports')

router.route('/')
    .post(createReport)

module.exports = router;
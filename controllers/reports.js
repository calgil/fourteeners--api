const Report = require('../models/Report');
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const { uploadFile, getFileStream } = require('./s3');

exports.createReport = async (req, res, next) => {
    const report = await Report.create(req.body);
    res.status(200).json({
        success: true, 
        data: report 
   });
}

exports.uploadReportPhoto = async (req, res, next) => {
    const file = req.file
    const result = await uploadFile(file)
    await unlinkFile(file.path)
res.send({ imagePath: `peaks/images/${result.Key}`})
}
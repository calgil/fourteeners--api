const Report = require('../models/Report');

exports.createReport = async (req, res, next) => {
    console.log('new report', req);
    const report = await Report.create(req.body);
    res.status(200).json({
        success: true, 
        data: report 
   });
}
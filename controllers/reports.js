const Report = require("../models/Report");
const asyncHandler = require("../middleware/async");
const { getPresignedUrl } = require("../s3");

exports.createReport = asyncHandler(async (req, res, next) => {
  const report = await Report.create(req.body);
  res.status(200).json({
    success: true,
    data: report,
  });
});

exports.getReports = asyncHandler(async (req, res, next) => {
  const reports = res.filteredResults.data;
  for (const report of reports) {
    const url = await getPresignedUrl(report.photos[0].url);
    report.photos[0].imageUrl = url;
  }
  res.status(200).json(reports);
});

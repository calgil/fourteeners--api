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
  const { success, count, pagination } = res.filteredResults;
  const reports = res.filteredResults.data;
  for (const report of reports) {
    if (report.photos) {
      const url = await getPresignedUrl(report.photos[0].url);
      report.photos[0].imageUrl = url;
    }
  }
  res.status(200).json({
    success,
    count,
    pagination,
    reports,
  });
});

exports.updateReport = asyncHandler(async (req, res, next) => {
  let report = await Report.findById(req.params.id);
  if (!report) {
    return next(
      new ErrorResponse(`Peak not found with id of ${req.params.id}`, 404)
    );
  }
  report = await Report.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: report });
});

exports.deleteReport = asyncHandler(async (req, res, next) => {
  const report = await Report.findById(req.params.id);
  if (!report) {
    return next(
      new ErrorResponse(`Peak not found with id of ${req.params.id}`, 404)
    );
  }

  report.remove();

  res.status(200).json({ success: true });
});

const Peak = require("../models/Peak");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const { uploadFile, getFileStream, deleteObject } = require("../s3");

// create peak
// POST /api/v1/peaks
// Private
exports.createPeak = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const peak = await Peak.create(req.body);
  res.status(200).json({
    success: true,
    data: peak,
  });
});

// get all peaks
// GET /api/v1/peaks
// Public
exports.getPeaks = asyncHandler(async (req, res, next) => {
  const peaks = res.filteredResults.data;
  // console.log("get all", peaks);
  // console.log("get all", res.filteredResults);
  for (const peak of peaks) {
    const imageUrl = await getFileStream(peak.photos[0].url);
    peak.photos[0].imageUrl = imageUrl;
    // console.log("photos", imageUrl);
  }
  // console.log("peaks", peaks);
  // console.log("peaks", peaks);
  res.status(200).json(peaks);
  // res.send(peaks);
});

// get peak
// GET /api/v1/peaks/:id
// Public
exports.getPeak = asyncHandler(async (req, res, next) => {
  const peak = await Peak.findById(req.params.id);
  if (!peak) {
    return next(
      new ErrorResponse(`Peak not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: peak });
});

// update peak
// PUT /api/v1/peaks/:id
// Private
exports.updatePeak = asyncHandler(async (req, res, next) => {
  let peak = await Peak.findById(req.params.id);

  if (!peak) {
    return next(
      new ErrorResponse(`Peak not found with id of ${req.params.id}`, 404)
    );
  }

  if (req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this peak`,
        401
      )
    );
  }

  peak = await Peak.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: peak });
});
// delete peak
// DELETE /api/v1/peaks/:id
// Private
exports.deletePeak = asyncHandler(async (req, res, next) => {
  const peak = await Peak.findById(req.params.id);
  if (!peak) {
    return next(
      new ErrorResponse(`Peak not found with id of ${req.params.id}`, 404)
    );
  }

  if (peak.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this peak`,
        401
      )
    );
  }

  peak.remove();

  res.status(200).json({ success: true });
});

exports.getPeakPhoto = async (req, res, next) => {
  const key = req.params.key;
  const readStream = await getFileStream(key);
  // console.log("read", readStream);

  // return readStream;
  // readStream.pipe(res);
};

// upload peak photo
// POST /api/v1/peaks/:id/photo
// User
exports.uploadPeakPhoto = asyncHandler(async (req, res, next) => {
  // console.log("upload body", req.body);
  // console.log("upload file", req.file);
  console.log("upload photo");
  const imageName = await uploadFile(req.file);
  // const result =
  // console.log("upload res", result);
  res.send({ success: true, imageName });
  // await unlinkFile(file.path);
  // res.send({ imagePath: `peaks/images/${result.Key}` });
});

exports.deletePhoto = async (req, res, next) => {
  // console.log("delete");
  const key = req.params.key;
  await deleteObject(key);
  res.send({ success: true });
};
// // upload peak photo
// // POST /api/v1/peaks/:id/photo
// // User
// exports.uploadPeakPhoto = asyncHandler(async (req, res, next) => {
//   console.log("upload");
//   const file = req.file;
//   const result = await uploadFile(file);
//   await unlinkFile(file.path);
//   res.send({ imagePath: `peaks/images/${result.Key}` });
// });

// exports.deletePhoto = async (req, res, next) => {
//   // console.log("delete");
//   const key = req.params.key;
//   await deleteObject(key);
//   res.send({ success: true });
// };

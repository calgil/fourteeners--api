const asyncHandler = require("../middleware/async");
const { uploadFile, getPresignedUrl, deleteObject } = require("../s3");

// upload photo
// POST /api/v1/photos/:id/photo
// User
exports.uploadPhoto = asyncHandler(async (req, res, next) => {
  const imageName = await uploadFile(req.file);
  res.send({ success: true, imageName });
});

// delete photo
// DELETE /api/v1/photos/:id/photo
// Admin or user's own
exports.deletePhoto = async (req, res, next) => {
  const key = req.params.id;
  const response = await deleteObject(key);
  res.send({ response });
};

// get photo
// GET /api/v1/photos/:id/photo
// Public
exports.getPresignedUrl = asyncHandler(async (req, res, next) => {
  const imageName = req.params.id;
  const url = await getPresignedUrl(imageName);
  res.send({ success: true, url });
});

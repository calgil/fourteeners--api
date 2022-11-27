const express = require("express");
const router = express.Router();
const filteredResults = require("../middleware/filteredResults");
const Peak = require("../models/Peak");

// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

const {
  createPeak,
  getPeaks,
  getPeak,
  updatePeak,
  deletePeak,
  uploadPeakPhoto,
  getPeakPhoto,
  deletePhoto,
} = require("../controllers/peaks");

const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(filteredResults(Peak), getPeaks)
  .post(protect, authorize("admin"), createPeak);

router
  .route("/:id")
  .get(getPeak)
  .put(protect, authorize("admin"), updatePeak)
  .delete(protect, authorize("admin"), deletePeak);

// router.route("/uploadphoto").post(upload.single("image"), uploadPeakPhoto);
// .post(protect, authorize('admin'), upload.single('image'), uploadPeakPhoto);

module.exports = router;

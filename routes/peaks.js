const express = require("express");
const router = express.Router();
const filteredResults = require("../middleware/filteredResults");
const Peak = require("../models/Peak");

const {
  createPeak,
  getPeaks,
  getPeak,
  updatePeak,
  deletePeak,
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

module.exports = router;

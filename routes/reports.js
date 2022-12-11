const express = require("express");
const router = express.Router();
const filteredResults = require("../middleware/filteredResults");
const Report = require("../models/Report");

const {
  createReport,
  getReports,
  updateReport,
  deleteReport,
} = require("../controllers/reports");

router.route("/").post(createReport).get(filteredResults(Report), getReports);

router.route("/:id").put(updateReport).delete(deleteReport);

module.exports = router;

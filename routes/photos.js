const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  uploadPhoto,
  getPresignedUrl,
  deletePhoto,
} = require("../controllers/photos");

router.route("/").post(upload.single("image"), uploadPhoto);

router.route("/:id").get(getPresignedUrl).delete(deletePhoto);

module.exports = router;

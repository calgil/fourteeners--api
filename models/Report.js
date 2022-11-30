const mongoose = require("mongoose");

const PhotoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: "",
  },
});

const ReportSchema = new mongoose.Schema({
  routeId: {
    type: String,
    required: [true, "Please add route"],
  },
  routeName: {
    type: String,
  },
  peakId: {
    type: String,
    required: [true, "Please add peak"],
  },
  peakName: {
    type: String,
  },
  userId: {
    type: String,
  },
  userName: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dateClimbed: {
    type: Date,
  },
  title: {
    type: String,
  },
  details: {
    type: String,
    maxlength: [1000, "Report cannot exceed 1000 characters"],
  },
  rating: {
    type: Number,
  },
  photos: [
    {
      type: PhotoSchema,
      required: [true, "Please add photo"],
    },
  ],
});

module.exports = mongoose.model("Report", ReportSchema);

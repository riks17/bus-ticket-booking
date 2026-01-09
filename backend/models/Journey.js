const mongoose = require("mongoose");

const journeySchema = new mongoose.Schema(
  {
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
      unique: true, // a bus can only be assigned to one active journey
    },
    source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    departureTime: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Journey", journeySchema);

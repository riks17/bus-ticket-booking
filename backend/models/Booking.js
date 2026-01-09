const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
    journey: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Journey",
      required: true,
    },
    seatNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["BOOKED", "CANCELLED"],
      default: "BOOKED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);

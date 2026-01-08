const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: String,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { _id: false }
);

const busSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: true,
      unique: true,
    },

    source: {
      type: String,
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    totalSeats: {
      type: Number,
      required: true,
    },

    seats: {
      type: [seatSchema],
      required: true,
    },
  },
  { timestamps: true }
);

/* Reset bus seats (Admin feature) */
busSchema.methods.resetSeats = function () {
  this.seats = this.seats.map((seat) => ({
    ...seat,
    isBooked: false,
    bookedBy: null,
  }));
};

module.exports = mongoose.model("Bus", busSchema);

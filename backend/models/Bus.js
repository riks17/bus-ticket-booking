const mongoose = require("mongoose");

const ALLOWED_CAPACITIES = [16, 20, 28, 40];

const seatSchema = new mongoose.Schema(
  {
    seatNumber: { type: String, required: true }, // e.g., R1-LW
    row: { type: Number, required: true }, // 1-based row index
    position: {
      type: String,
      enum: ["LW", "LA", "RA", "RW"], // Left Window, Left Aisle, Right Aisle, Right Window
      required: true,
    },
    isBooked: { type: Boolean, default: false },
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
    busNumber: { type: String, required: true, unique: true },
    seatCapacity: {
      type: Number,
      required: true,
      enum: ALLOWED_CAPACITIES,
    },
    seats: { type: [seatSchema], required: true },
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

busSchema.statics.generateSeats = function (capacity) {
  if (!ALLOWED_CAPACITIES.includes(capacity)) {
    throw new Error("Invalid seat capacity");
  }

  const rows = capacity / 4; // 4 seats per row
  const positions = ["LW", "LA", "RA", "RW"]; // left window, left aisle, right aisle, right window

  const seats = [];
  for (let row = 1; row <= rows; row++) {
    positions.forEach((pos) => {
      seats.push({
        seatNumber: `R${row}-${pos}`,
        row,
        position: pos,
        isBooked: false,
        bookedBy: null,
      });
    });
  }

  return seats;
};

busSchema.statics.ALLOWED_CAPACITIES = ALLOWED_CAPACITIES;

module.exports = mongoose.model("Bus", busSchema);

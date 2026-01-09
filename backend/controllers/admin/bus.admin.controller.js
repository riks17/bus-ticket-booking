const Bus = require("../../models/Bus");
const Booking = require("../../models/Booking");

/**
 * Create a new bus with generated seat layout
 */
exports.createBus = async (req, res, next) => {
  try {
    const { busNumber, seatCapacity } = req.body;

    if (!busNumber || !seatCapacity) {
      return res
        .status(400)
        .json({ message: "Bus number and seat capacity are required" });
    }

    const existing = await Bus.findOne({ busNumber });
    if (existing) {
      return res.status(400).json({ message: "Bus already exists" });
    }

    const seats = Bus.generateSeats(Number(seatCapacity));

    const bus = await Bus.create({
      busNumber,
      seatCapacity: Number(seatCapacity),
      seats,
    });

    res.status(201).json({
      message: "Bus created successfully",
      bus,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Reset a bus (clear all bookings)
 */
exports.resetBus = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.busId);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    // Reset all seats
    bus.resetSeats();
    await bus.save();

    // Cancel all bookings for this bus
    await Booking.updateMany(
      { bus: req.params.busId, status: "BOOKED" },
      { status: "CANCELLED" }
    );

    res.status(200).json({
      message: "Bus reset successfully",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * List all buses (for admin dropdowns)
 */
exports.listBuses = async (req, res, next) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    res.status(200).json(buses);
  } catch (err) {
    next(err);
  }
};
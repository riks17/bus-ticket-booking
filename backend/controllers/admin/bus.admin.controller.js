const Bus = require("../../models/Bus");
const Booking = require("../../models/Booking");

/**
 * Create a new bus with seat layout
 */
exports.createBus = async (req, res, next) => {
  try {
    const { busNumber, source, destination, totalSeats } = req.body;

    const existing = await Bus.findOne({ busNumber });
    if (existing) {
      return res.status(400).json({ message: "Bus already exists" });
    }

    const seats = Array.from({ length: totalSeats }, (_, i) => ({
      seatNumber: `S${i + 1}`,
      isBooked: false,
      bookedBy: null,
    }));

    const bus = await Bus.create({
      busNumber,
      source,
      destination,
      totalSeats,
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

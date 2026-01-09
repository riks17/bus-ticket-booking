const Bus = require("../../models/Bus");
const Booking = require("../../models/Booking");
const Journey = require("../../models/Journey");

/**
 * Book a seat on a journey
 */
exports.bookSeat = async (req, res, next) => {
  try {
    const { journeyId, seatNumber } = req.body;

    if (!journeyId || !seatNumber) {
      return res
        .status(400)
        .json({ message: "Journey and seat number are required" });
    }

    const journey = await Journey.findById(journeyId).populate(
      "bus",
      "busNumber seats"
    );

    if (!journey || !journey.bus) {
      return res.status(404).json({ message: "Journey not found" });
    }

    const bus = journey.bus;

    const seat = bus.seats.find((s) => s.seatNumber === seatNumber);
    if (!seat) {
      return res.status(400).json({ message: "Invalid seat number" });
    }

    if (seat.isBooked) {
      return res.status(409).json({ message: "Seat already booked" });
    }

    seat.isBooked = true;
    seat.bookedBy = req.user.id;

    await bus.save();

    const booking = await Booking.create({
      user: req.user.id,
      bus: bus._id,
      journey: journeyId,
      seatNumber,
    });

    // --- Socket Implementation ---
    // Emit event to all clients to update the seat map instantly
    const io = req.app.get("io");
    io.emit("seatUpdate", {
      busId: bus._id,
      journeyId: journeyId, // Included in case frontend tracks by Journey ID
      seatNumber,
      action: "BOOKED",
    });
    // -----------------------------

    res.status(201).json({
      message: "Seat booked successfully",
      booking,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * View user's booking history
 */
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
      status: "BOOKED",
    })
      .populate("bus", "busNumber seatCapacity")
      .populate({
        path: "journey",
        populate: [
          { path: "source", select: "name" },
          { path: "destination", select: "name" },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

/**
 * Cancel a booking
 */
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized: Cannot cancel this booking" });
    }

    if (booking.status === "CANCELLED") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    const bus = await Bus.findById(booking.bus);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const seat = bus.seats.find(
      (s) => s.seatNumber === booking.seatNumber
    );

    if (seat) {
      seat.isBooked = false;
      seat.bookedBy = null;
    }

    booking.status = "CANCELLED";

    await bus.save();
    await booking.save();

    // --- Socket Implementation ---
    // Emit event to release the seat instantly for other users
    const io = req.app.get("io");
    io.emit("seatUpdate", {
      busId: booking.bus,
      journeyId: booking.journey, // Pass journeyId if available in booking model
      seatNumber: booking.seatNumber,
      action: "CANCELLED",
    });
    // -----------------------------

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err) {
    next(err);
  }
};
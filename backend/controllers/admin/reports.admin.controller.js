const Booking = require("../../models/Booking");

/**
 * View all ticket sales with user & seat details
 */
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
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

const Journey = require("../../models/Journey");
const Bus = require("../../models/Bus");

exports.getJourneys = async (_req, res, next) => {
  try {
    const journeys = await Journey.find({ isActive: true })
      .populate("bus", "busNumber seatCapacity seats")
      .populate("source destination", "name")
      .sort({ createdAt: -1 });

    const formatted = journeys.map((j) => {
      const availableSeats =
        j.bus?.seats?.filter((s) => !s.isBooked).length ?? 0;
      return {
        _id: j._id,
        bus: {
          _id: j.bus?._id,
          busNumber: j.bus?.busNumber,
          seatCapacity: j.bus?.seatCapacity,
        },
        source: j.source,
        destination: j.destination,
        departureTime: j.departureTime,
        availableSeats,
      };
    });

    res.status(200).json(formatted);
  } catch (err) {
    next(err);
  }
};

exports.getJourneyById = async (req, res, next) => {
  try {
    const journey = await Journey.findById(req.params.journeyId)
      .populate("bus", "busNumber seatCapacity seats")
      .populate("source destination", "name");

    if (!journey) {
      return res.status(404).json({ message: "Journey not found" });
    }

    const sanitized = journey.toObject();
    if (sanitized.bus?.seats) {
      sanitized.bus.seats = sanitized.bus.seats.map(
        ({ seatNumber, row, position, isBooked }) => ({
          seatNumber,
          row,
          position,
          isBooked,
        })
      );
    }

    res.status(200).json(sanitized);
  } catch (err) {
    next(err);
  }
};

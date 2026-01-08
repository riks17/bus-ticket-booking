const Bus = require("../../models/Bus");

/**
 * View all available buses
 */
exports.getAllBuses = async (req, res, next) => {
  try {
    const buses = await Bus.find({}, "-seats.bookedBy");
    res.status(200).json(buses);
  } catch (err) {
    next(err);
  }
};

/**
 * View specific bus details + seat map
 */
exports.getBusById = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.busId);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.status(200).json(bus);
  } catch (err) {
    next(err);
  }
};

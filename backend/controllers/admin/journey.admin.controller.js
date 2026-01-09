const Journey = require("../../models/Journey");
const Bus = require("../../models/Bus");
const Location = require("../../models/Location");

exports.createJourney = async (req, res, next) => {
  try {
    const { busId, sourceId, destinationId, departureTime } = req.body;

    if (!busId || !sourceId || !destinationId) {
      return res
        .status(400)
        .json({ message: "Bus, source, and destination are required" });
    }

    if (sourceId === destinationId) {
      return res
        .status(400)
        .json({ message: "Source and destination must be different" });
    }

    const [bus, source, destination] = await Promise.all([
      Bus.findById(busId),
      Location.findById(sourceId),
      Location.findById(destinationId),
    ]);

    if (!bus) return res.status(404).json({ message: "Bus not found" });
    if (!source)
      return res.status(404).json({ message: "Source location not found" });
    if (!destination)
      return res.status(404).json({ message: "Destination location not found" });

    const existingJourney = await Journey.findOne({ bus: busId });
    if (existingJourney) {
      return res.status(400).json({
        message: "This bus is already assigned to a journey",
      });
    }

    const journey = await Journey.create({
      bus: busId,
      source: sourceId,
      destination: destinationId,
      departureTime: departureTime || null,
    });

    const populated = await Journey.findById(journey._id)
      .populate("bus", "busNumber seatCapacity")
      .populate("source destination", "name");

    res.status(201).json({
      message: "Journey created successfully",
      journey: populated,
    });
  } catch (err) {
    next(err);
  }
};

exports.getJourneys = async (_req, res, next) => {
  try {
    const journeys = await Journey.find()
      .populate("bus", "busNumber seatCapacity")
      .populate("source destination", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(journeys);
  } catch (err) {
    next(err);
  }
};

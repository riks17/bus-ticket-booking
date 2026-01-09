const Location = require("../../models/Location");

exports.createLocation = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Location name is required" });
    }

    const existing = await Location.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Location already exists" });
    }

    const location = await Location.create({ name: name.trim() });

    res.status(201).json({
      message: "Location created successfully",
      location,
    });
  } catch (err) {
    next(err);
  }
};

exports.getLocations = async (_req, res, next) => {
  try {
    const locations = await Location.find().sort({ name: 1 });
    res.status(200).json(locations);
  } catch (err) {
    next(err);
  }
};

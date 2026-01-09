require("dotenv").config();
const connectDB = require("../config/db");
const { Bus, Location, Journey } = require("../models");

const locationNames = [
  "Thane",
  "Ghatkopar",
  "Andheri",
  "Marol Naka",
  "Saki Naka",
];

const busesToSeed = [
  { busNumber: "MH01-BUS-01", seatCapacity: 28 },
  { busNumber: "MH01-BUS-02", seatCapacity: 20 },
  { busNumber: "MH01-BUS-03", seatCapacity: 40 },
  { busNumber: "MH01-BUS-04", seatCapacity: 16 },
  { busNumber: "MH01-BUS-05", seatCapacity: 28 },
];

const journeysToSeed = [
  { busNumber: "MH01-BUS-01", source: "Thane", destination: "Ghatkopar" },
  { busNumber: "MH01-BUS-02", source: "Thane", destination: "Marol Naka" },
  { busNumber: "MH01-BUS-03", source: "Ghatkopar", destination: "Andheri" },
  { busNumber: "MH01-BUS-04", source: "Saki Naka", destination: "Marol Naka" },
  { busNumber: "MH01-BUS-05", source: "Andheri", destination: "Thane" },
];

async function seed() {
  await connectDB();

  console.log("Seeding locations...");
  const locations = {};
  for (const name of locationNames) {
    const existing = await Location.findOne({ name });
    locations[name] = existing || (await Location.create({ name }));
  }

  console.log("Seeding buses...");
  const buses = {};
  for (const busDef of busesToSeed) {
    let bus = await Bus.findOne({ busNumber: busDef.busNumber });
    if (!bus) {
      bus = await Bus.create({
        busNumber: busDef.busNumber,
        seatCapacity: busDef.seatCapacity,
        seats: Bus.generateSeats(busDef.seatCapacity),
      });
    }
    buses[bus.busNumber] = bus;
  }

  console.log("Seeding journeys...");
  for (const journeyDef of journeysToSeed) {
    const bus = buses[journeyDef.busNumber];
    const source = locations[journeyDef.source];
    const destination = locations[journeyDef.destination];

    if (!bus || !source || !destination) continue;

    const exists = await Journey.findOne({ bus: bus._id });
    if (!exists) {
      await Journey.create({
        bus: bus._id,
        source: source._id,
        destination: destination._id,
      });
    }
  }

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed", err);
  process.exit(1);
});

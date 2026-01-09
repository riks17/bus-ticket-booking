require("dotenv").config();
const http = require("http"); // Import http
const { Server } = require("socket.io"); // Import Socket.io
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5001;

// Create HTTP server from the Express app
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (adjust for production)
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

// Make io accessible globally via req.app.get('io')
app.set("io", io);

(async () => {
  try {
    await connectDB();

    // Listen on the 'server', not 'app'
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server startup failed:", err);
    process.exit(1);
  }
})();
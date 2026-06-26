import "dotenv/config";
import express from "express";
import userRoutes from "./routes/userRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import arenaRoutes from "./routes/arenaRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/shop", shopRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/arenas", arenaRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Borderland. The games have begun.",
    version: "1.0.0",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API docs at http://localhost:${PORT}/api-docs`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try a different port by setting the PORT environment variable`);
    process.exit(1);
  }
  throw err;
});
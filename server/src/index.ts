import express from "express";
import cors from "cors";
import { initializeDatabase } from "./db/sqlite";
import { authRoutes } from "./routes/auth.routes";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware (must be last)
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || "Something went wrong!",
      data: null,
    });
  },
);

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    data: null,
  });
});

// Start server
const startServer = async () => {
  try {
    // Initialize database first
    initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Export app for testing
export default app;

// Start server only if not in test environment
if (process.env.NODE_ENV !== "test") {
  startServer();
}

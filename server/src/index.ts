import dns from "node:dns";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/authRoutes";
import resumeRoutes from "./routes/resumeRoutes";
import templateRoutes from "./routes/templateRoutes";
import interviewRoutes from "./routes/interviewRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import testimonialRoutes from "./routes/testimonialRoutes";
import faqRoutes from "./routes/faqRoutes";
import statsRoutes from "./routes/statsRoutes";
import contactRoutes from "./routes/contactRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";
import { seedTemplates } from "./utils/seedTemplates";
import { seedTestimonialsAndFaq } from "./utils/seedTestimonials";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/favorites", favoriteRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    await seedTemplates();
    await seedTestimonialsAndFaq();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;

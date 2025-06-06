import express from "express";
import configureCors from "./configure/cors.configure.js";
import dotenv from "dotenv";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import rateLimiter from "./middlewares/rateLimiter.middleware.js";

// Load environment variables from .env file
dotenv.config();
const app = express();

// Middleware configuration
app.set("trust proxy", true); // Trust the first proxy (Render's proxy)
app.use(configureCors()); // Configure CORS
app.use(rateLimiter); // Apply rate limiting middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Route imports
import chaptersRouter from "./routes/chapters.routes.js";
app.use("/api/v1/chapters", chaptersRouter);

// Catch-all route for 404 errors
app.use((req, res) => {
    res.status(404).json({message: "Page not found", status: 404})
})

// Error handling middleware
// This should be the last middleware in the stack
app.use(errorHandler);

export default app;
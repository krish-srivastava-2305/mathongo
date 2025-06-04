import express, { urlencoded } from "express";
import configureCors from "./configure/cors.configure.js";
import dotenv from "dotenv";
import errorHandler from "./middlewares/errorHandler.middleware.js";

dotenv.config();
const app = express();

app.use(configureCors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import chaptersRouter from "./routes/chapters.routes.js";
app.use("/api/chapters", chaptersRouter);

app.use((req, res) => {
    res.status(404).json({message: "Page not found", status: 404})
})
app.use(errorHandler);
export default app;
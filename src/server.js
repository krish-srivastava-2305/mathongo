import app from "./app.js";
import connectDB from "./configure/db.configure.js";


// Server initialization function
// This function sets up the server, connects to the database, and starts listening for requests.
const init = () => {
     try {
        console.log("Initializing server...");
        const PORT = process.env.PORT || 3000
        const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mathongo";
        connectDB(MONGO_URI);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error initializing server:", error);
    }
}

init();
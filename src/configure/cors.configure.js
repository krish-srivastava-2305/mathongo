import cors from "cors";

// This function configures CORS for the application
const configureCors = () => {
    return cors({
        origin: (origin, callback) => {
            const allowedOrigins = [
                "http://localhost:3000", // Development environment
                "https://production.com" // Production environment
                // Add more allowed origins as needed
            ]

            if(!origin || allowedOrigins.indexOf(origin) !== -1){
                callback(null, true)
            } else {
                callback(new Error("CORS Error, Origin not allowed"), false)
            }
        },
        credentials: true,
        methods: [ "GET", "POST", "PUT", "DELETE" ],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
}

export default configureCors
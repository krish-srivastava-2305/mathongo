import cors from "cors";

const configureCors = () => {
    return cors({
        origin: (origin, callback) => {
            const allowedOrigins = [
                "http://localhost:3000",
                "https://production.com"
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
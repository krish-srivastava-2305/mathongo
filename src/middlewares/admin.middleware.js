
// Simulating an admin user for demonstration purposes
const adminMiddleware = (req, res, next) => {
    req.user = "admin"
    next();
}

export default adminMiddleware;
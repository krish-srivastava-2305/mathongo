const adminMiddleware = (req, res, next) => {
    req.user = "admin" // Simulating an admin user for demonstration purposes
    next();
}

export default adminMiddleware;
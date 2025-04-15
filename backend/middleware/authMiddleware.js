const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    
  const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
  console.log(token)

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify the token
    req.user = decoded; // Attach user data to request
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
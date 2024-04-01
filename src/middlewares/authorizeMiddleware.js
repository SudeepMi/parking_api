const authorize = (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // User has either "admin" or "owner" role, proceed to the next middleware/route handler
  if (user.roles.includes("admin") || user.roles.includes("owner")) {
    next();
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }
};

export default authorize;

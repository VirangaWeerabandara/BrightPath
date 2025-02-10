const requireTeacher = async (req, res, next) => {
  if (req.user && req.user.role === "teacher") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Teachers only." });
  }
};

module.exports = requireTeacher;

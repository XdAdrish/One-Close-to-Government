export const requireRole = (role) => (req, res, next) => {
  // req.auth.publicMetadata.role is where Clerk stores custom roles
  if (!req.auth || req.auth.publicMetadata?.role !== role) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

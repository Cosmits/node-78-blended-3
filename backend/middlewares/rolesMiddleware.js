module.exports = (rolesArr) => {
  return (req, res, next) => {
    // console.log(req.user.id);
    // console.log(rolesArr);
    // console.log(req.user.roles);
    // next();
    try {
      let hasRole = false;
      const { roles } = req.user;
      roles.forEach((role) => {
        if (rolesArr.includes(role)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        res.status(403).json({ code: 403, message: "Forbiden" });
      }
      next();
    } catch (error) {
      res.status(403).json({ code: 403, message: error.message });
    }
  };
};

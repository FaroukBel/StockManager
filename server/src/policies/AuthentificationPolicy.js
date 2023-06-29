module.exports = {
    async register(req, res, next) {
      const { username, password } = req.body;
      const errors = {};
  
      if (!username) {
        errors.username = "Username is required.";
      }
  
      if (!password) {
        errors.password = "Password is required.";
      }
  
      if (password.length < 6) {
        errors.password = "Password must be at least 6 characters long.";
      }
  
      if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
      }
  
      // If registration is valid, invoke the `next` function to proceed to the next middleware
      next();
    },
  };
  
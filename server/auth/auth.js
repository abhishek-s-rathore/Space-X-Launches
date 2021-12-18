const jwt = require('jsonwebtoken');

module.exports = {
  verifyUserLoggedIn: async (req, res, next) => {
    console.log('hit');
    try {
      const token = req.headers.authorization;
      const payload = await jwt.verify(token, process.env.SECRET);
      req.userId = payload.userId;
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};

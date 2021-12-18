var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
const axios = require('axios').default;
const User = require('../models/usermodel');
const auth = require('../auth/auth');
/* GET home page. */
router.get('/', auth.verifyUserLoggedIn, async (req, res, next) => {
  let id = req.userId;
  try {
    let user = await User.findById(id);
    res.status(200).json({ user: user.displayUser(id) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

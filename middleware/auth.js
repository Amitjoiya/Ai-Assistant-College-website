const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Check session first, then JWT token
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }

  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.redirect('/login');
  }
};

module.exports = auth;

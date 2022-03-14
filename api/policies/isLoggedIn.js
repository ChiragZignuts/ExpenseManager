const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    // get token from header
    const token = req.headers.authorization.split(' ')[1];

    // decode the token
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;

    // check token with database
    let dbToken = await User.findOne({ token: token });

    // if token is valid then proceed else denieds
    if (dbToken) {
      return next();
    } else {
      return res.status(401).json({
        message: 'Auth Failed',
      });
    }
  } catch (error) {
    return res.status(resCode.SERVER_ERROR).json({
      error: error.message,
    });
  }
};

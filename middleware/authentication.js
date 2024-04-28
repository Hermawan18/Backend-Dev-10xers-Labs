const { verifyToken } = require('../helpers/jwt');

function authentication(req, res, next) {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw { name: 'Unauthorized' };
    }

    const token = authorization.split(' ')[1];
    const decode = verifyToken(token);

    if (decode.role !== 'admin') {
      throw { name: 'Unauthorized' };
    } else {
      req.user = decode;
      next();
    }
  } catch (error) {
    next(error);
  }
}

module.exports = authentication;

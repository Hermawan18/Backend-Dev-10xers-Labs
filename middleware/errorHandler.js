function errorHandler(err, req, res, next) {
  let errMsg = [];

  if (err.name === 'SequelizeValidationError') {
    err.errors.forEach((error) => {
      errMsg.push(error.message);
    });

    res.status(400).json({ message: errMsg });
  } else if (err.name === 'JsonWebTokenError' || err.name === 'Unauthorized') {
    res.status(401).json({ message: 'Please login first' });
  } else if (err.name === 'ForbiddenAccess') {
    res.status(403).json({ message: 'Forbidden Access' });
  } else if (err.name === 'NotFound') {
    res.status(404).json({ message: 'Data Not Found' });
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = errorHandler;

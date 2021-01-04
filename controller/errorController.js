const errorHandler = (err, req, res, next) => {
  const error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  res.status(200).json({
    status: 'fail',
    error,
  });
};

module.exports = errorHandler;

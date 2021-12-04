const errorHandler = (err, res) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
  });
};

module.exports = errorHandler;

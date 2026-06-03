export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: err.message,
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID',
      message: 'Invalid resource ID format',
    });
  }

  if (err.message.includes('not found')) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: err.message,
    });
  }

  if (err.message.includes('rate limit')) {
    return res.status(429).json({
      success: false,
      error: 'Rate Limit Exceeded',
      message: err.message,
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.name || 'Server Error',
    message: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

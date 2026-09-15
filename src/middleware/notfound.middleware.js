// Matches any request that fell through every other registered route.
const notFoundMiddleware = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

export default notFoundMiddleware;

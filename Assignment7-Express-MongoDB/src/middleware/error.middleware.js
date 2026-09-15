import { toFriendlyError } from "../utils/mongo-error.js";

// Final safety net for any error a route handler didn't already translate.
const globalErrMiddleware = (err, req, res, next) => {
  console.error(err.stack);

  const friendly = toFriendlyError(err);
  const statusCode = friendly?.statusCode || err.statusCode || 500;
  const message = friendly?.message || err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "DEV" && { stack: err.stack }),
  });
};

export default globalErrMiddleware;

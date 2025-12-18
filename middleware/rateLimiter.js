const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // = 1 minute
  max: 10,                // max 10 requests per minute
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

module.exports = limiter;

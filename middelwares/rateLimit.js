const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: '429',
    message: 'Too many accounts created from this IP, please try again after an hour'
  }
});

module.exports = limiter;

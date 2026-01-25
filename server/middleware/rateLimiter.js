import rateLimit from "express-rate-limit";

export const sosRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 SOS requests per window
  message: { error: "Too many SOS requests. Please call emergency services directly." },
  standardHeaders: true,
  legacyHeaders: false,
});

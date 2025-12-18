require("dotenv").config();
const express = require("express");
const connectToDb = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const rateLimiter = require("./middleware/rateLimiter"); // ✅ added

const app = express();
const port = process.env.PORT;
const route = require("./route/indexRoute");

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//rate limiter
app.use(rateLimiter);

//database connection
connectToDb;

// routes
app.use("/api/v1", route);

//centralized error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

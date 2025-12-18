require("dotenv").config();
const express = require("express");
const connectToDb = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const port = process.env.PORT;
const route = require("./route/indexRoute");

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database
connectToDb;

// routes
app.use("/api/v1", route);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

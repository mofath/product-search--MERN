const express = require("express");
const path = require("path");
const  graphqlServer  = require("./graphql");


const app = express();
graphqlServer.applyMiddleware({ app });

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Handle cors
app.use((req, res, next) => {
  console.log(`NEW REQUEST ${req.ip}`);
  console.log(`${req.method} ${req.url}`);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/images", express.static(path.join(__dirname, "../images")));

/**
 * Override 404 error
 */
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

/**
 * Catch Error
 */
app.use((error, req, res, next) => {
  console.log("\x1b[33m%s\x1b[0m", "...ERROR CAUGHT...");
  res.status(error.status || 500);
  return res.json({ message: { msgBody: error.message, msgError: true } });
});

module.exports = app;
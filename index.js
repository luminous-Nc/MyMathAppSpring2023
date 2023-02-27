const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes");
require("./config/passport");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const path = require("path");
const port = process.env.PORT || 8080;


// Connect with the database you created on MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_CONNECTION)  
  .then(() => {
    console.log("connecting to mongodb");
  })
  .catch((e) => {
    console.log(e);
  });

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "client", "build")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Set routes
app.use("/auth", authRoutes);

// Setup for deployment on heroku
if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

// Run on local port 8080
app.listen(port, () => {
  console.log("running server on port 8080");
});
const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");

// dot config
dotenv.config();

// Connect Mongodb
connectDB();

// rest object
const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// test routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//Routes
const authRoute = require("./routes/authRoutes");
app.use("/api/v1/auth", authRoute);
//port
const PORT = process.env.PORT || 8080;
// listen
//listen
app.listen(PORT, () => {
  console.log(
    `Node Server Running In ${process.env.DEV_MODE} ModeOn Port http://localhost:${process.env.PORT}`
      .bgBlue.white
  );
});

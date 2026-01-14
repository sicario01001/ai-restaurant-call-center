// server/server.cjs
//
// Small Express server that exposes API routes for complaints, future menu endpoints,
// and later Twilio webhook endpoints.

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const complaintsRoute = require("./routes/complaintsRoute.js");

const app = express();
const PORT = process.env.PORT || 5174;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("AI Restaurant Call Center Server Running");
});

// Complaints API
app.use("/api/complaints", complaintsRoute);

app.listen(PORT, () => {
  console.log(`Server ready on port ${PORT}`);
});



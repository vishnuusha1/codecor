const express = require("express");
const bodyParser = require("body-parser");
const InitiateMongoServer = require("./config/db");
const dotenv=require('dotenv')
dotenv.config()

// Initiate Mongo Server
InitiateMongoServer();

const app = express();
app.use(bodyParser.json());

require('./model/user');

app.use(require('./route/auth'))

// PORT
const PORT = process.env.PORT

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});


app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
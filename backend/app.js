var express = require("express");
var http = require('http');
const bodyParser = require('body-parser');
var path = require("path");
var mongoose = require("mongoose");
var app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
      'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

// connect to mongodb
mongoose.connect('mongodb://root:Roos2110@ds161335.mlab.com:61335/chat_assignment',{ useNewUrlParser: true })
  .then(() => {
    console.log('Connected to Mongo database!');
  })
  .catch(err  => {
    console.error('App starting error:', err.stack);
  });

// *********** Include the Api routes ***********
const eventRoutes = require("./routes/events");

// *********** Connect to Mongo  ***********
console.log('Attempting to connect to mongoose');

// ******** Setup the Api routes ***********
app.use("/api/eventlog", eventRoutes);

module.exports = app;
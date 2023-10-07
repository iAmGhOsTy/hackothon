const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require('dotenv').config();
const path = require("path");

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.mongourl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
.then(() => {
  console.log('Connected to the database');
})
.catch((err) => {
  console.error('Error connecting to the database:', err);
});

const Schema1 = new mongoose.Schema({
  Name: String,
  Email: String, 
  Password: String
});

const login_path = path.join(__dirname);
console.log(login_path);
app.use(express.static(login_path));

const data = mongoose.model("data", Schema1);

// Serve the index.html file from the root route ("/") as the landing page
app.get("/", function(req, res) {
  res.sendFile("index.html");
});

app.post("/", function(req, res){
  const newData = new data({
    Name: req.body.name,
    Email: req.body.email,
    Password: req.body.password
  });
  newData.save()
  .then(() => {
    res.sendFile(__dirname + "/login/done.html");
  })
  .catch((err) => {
    console.error('Error saving data to the database:', err);
    res.status(500).send('Error saving data to the database');
  });
});

app.listen(process.env.port, function() {
  console.log(`Server is running on port ${process.env.port}`);
});

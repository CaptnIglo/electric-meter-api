var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { Pool } = require("pg");
const config = require("./config.js");

const pool = new Pool(config.db);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

//TODO: how to handle single updates (e.g. activate device)?
//TODO: how to update priority (whole list needs to be updated)
app.route("/api/devices/").get((req, res) => {
  pool.query("SELECT * from devices").then((devices) => {
    res.json(devices);
  });
});
app.route("api/device/:id").get().put();
app.route("api/data").get();

var listener = app.listen(3000, function () {
  console.log("Listening on port " + listener.address().port);
});

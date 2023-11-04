var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { Pool } = require("pg");
const config = require("./config.js");
const { Client } = require("pg")


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
//TODO: error handling 
app.route("/api/devices/").get(async (req, res) => {
  var devices = await pool.query('SELECT * from devices;');
  res.json({devices:devices.rows})
});

app.route("/api/device/:id").get(async (req, res) => {
  var device = await pool.query('SELECT * from devices where id= $1', [req.params.id]);
  if(device.rows.length){
    res.json({device: device.rows[0]});
  } else {
    res.status(404).json({message: "No device found with id: " + req.params.id});
  }
}).put(async (req, res) => {
  var {device_name, priority, consumption, active_management, active, flexible_consumption} = req.body;
  var updatedDevice = await pool.query("UPDATE devices SET device_name=$1, priority=$2, consumption=$3, active_management=$4, active=$5, flexible_consumption=$6  where id=$7",
   [device_name, priority, consumption, active_management, active, flexible_consumption, req.params.id]);
   res.json({device: updatedDevice});
   //TODO: update response
   //TODO: update only a few attributes - Reaserach question: should each endpoint only have a single purpose or be multifunctional?
   //TODO: no update occured
   //TODO: check if fields are not null
   //TODO: check field values
   //SOLUTION: create an object with constructure and getter + setter - call object from db; update fields of object - update object in DB using the object in nodes

}).patch(async (req, res) => {
  var {device_name, priority, consumption, active_management, active, flexible_consumption} = req.body || null;
  var updatedDevice = await pool.query("UPDATE devices SET device_name = COALESCE( $1, device_name), priority = COALESCE($2, priority)::int, consumption = COALESCE($3, consumption)::int, active_management = COALESCE($4, active_management)::boolean, active = COALESCE($5, active)::boolean, flexible_consumption = COALESCE($6, flexible_consumption)::boolean WHERE id=$7", 
  [device_name, priority, consumption, active_management, active, flexible_consumption, req.params.id]);
  res.json({device: updatedDevice});
  //TODO: update response
});


app.route("/api/data").get().post();

var listener = app.listen(3000, function () {
  console.log("Listening on port " + listener.address().port);
});

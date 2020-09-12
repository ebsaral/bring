require("dotenv").config();
var express = require("express"),
  bodyParser = require("body-parser"),
  { MongoClient } = require("mongodb"),
  app = express(),
  port = process.env.PORT || 5000,
  { getQuery, getResponse } = require("./utils"),
  { body, validationResult } = require("express-validator");

// Errors
const { BadRequest, NotFound, handleErrors } = require("./errors");

// Mongo DB init
const uri = process.env.MONGO_URL;
const client = new MongoClient(uri, {
  retryWrites: true,
  useUnifiedTopology: true,
});
let connection;

app.use(bodyParser.json());

const parameterValidator = [
  body("startDate").isDate(),
  body("endDate").isDate(),
  body("minCount").isNumeric(),
  body("maxCount").isNumeric(),
];

app.post("/", parameterValidator, async function (req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequest("Invalid parameter(s)");
    }
    const query = getQuery(req.body);
    const cursor = collection.aggregate(query);
    let elements = await cursor.toArray();
    res.json(getResponse(0, "Success", elements));
  } catch (err) {
    next(err);
  }
});

app.get("*", function (req, res) {
  throw new NotFound("Invalid endpoint");
});

app.post("*", function (req, res) {
  throw new NotFound("Invalid endpoint");
});

app.use(handleErrors);

async function run() {
  try {
    await client.connect();
    console.log("UIRRRL", process.env.MONGO_DB);
    collection = client
      .db(process.env.MONGO_DB)
      .collection(process.env.MONGO_COLLECTION);
    app.listen(port, function (err) {
      console.log("Running on " + port);
    });
  } catch (e) {
    console.log("Error ", e);
  }
}
run().catch(console.dir);

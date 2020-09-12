require("dotenv").config();
// Express 
var express = require("express")
var bodyParser = require("body-parser")
var app = express()
var port = process.env.PORT || 5000

const {
  getQuery,
  getResponse
} = require("./utils")

const {
  body,
  validationResult
} = require("express-validator")

// Errors
const {
  BadRequest,
  NotFound,
  handleErrors
} = require("./errors");

// Mongo DB init
const {
  MongoClient
} = require("mongodb")
const uri = process.env.MONGO_URL;
const client = new MongoClient(uri, {
  retryWrites: true,
  useUnifiedTopology: true,
});
var connection;

const parameterValidator = [
  body("startDate").isDate(),
  body("endDate").isDate(),
  body("minCount").isInt(),
  body("maxCount").isInt(),
];

app.use(bodyParser.json());

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

// Cover of rest of the URLs
app.get("*", function (req, res) {
  throw new NotFound("Invalid endpoint");
});

app.post("*", function (req, res) {
  throw new NotFound("Invalid endpoint");
});

// Error middleware
app.use(handleErrors);

// Wrapper of listener with the MongoEngine connection
async function run() {
  try {
    await client.connect();
    collection = client
      .db(process.env.MONGO_DB)
      .collection(process.env.MONGO_COLLECTION);
    app.listen(port, function (err) {
      if (err) {
        console.log(err)
      }
    });
  } catch (e) {
    console.log("Error ", e);
  }
}
run().catch(console.dir);

module.exports = app
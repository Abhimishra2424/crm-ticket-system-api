require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet())
app.use(cors());

// MongoDb connection setup
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

if (process.env.NODE_ENV !== "production") {
  const mDB = mongoose.connection;
  mDB.on("open", () => {
    console.log("MongoDB connected");
  });
  mDB.on("error", () => {
    console.log("MongoDB connected");
  });
  app.use(morgan("tiny"));
}

// load routers
const userRouter = require("./src/routers/userRouter");
const ticketRouter = require("./src/routers/ticketRouter");

// use routers
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);

// handler error
const errorHandler = require("./src/utils/errorHandler");
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use("*", (err, req, res, next) => {
  errorHandler(err, res);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

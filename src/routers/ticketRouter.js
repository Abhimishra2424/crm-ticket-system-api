const express = require("express");
const router = express.Router();

router.all("/", (req, res, next) => {
  // res.json({
  //   message: "return tciket"
  // });

  next();
});

// work flow
// 1. create url endpoint
// 2. receive new ticket date
// 3. Authorize every req with jwt
// 4. insert new ticket to db
// 5. return new ticket to client

router.post("/", (req, res) => {
  const { subject, sender, message } = req.body;

  // insert new ticket to db
  

  res.json({
    message: "return ticket",
  });
});

module.exports = router;

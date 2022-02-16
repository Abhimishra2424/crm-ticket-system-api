const express = require("express");
const { insertTicket } = require("../models/ticket/Ticketmodel");
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

router.post("/", async (req, res) => {
  try {
    const { subject, sender, message } = req.body;

    const ticketobj = {
      clientId: "620667b9d7f4343dc8d33fb1",
      subject,
      conversations: [
        {
          sender,
          message,
          msgAt: Date.now(),
        },
      ],
    };

    // insert new ticket to db
    const result = await insertTicket(ticketobj);
    if (result._id) {
      res.json({
        status: "success",
        message: "New ticket created",
        data: result,
      });
    }

    res.json({
      status: "error",
      message: "Failed to create new ticket",
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

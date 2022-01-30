const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "jerald.beahan34@ethereal.email",
    pass: "JJSDzQnq13WrPTtzxe",
  },
});
const send = (info) => {
  return new Promise(async (resolve, reject) => {
    try {
      // send mail with defined transport object
      let result = await transporter.sendMail(info);

      console.log("Message sent: %s", result.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));

      resolve(result);
    } catch (error) {
      console.log(error);
    }
  });
};

const emailProcessor = (email, pin) => {
  const info = {
    from: '"CRM👻" <jerald.beahan34@ethereal.email>', // sender address
    to: email, // list of receivers
    subject: "Password reset Pin", // Subject line
    text:
      "Here is your password reset pin " +
      pin +
      "This pin will expires in 1 day", // plain text body
    html: `<b>This is your password reset Pin?
      <b>${pin}</b>
    </b>`, // html body
  };

  send(info);
};

module.exports = {
  emailProcessor,
};

const nodemailer = require("nodemailer");
const config = require("config");

const sendEmail = (options) => {
  const transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
      user: "apikey",
      pass: "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",
    },
  });

  const mailOptions = {
    from: "ozdevecibanu@gmail.com",
    to: options.to,
    subject: options.subject,
    html: options.text,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = sendEmail;

// password: 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
// apKey: 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

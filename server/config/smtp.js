const nodemailer = require('nodemailer');

let transporter;
if (process.env.SMTP_URL) {
  transporter = nodemailer.createTransport(process.env.SMTP_URL);
} else {
  transporter = nodemailer.createTransport({
    streamTransport: true,
  });
}

function sendMail(options) {
  return transporter.sendMail(options).then((info) => {
    if (!process.env.SMTP_URL) {
      console.log('No SMTP_URL environment variable found for message delivery:');
      console.log(options);
    }
    return info;
  });
}
module.exports.sendMail = sendMail;

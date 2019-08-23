const nodemailer = require('nodemailer');

const sendMail = async options => {

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_TRAP_HOST,
    port: process.env.MAIL_TRAP_PORT,
    auth: {
      user: process.env.MAIL_TRAP_USER_NAME,
      pass: process.env.MAIL_TRAP_USER_PASS
    }
  });

  await transporter.sendMail({
    from: 'tours@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.message
  });

};

module.exports = sendMail;
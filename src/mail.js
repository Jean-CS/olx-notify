"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main(items) {
  const body = `<ul>${items.map(item => MailItem(item))}</ul>`;

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let account = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.DISPATCH_EMAIL || account.user, // generated ethereal user
      pass: process.env.DISPATCH_PASS || account.pass // generated ethereal password
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: process.env.MAIL_TO, // list of receivers
    subject: "New item(s) announce(d)! ☄️", // Subject line
    text: "New item(s) announce(d)!", // plain text body
    html: body // html body
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  if (process.env.NODE_ENV === "dev") {
    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }
}

const MailItem = ({ image, title, url, price, region, date }) => {
  let img = image ? `<img src=${image} alt=${title}/>` : "";
  let tit = `<h1><a href=${url}>${title}</a></h1>`;
  let prc = `<h2>${price}</h2>`;
  let reg = `<p>${region}</p>`;
  let dat = `<p>${date}</p>`;
  return `<li>${img}${tit}${prc}${reg}${dat}</li>`;
};

exports.send = items => main(items).catch(console.error);

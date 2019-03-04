"use strict";
const nodemailer = require("nodemailer");
require("dotenv").config();

// async..await is not allowed in global scope, must use a wrapper
async function main(items) {
  const body =
    "<ul>" +
    items.map(item => {
      return `<li><img src=${item.image} alt=${item.title}/><h1><a href=${
        item.url
      }>${item.title}</a></h1><h2>${item.price}</h2><p>${item.region}</p><p>${
        item.date
      }</p></li>`;
    }) +
    "</ul>";

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let account = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: account.user, // generated ethereal user
      pass: account.pass // generated ethereal password
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: process.env.MAIL_TO, // list of receivers
    subject: "Hello ☄️", // Subject line
    text: "New item(s) announce(d)!", // plain text body
    html: body // html body
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

exports.send = items => main(items).catch(console.error);

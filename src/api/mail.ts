import { Request, Response } from "express";
import { sendMail, mailSubject } from "../utils/utils";

import * as fs from "fs-extra";

const mailBody = require("../templates/email_body.html");

export async function handleEmail(doc) {
  console.log("Sending email");
  let message;
  try {
    const imageData = fs.readFileSync(doc.file.path).toString("base64");
    message = {
      from: `${process.env.MAIL_FROM}`,
      to:
        process.env.NODE_ENV === "development"
          ? `${process.env.DEV_EMAIL_TO}`
          : doc.email,
      subject: mailSubject,
      html: mailBody,
      attachments: [
        {
          filename: "avatar.png",
          content: imageData
        }
      ]
    };
    await sendMail(message);
    console.log(`Email sent successfully to  ${message.to}`);
  } catch (err) {
    console.log(
      `Error sending email to ${message.to}`,
      JSON.stringify(err.response.body)
    );
  }
}

// app.post(
//   "/api/testemail",
//   keycloak.protect(),
//   asyncHandler(async (req: Request, res: Response, next: any) => {
//     const message = req.body;
//     //console.log("Sending email :", message);
//     //console.log("Email Response:", emailRes);
//     await sendMail(message);
//     return res.status(200).send();
//   })
// );

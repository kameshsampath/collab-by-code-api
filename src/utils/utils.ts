import { transporter } from "../app";

export async function sendMail(message) {
  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log("Error sending email ", err);
      return;
    }
    console.log("Message sent: %s", info.messageId);
  });
}

export const mailSubject = "Collab by Code - Welcome to OpenSource";

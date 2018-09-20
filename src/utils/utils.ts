import sgMail from "@sendgrid/mail";

export const mailSubject = "Collab by Code - Welcome to OpenSource";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendMail(message) {
  if (process.env.NODE_ENV === "development") {
    message.to = process.env.DEV_EMAIL_TO;
  }
  return sgMail.send(message);
}

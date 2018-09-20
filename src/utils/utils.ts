import sgMail from "@sendgrid/mail";

export const mailSubject =
  process.env.MAIL_SUBJECT || "Your Collaborate by Code Photo";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendMail(message) {
  if (process.env.NODE_ENV === "development") {
    message.to = process.env.DEV_EMAIL_TO;
  }
  return sgMail.send(message);
}

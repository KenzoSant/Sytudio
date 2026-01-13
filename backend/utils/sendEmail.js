import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  await transporter.sendMail({
    from: `"Sytudio" <${process.env.EMAIL}>`,
    to,
    subject,
    html
  });
};

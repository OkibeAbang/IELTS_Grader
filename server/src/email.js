import nodemailer from "nodemailer";

/**
 * If SMTP_HOST is set, emails actually send via nodemailer. Otherwise they're
 * logged to the server console — no email account needed to develop or test
 * the verification/reset flows locally; set the SMTP_* env vars later to
 * switch a deployment over to real delivery without touching this call site.
 */
let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
  }
  return transporter;
}

async function sendEmail({ to, subject, text }) {
  if (!process.env.SMTP_HOST) {
    console.log(`\n[DEV EMAIL] To: ${to}\nSubject: ${subject}\n\n${text}\n`);
    return;
  }

  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM || "no-reply@ielts-grader.local",
    to,
    subject,
    text,
  });
}

function sendVerificationEmail(user, token) {
  const link = `${process.env.CLIENT_ORIGIN || "http://localhost:3000"}/verify-email?token=${token}`;
  return sendEmail({
    to: user.email,
    subject: "Verify your email",
    text: `Confirm your email address to unlock speaking practice grading:\n\n${link}\n\nThis link expires in 24 hours.`,
  });
}

function sendPasswordResetEmail(user, token) {
  const link = `${process.env.CLIENT_ORIGIN || "http://localhost:3000"}/reset-password?token=${token}`;
  return sendEmail({
    to: user.email,
    subject: "Reset your password",
    text: `Reset your password:\n\n${link}\n\nThis link expires in 1 hour. If you didn't request this, you can ignore this email.`,
  });
}

export { sendEmail, sendVerificationEmail, sendPasswordResetEmail };

/**
 * Outbound email (verification / password reset) via Resend's HTTPS API —
 * not SMTP. The SMTP version hung indefinitely in production (confirmed: a
 * real forgot-password request to the live Render deployment never
 * returned even after 90+ seconds), consistent with Render blocking
 * outbound SMTP ports to prevent abuse. HTTPS (port 443) isn't blocked by
 * any host, so this sidesteps the problem entirely rather than working
 * around it with timeouts/retries on a connection that was never going to
 * succeed.
 *
 * If RESEND_API_KEY is unset, emails log to the console instead — no
 * account needed to develop or test the verification/reset flows locally.
 */
const RESEND_API_URL = "https://api.resend.com/emails";

async function sendEmail({ to, subject, text }) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`\n[DEV EMAIL] To: ${to}\nSubject: ${subject}\n\n${text}\n`);
    return;
  }

  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "no-reply@9band.local",
      to,
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Resend API request failed (${res.status}): ${errBody}`);
  }
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

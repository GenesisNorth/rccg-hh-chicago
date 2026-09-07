import { sendEmail, createVerificationHtml, createPasswordResetHtml } from "./mail";

interface VerificationEmailProps {
  email: string;
  name: string;
  token: string;
}

interface PasswordResetEmailProps {
  email: string;
  name: string;
  token: string;
}

export async function sendVerificationEmail({ email, name, token }: VerificationEmailProps) {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;
  
  const html = createVerificationHtml(name, verificationLink);
  
  return sendEmail({
    to: email,
    subject: "Verify your email address",
    html,
  });
}

export async function sendPasswordResetEmail({ email, name, token }: PasswordResetEmailProps) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
  
  const html = createPasswordResetHtml(name, resetLink);
  
  return sendEmail({
    to: email,
    subject: "Reset your password",
    html,
  });
}

export async function sendWelcomeEmail({ email, name }: { email: string; name: string }) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Our Church!</h2>
      <p>Hello ${name || "there"},</p>
      <p>Thank you for joining our church community. We're excited to have you as part of our family!</p>
      <p>With your account, you can:</p>
      <ul>
        <li>Stay updated on church events and announcements</li>
        <li>Access sermons and devotionals</li>
        <li>Connect with other members</li>
        <li>Participate in our online community</li>
      </ul>
      <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
      <p>Blessings,<br>Your Church Team</p>
    </div>
  `;
  
  return sendEmail({
    to: email,
    subject: "Welcome to Our Church!",
    html,
  });
}

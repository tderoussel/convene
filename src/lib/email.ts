import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = "Alyned <noreply@alyned.app>";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!resend) {
    console.log("[email] Resend not configured — skipping email to", to);
    return null;
  }

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("[email] Failed to send:", error);
    return null;
  }

  return data;
}

// ── Email templates ──

export function welcomeEmail(name: string) {
  return {
    subject: "Welcome to Alyned",
    html: `
      <div style="font-family: Inter, system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #fafafa; background: #09090B;">
        <div style="margin-bottom: 32px;">
          <div style="width: 32px; height: 32px; background: #DC2626; border-radius: 7px; display: inline-flex; align-items: center; justify-content: center;">
            <span style="color: white; font-weight: bold; font-size: 16px;">A</span>
          </div>
        </div>
        <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 12px; color: #fafafa;">Welcome, ${name}.</h1>
        <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 24px;">
          Your application to Alyned has been accepted. You now have access to our community of founders, builders, and investors.
        </p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://alyned.app"}/dashboard" style="display: inline-block; padding: 10px 24px; background: #DC2626; color: white; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
          Enter Alyned
        </a>
        <p style="font-size: 12px; color: #71717a; margin-top: 32px;">
          If you didn't apply to Alyned, you can ignore this email.
        </p>
      </div>
    `,
  };
}

export function applicationReceivedEmail(name: string) {
  return {
    subject: "Application received — Alyned",
    html: `
      <div style="font-family: Inter, system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #fafafa; background: #09090B;">
        <div style="margin-bottom: 32px;">
          <div style="width: 32px; height: 32px; background: #DC2626; border-radius: 7px; display: inline-flex; align-items: center; justify-content: center;">
            <span style="color: white; font-weight: bold; font-size: 16px;">A</span>
          </div>
        </div>
        <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 12px; color: #fafafa;">Thanks, ${name}.</h1>
        <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 16px;">
          We've received your application to Alyned. Our team reviews every application personally — you'll hear back within 48 hours.
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0;">
          In the meantime, make sure your LinkedIn profile is up to date. It helps us learn more about you.
        </p>
        <p style="font-size: 12px; color: #71717a; margin-top: 32px;">
          Alyned — Where ambitious builders connect.
        </p>
      </div>
    `,
  };
}

export function tierUpgradeEmail(name: string, newTier: string) {
  return {
    subject: `You've reached ${newTier} tier — Alyned`,
    html: `
      <div style="font-family: Inter, system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #fafafa; background: #09090B;">
        <div style="margin-bottom: 32px;">
          <div style="width: 32px; height: 32px; background: #DC2626; border-radius: 7px; display: inline-flex; align-items: center; justify-content: center;">
            <span style="color: white; font-weight: bold; font-size: 16px;">A</span>
          </div>
        </div>
        <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 12px; color: #fafafa;">Congrats, ${name}!</h1>
        <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 24px;">
          You've been promoted to <strong style="color: #fafafa;">${newTier}</strong> tier. This unlocks new rooms and features based on your contributions to the community.
        </p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://alyned.app"}/dashboard" style="display: inline-block; padding: 10px 24px; background: #DC2626; color: white; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
          View your profile
        </a>
      </div>
    `,
  };
}

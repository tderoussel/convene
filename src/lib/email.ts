import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = "Alyned <noreply@alyned.app>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alyned.app";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export type EmailType =
  | "welcome"
  | "application_received"
  | "application_accepted"
  | "application_rejected"
  | "application_waitlisted"
  | "tier_upgrade"
  | "mutual_connection"
  | "onboarding_day2"
  | "onboarding_day7";

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

// ── Shared template wrapper ──

function emailWrapper(content: string): string {
  return `
    <div style="font-family: Inter, system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #fafafa; background: #09090B;">
      <div style="margin-bottom: 32px;">
        <div style="width: 32px; height: 32px; background: #DC2626; border-radius: 7px; display: inline-flex; align-items: center; justify-content: center;">
          <span style="color: white; font-weight: bold; font-size: 16px;">A</span>
        </div>
      </div>
      ${content}
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06);">
        <p style="font-size: 11px; color: #52525b; margin: 0;">
          Alyned — Where ambitious builders connect.<br/>
          <a href="${SITE_URL}/privacy" style="color: #52525b; text-decoration: underline;">Privacy</a> &middot;
          <a href="${SITE_URL}/terms" style="color: #52525b; text-decoration: underline;">Terms</a>
        </p>
      </div>
    </div>
  `;
}

function ctaButton(text: string, href: string): string {
  return `<a href="${href}" style="display: inline-block; padding: 10px 24px; background: #DC2626; color: white; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">${text}</a>`;
}

// ── Email templates ──

export function welcomeEmail(name: string) {
  return {
    subject: "Welcome to Alyned",
    html: emailWrapper(`
      <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 12px; color: #fafafa;">Welcome, ${name}.</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 24px;">
        Your application to Alyned has been accepted. You now have access to our community of founders, builders, and investors.
      </p>
      ${ctaButton("Enter Alyned", `${SITE_URL}/dashboard`)}
      <p style="font-size: 12px; color: #71717a; margin-top: 32px;">
        If you didn't apply to Alyned, you can ignore this email.
      </p>
    `),
  };
}

export function applicationReceivedEmail(name: string) {
  return {
    subject: "Application received — Alyned",
    html: emailWrapper(`
      <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 12px; color: #fafafa;">Thanks, ${name}.</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 16px;">
        We've received your application to Alyned. Our team reviews every application personally — you'll hear back within 48 hours.
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0;">
        In the meantime, make sure your LinkedIn profile is up to date. It helps us learn more about you.
      </p>
    `),
  };
}

export function applicationAcceptedEmail(name: string) {
  return {
    subject: "You're in — welcome to Alyned",
    html: emailWrapper(`
      <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 12px; color: #fafafa;">Welcome aboard, ${name}.</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 16px;">
        Your application has been accepted. You're now part of a curated community of founders, builders, and investors who are serious about building.
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 16px;">
        <strong style="color: #fafafa;">Here's how to get started:</strong>
      </p>
      <ol style="font-size: 14px; line-height: 1.8; color: #a1a1aa; margin: 0 0 24px; padding-left: 20px;">
        <li>Complete your profile — a great profile gets more connections</li>
        <li>Join a few rooms that match your interests</li>
        <li>Check your daily member feed for curated matches</li>
      </ol>
      ${ctaButton("Get Started", `${SITE_URL}/login`)}
    `),
  };
}

export function applicationRejectedEmail(name: string) {
  return {
    subject: "Update on your Alyned application",
    html: emailWrapper(`
      <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 12px; color: #fafafa;">Hi ${name},</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 16px;">
        Thank you for your interest in Alyned. After careful review, we've decided not to move forward with your application at this time.
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 16px;">
        This isn't a reflection of your work or potential — we receive many strong applications and have limited capacity to ensure every member gets real value from the community.
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 16px;">
        We encourage you to reapply in 90 days. In the meantime, keep building — that's what matters most.
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0;">
        Wishing you the best,<br/>
        <span style="color: #fafafa;">The Alyned Team</span>
      </p>
    `),
  };
}

export function applicationWaitlistedEmail(name: string) {
  return {
    subject: "You're on the waitlist — Alyned",
    html: emailWrapper(`
      <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 12px; color: #fafafa;">Hi ${name},</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 16px;">
        Thanks for applying to Alyned. We were impressed by your application and have placed you on our waitlist.
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 16px;">
        We accept new members in waves to maintain community quality. You'll be among the first considered when the next cohort opens — typically within 2-4 weeks.
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0;">
        We'll email you as soon as a spot opens up. No action needed on your end.
      </p>
    `),
  };
}

export function tierUpgradeEmail(name: string, newTier: string) {
  const tierPrivileges: Record<string, string[]> = {
    Builder: [
      "Create and moderate your own rooms",
      "Send up to 15 DMs per day",
      "Access Builder-tier exclusive rooms",
    ],
    Catalyst: [
      "Unlimited direct messages",
      "Access all rooms including Catalyst Lounge",
      "Priority visibility in the member feed",
      "Ability to elevate other members",
    ],
  };

  const privileges = tierPrivileges[newTier] ?? [];

  return {
    subject: `You've reached ${newTier} tier — Alyned`,
    html: emailWrapper(`
      <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 12px; color: #fafafa;">Congrats, ${name}!</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 16px;">
        You've been promoted to <strong style="color: #fafafa;">${newTier}</strong> tier based on your contributions to the community.
      </p>
      ${privileges.length > 0 ? `
        <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 8px;">
          <strong style="color: #fafafa;">What you've unlocked:</strong>
        </p>
        <ul style="font-size: 14px; line-height: 1.8; color: #a1a1aa; margin: 0 0 24px; padding-left: 20px;">
          ${privileges.map((p) => `<li>${p}</li>`).join("")}
        </ul>
      ` : ""}
      ${ctaButton("View your profile", `${SITE_URL}/dashboard/profile`)}
    `),
  };
}

export function mutualConnectionEmail(name: string, otherName: string) {
  return {
    subject: `You and ${otherName} are now connected — Alyned`,
    html: emailWrapper(`
      <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 12px; color: #fafafa;">New connection!</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 24px;">
        ${name}, you and <strong style="color: #fafafa;">${otherName}</strong> have both bookmarked each other. You're now connected and can message directly.
      </p>
      ${ctaButton("Send a message", `${SITE_URL}/dashboard/messages`)}
    `),
  };
}

export function onboardingDay2Email(name: string) {
  return {
    subject: "3 ways to get value from Alyned this week",
    html: emailWrapper(`
      <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 12px; color: #fafafa;">Hey ${name},</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 16px;">
        You've been in Alyned for a couple of days. Here are three things members find most valuable in their first week:
      </p>
      <ol style="font-size: 14px; line-height: 1.8; color: #a1a1aa; margin: 0 0 24px; padding-left: 20px;">
        <li><strong style="color: #fafafa;">Post in a room</strong> — introduce yourself and share what you're building. The best conversations start with specifics.</li>
        <li><strong style="color: #fafafa;">Browse the member directory</strong> — bookmark people you'd want to meet. When the feeling is mutual, you'll both get notified.</li>
        <li><strong style="color: #fafafa;">Complete your profile</strong> — members with complete profiles get 3x more connection requests.</li>
      </ol>
      ${ctaButton("Open Alyned", `${SITE_URL}/dashboard`)}
    `),
  };
}

export function onboardingDay7Email(name: string) {
  return {
    subject: "How's your first week going?",
    html: emailWrapper(`
      <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 12px; color: #fafafa;">One week in, ${name}.</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 16px;">
        You've been part of Alyned for a week now. We hope you've started making connections that matter.
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 16px;">
        A few things to know as you settle in:
      </p>
      <ul style="font-size: 14px; line-height: 1.8; color: #a1a1aa; margin: 0 0 16px; padding-left: 20px;">
        <li>Your reputation score grows as you contribute — post in rooms, respond to requests, and connect with others</li>
        <li>Reaching <strong style="color: #fafafa;">100 reputation</strong> unlocks Builder tier with new privileges</li>
        <li>The community is most active Tuesday through Thursday</li>
      </ul>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 24px;">
        If something feels off or you have feedback, reply to this email — a real person reads every response.
      </p>
      ${ctaButton("Jump back in", `${SITE_URL}/dashboard`)}
    `),
  };
}

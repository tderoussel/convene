import { NextRequest, NextResponse } from "next/server";
import {
  sendEmail,
  welcomeEmail,
  applicationReceivedEmail,
  applicationAcceptedEmail,
  applicationRejectedEmail,
  applicationWaitlistedEmail,
  tierUpgradeEmail,
  mutualConnectionEmail,
  onboardingDay2Email,
  onboardingDay7Email,
} from "@/lib/email";
import type { EmailType } from "@/lib/email";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { type, to, name, tier, otherName } = body as {
    type: EmailType;
    to: string;
    name: string;
    tier?: string;
    otherName?: string;
  };

  let email: { subject: string; html: string };

  switch (type) {
    case "welcome":
      email = welcomeEmail(name);
      break;
    case "application_received":
      email = applicationReceivedEmail(name);
      break;
    case "application_accepted":
      email = applicationAcceptedEmail(name);
      break;
    case "application_rejected":
      email = applicationRejectedEmail(name);
      break;
    case "application_waitlisted":
      email = applicationWaitlistedEmail(name);
      break;
    case "tier_upgrade":
      email = tierUpgradeEmail(name, tier ?? "Builder");
      break;
    case "mutual_connection":
      email = mutualConnectionEmail(name, otherName ?? "Someone");
      break;
    case "onboarding_day2":
      email = onboardingDay2Email(name);
      break;
    case "onboarding_day7":
      email = onboardingDay7Email(name);
      break;
    default:
      return NextResponse.json({ error: "Unknown email type" }, { status: 400 });
  }

  const result = await sendEmail({ to, ...email });

  if (!result) {
    return NextResponse.json(
      { error: "Failed to send email (check RESEND_API_KEY)" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, id: result.id });
}

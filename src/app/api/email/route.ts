import { NextRequest, NextResponse } from "next/server";
import {
  sendEmail,
  welcomeEmail,
  applicationReceivedEmail,
  tierUpgradeEmail,
} from "@/lib/email";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Only allow calls from server-side (Supabase Edge Functions or internal)
  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { type, to, name, tier } = body as {
    type: "welcome" | "application_received" | "tier_upgrade";
    to: string;
    name: string;
    tier?: string;
  };

  let email: { subject: string; html: string };

  switch (type) {
    case "welcome":
      email = welcomeEmail(name);
      break;
    case "application_received":
      email = applicationReceivedEmail(name);
      break;
    case "tier_upgrade":
      email = tierUpgradeEmail(name, tier ?? "Builder");
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

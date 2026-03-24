import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  category:   z.enum(["CRYPTO", "MARKETS", "GEOPOLITICS", "MACRO", "OTHER"]),
  sourceType: z.enum(["INSIDER", "WHISTLEBLOWER", "MARKET_OBSERVATION", "TECHNICAL", "ANONYMOUS"]),
  urgency:    z.enum(["BREAKING", "DEVELOPING", "ANALYSIS"]),
  message:    z.string().min(20, "Too short — give us more signal").max(5000),
  contact:    z.string().max(200).optional(),
});

export type SubmitLeakPayload = z.infer<typeof schema>;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 422 }
    );
  }

  const { category, sourceType, urgency, message, contact } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.LEAK_EMAIL ?? process.env.RESEND_FROM_EMAIL;

  if (apiKey && toEmail) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: "NewsCoin Leaks <leaks@newscoin.app>",
        to: toEmail,
        subject: `[${urgency}] ${category} LEAK — ${sourceType}`,
        html: `
          <div style="font-family:monospace;background:#0a0a0a;color:#e0e0e0;padding:24px;border-radius:4px">
            <h2 style="color:#5cff5c;letter-spacing:0.1em;margin:0 0 16px">[${urgency}] ${category} LEAK</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
              <tr><td style="color:#888;padding:4px 0;width:140px">SOURCE TYPE</td><td style="color:#fff">${sourceType}</td></tr>
              <tr><td style="color:#888;padding:4px 0">URGENCY</td><td style="color:#fff">${urgency}</td></tr>
              <tr><td style="color:#888;padding:4px 0">CONTACT</td><td style="color:#fff">${contact || "ANONYMOUS"}</td></tr>
              <tr><td style="color:#888;padding:4px 0">RECEIVED</td><td style="color:#fff">${new Date().toISOString()}</td></tr>
            </table>
            <div style="border:1px solid #333;padding:16px;background:#111;white-space:pre-wrap;line-height:1.6">
${message}
            </div>
          </div>
        `,
      });
    } catch (err) {
      console.error("Resend error:", err);
      // Still return success — don't expose email errors to user
    }
  }

  // Always return success (prevent enumeration / info leaks)
  return NextResponse.json({ ok: true });
}

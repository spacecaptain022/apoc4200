import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { addLeak } from "@/lib/leaks-store";

const ALLOWED_TYPES = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf",
]);
const MAX_FILE_BYTES  = 8 * 1024 * 1024; // 8 MB per file
const MAX_FILES       = 5;

const textSchema = z.object({
  category:   z.enum(["CRYPTO", "MARKETS", "GEOPOLITICS", "MACRO", "OTHER"]),
  sourceType: z.enum(["INSIDER", "WHISTLEBLOWER", "MARKET_OBSERVATION", "TECHNICAL", "ANONYMOUS"]),
  urgency:    z.enum(["BREAKING", "DEVELOPING", "ANALYSIS"]),
  message:    z.string().min(20, "Too short — give us more signal").max(5000),
  contact:    z.string().max(200).optional(),
});

export type SubmitLeakPayload = z.infer<typeof textSchema>;

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // ── Validate text fields ──────────────────────────────────────────────────
  const raw = {
    category:   formData.get("category"),
    sourceType: formData.get("sourceType"),
    urgency:    formData.get("urgency"),
    message:    formData.get("message"),
    contact:    formData.get("contact") || undefined,
  };

  const parsed = textSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 422 }
    );
  }

  const { category, sourceType, urgency, message, contact } = parsed.data;

  // ── Collect attachments ───────────────────────────────────────────────────
  type Attachment = { filename: string; content: Buffer; contentType: string };
  const attachments: Attachment[] = [];

  const fileEntries = formData.getAll("photos") as File[];
  const files = fileEntries.filter((f) => f instanceof File && f.size > 0);

  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { error: `Maximum ${MAX_FILES} files allowed` },
      { status: 422 }
    );
  }

  for (const file of files) {
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `File type not allowed: ${file.name}` },
        { status: 422 }
      );
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: `File too large (max 8 MB): ${file.name}` },
        { status: 422 }
      );
    }
    const buf = Buffer.from(await file.arrayBuffer());
    attachments.push({ filename: file.name, content: buf, contentType: file.type });
  }

  // ── Send via Resend ───────────────────────────────────────────────────────
  const apiKey  = process.env.RESEND_API_KEY;
  const toEmail = process.env.LEAK_EMAIL ?? process.env.RESEND_FROM_EMAIL;

  if (apiKey && toEmail) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from:        "NewsCoin Leaks <leaks@newscoin.app>",
        to:          toEmail,
        subject:     `[${urgency}] ${category} LEAK — ${sourceType}`,
        attachments: attachments.map((a) => ({
          filename:    a.filename,
          content:     a.content,
        })),
        html: `
          <div style="font-family:monospace;background:#0a0a0a;color:#e0e0e0;padding:24px;border-radius:4px">
            <h2 style="color:#5cff5c;letter-spacing:0.1em;margin:0 0 16px">[${urgency}] ${category} LEAK</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
              <tr><td style="color:#888;padding:4px 0;width:140px">SOURCE TYPE</td><td style="color:#fff">${sourceType}</td></tr>
              <tr><td style="color:#888;padding:4px 0">URGENCY</td><td style="color:#fff">${urgency}</td></tr>
              <tr><td style="color:#888;padding:4px 0">CONTACT</td><td style="color:#fff">${contact || "ANONYMOUS"}</td></tr>
              <tr><td style="color:#888;padding:4px 0">ATTACHMENTS</td><td style="color:#fff">${attachments.length > 0 ? attachments.map((a) => a.filename).join(", ") : "None"}</td></tr>
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
    }
  }

  // ── Save to public leaks board ────────────────────────────────────────────
  const leak = addLeak({
    category,
    sourceType,
    urgency,
    preview:     message.slice(0, 300),
    hasEvidence: attachments.length > 0,
  });

  return NextResponse.json({ ok: true, refId: leak.refId });
}

import { NextResponse } from "next/server";
import { getLeaks } from "@/lib/leaks-store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ leaks: getLeaks(), ts: Date.now() });
}

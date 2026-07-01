import { NextRequest, NextResponse } from "next/server";
import { appendPitchRow } from "@/lib/sheets";
import { buildSheetRow, PitchFormData, REQUIRED_FIELDS } from "@/lib/pitch";

export async function POST(req: NextRequest) {
  let data: PitchFormData;

  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const missing = REQUIRED_FIELDS.filter((field) => {
    const value = data[field];
    return value === undefined || value === null || String(value).trim() === "";
  });

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const row = buildSheetRow(data);
    await appendPitchRow(row);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Failed to append pitch row to Google Sheet:", err);
    return NextResponse.json(
      { error: "Something went wrong saving your pitch. Please try again." },
      { status: 500 }
    );
  }
}

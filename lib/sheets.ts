export async function appendPitchRow(row: (string | number)[]) {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  const secret = process.env.GOOGLE_APPS_SCRIPT_SECRET;

  if (!url || !secret) {
    throw new Error(
      "GOOGLE_APPS_SCRIPT_URL / GOOGLE_APPS_SCRIPT_SECRET are not configured."
    );
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, row }),
  });

  const body = (await res.json().catch(() => null)) as
    | { ok: boolean; error?: string }
    | null;

  if (!res.ok || !body?.ok) {
    throw new Error(
      body?.error ?? `Apps Script request failed with status ${res.status}`
    );
  }
}

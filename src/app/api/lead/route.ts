import { NextResponse } from "next/server";

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
    }

    const webhookUrl = process.env.INTAKE_WEBHOOK;
    if (!webhookUrl) {
      return NextResponse.json({ ok: false, error: "Missing INTAKE_WEBHOOK" }, { status: 500 });
    }

    const forwarded = {
      ts: new Date().toISOString(),
      source: "contractorai.site",
      event: "website_lead",
      ...body,
    } as Record<string, unknown>;

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(forwarded),
      // Ensure we don't hang the route on slow downstream
      // @ts-ignore - Next.js runtime supports AbortSignal in fetch
      signal: AbortSignal.timeout?.(15000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { ok: false, error: "Downstream error", detail: text?.slice(0, 500) },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}



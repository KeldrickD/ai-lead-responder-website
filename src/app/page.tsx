"use client";

import React, { useState } from "react";

// Read from env where possible; fall back to sensible defaults for local dev
const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ??
  "https://calendly.com/your-handle/ai-lead-responder-demo";

// Use an internal API route to avoid CORS and hide secrets
const INTAKE_ENDPOINT = "/api/lead";

export default function AILeadResponder() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");

  function trackEvent(name: string, params?: Record<string, unknown>) {
    // GA4
    try {
      (window as any).gtag?.("event", name, params || {});
    } catch {}
    // Meta Pixel
    try {
      (window as any).fbq?.("trackCustom", name, params || {});
    } catch {}
  }

  async function submitLead(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setOk(false);

    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch(INTAKE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "aileadresponder.co",
          event: "website_lead",
          ts: new Date().toISOString(),
          ...payload,
        }),
      });
      if (!res.ok) throw new Error("Webhook error");
      setOk(true);
      (e.target as HTMLFormElement).reset();
      trackEvent("lead_submit", { method: "form", source: "aileadresponder.co" });
    } catch (e) {
      console.error(e);
      setErr("Something went wrong. Try again or book a demo below.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* NAV */}
      <header className="sticky top-0 z-50 bg-neutral-950/70 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-400" />
            <span className="font-semibold">AI Lead Responder</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
            <a href="#how" className="hover:text-white">How it works</a>
            <a href="#industries" className="hover:text-white">Industries</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
          </nav>
          <a href="#book" onClick={() => trackEvent("book_demo", { placement: "nav" })} className="inline-flex items-center rounded-xl bg-white text-neutral-900 px-4 py-2 text-sm font-semibold hover:bg-white/90">Book Demo</a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(56,189,248,0.25)_0%,rgba(0,0,0,0)_60%)]" />
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Instant Lead Response. More Appointments. Less Work.
            </h1>
            <p className="mt-4 text-white/80 text-lg">
              AI Lead Responder replies to new leads in <span className="font-semibold text-white">under 2 minutes</span>, books estimates automatically, and follows up on old quotes — while you’re on the job.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="#book" onClick={() => trackEvent("book_demo", { placement: "hero" })} className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-5 py-3 font-semibold hover:bg-indigo-400">See 10‑min demo</a>
              <a href="#contact" className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 font-semibold hover:bg-white/5">Get pricing</a>
            </div>
            <p className="mt-4 text-xs text-white/60">Works with your website forms, Google/FB leads, and most CRMs (Jobber, Housecall Pro, ServiceTitan, GHL, Sheets).</p>
          </div>
          <div className="relative rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl">
            {/* Dashboard mockup placeholder */}
            <div className="aspect-video w-full rounded-xl bg-black/30 p-4">
              <div className="h-full w-full grid grid-cols-5 gap-3">
                <div className="col-span-3 space-y-3">
                  <div className="h-8 w-2/3 rounded bg-white/10" />
                  <div className="h-24 rounded bg-white/10" />
                  <div className="h-24 rounded bg-white/10" />
                  <div className="h-24 rounded bg-white/10" />
                </div>
                <div className="col-span-2 space-y-3">
                  <div className="h-8 w-1/2 rounded bg-white/10" />
                  <div className="h-40 rounded bg-white/10" />
                  <div className="h-20 rounded bg-white/10" />
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
              <div className="rounded-lg border border-white/10 p-3"><div className="text-2xl font-bold">2m</div><div className="text-white/70">Avg. reply</div></div>
              <div className="rounded-lg border border-white/10 p-3"><div className="text-2xl font-bold">+32%</div><div className="text-white/70">More booked jobs</div></div>
              <div className="rounded-lg border border-white/10 p-3"><div className="text-2xl font-bold">24/7</div><div className="text-white/70">Always on</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold">How it works</h2>
        <div className="mt-8 grid md:grid-cols-4 gap-6">
          {[{
            title: "Capture",
            desc: "Lead comes in from your website, Google Ads, FB Lead Form, or phone message.",
          },{
            title: "Instant Reply",
            desc: "AI texts back within 2 minutes, asks 1–2 smart questions, and offers to book.",
          },{
            title: "Auto‑Booking",
            desc: "Qualified leads get your calendar link — estimates and service windows are booked automatically.",
          },{
            title: "Follow‑Up",
            desc: "Old quotes re‑engaged; no‑shows and reschedules handled without manual chasing.",
          }].map((i) => (
            <div key={i.title} className="rounded-2xl border border-white/10 p-6 bg-white/5">
              <h3 className="font-semibold text-lg">{i.title}</h3>
              <p className="mt-2 text-white/80 text-sm">{i.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INDUSTRIES */}
      <section id="industries" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold">Built for real trades</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[{
            k: "HVAC",
            bullets: [
              "After‑hours reply + next‑day scheduling",
              "Emergency service triage",
              "Maintenance plan upsell prompts",
            ],
          },{
            k: "Roofing",
            bullets: [
              "Hail/wind damage intent detection",
              "Photo request + estimate booking",
              "Insurance claim follow‑ups",
            ],
          },{
            k: "Plumbing",
            bullets: [
              "Urgency routing (leak/backup)",
              "Same‑day window offers",
              "Quote + parts follow‑ups",
            ],
          },{
            k: "Solar",
            bullets: [
              "Utility bill capture",
              "Roof suitability questions",
              "Site survey scheduling",
            ],
          },{
            k: "Remodeling/Painting",
            bullets: [
              "Budget & timeline qualification",
              "Photo upload requests",
              "Estimate + design consult booking",
            ],
          },{
            k: "Lawn/Pest",
            bullets: [
              "Service area screening",
              "Recurring plan upsells",
              "Seasonal reminders",
            ],
          }].map((i) => (
            <div key={i.k} className="rounded-2xl border border-white/10 p-6 bg-white/5">
              <h3 className="font-semibold text-lg">{i.k}</h3>
              <ul className="mt-3 space-y-2 text-white/80 text-sm list-disc list-inside">
                {i.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* RESULTS */}
      <section id="results" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold">What companies see</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            {k: "+7", t: "extra booked jobs in week 1"},
            {k: "-70%", t: "manual chasing and no‑shows"},
            {k: "+3x", t: "faster speed‑to‑lead vs manual"},
          ].map((m) => (
            <div key={m.t} className="rounded-2xl border border-white/10 p-6 bg-white/5 text-center">
              <div className="text-4xl font-bold">{m.k}</div>
              <div className="text-white/70 mt-2">{m.t}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold">Simple pricing</h2>
        <p className="mt-2 text-white/70">One booked job often pays for setup.</p>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            {name: "Starter", price: "$1,000 setup", items: ["Instant lead reply","Calendar booking","No CRM required","Weekly summary email"]},
            {name: "Pro", price: "$2,000 setup", items: ["All in Starter","CRM integration (Jobber/HCP/GHL)","Quote follow‑ups","No‑show/reschedule flows"]},
            {name: "Elite", price: "$3,000 setup", items: ["All in Pro","Team routing + round robin","Custom dashboards","Priority support"]},
          ].map((p) => (
            <div key={p.name} className="rounded-2xl border border-white/10 p-6 bg-white/5">
              <h3 className="font-semibold text-xl">{p.name}</h3>
              <div className="mt-2 text-3xl font-bold">{p.price}</div>
              <ul className="mt-4 space-y-2 text-white/80 text-sm list-disc list-inside">
                {p.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
              <a href="#book" onClick={() => trackEvent("book_demo", { placement: "pricing", plan: p.name })} className="mt-6 inline-flex w-full justify-center rounded-xl bg-indigo-500 px-5 py-3 font-semibold hover:bg-indigo-400">Book Demo</a>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT + INTAKE FORM */}
      <section id="contact" className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-3xl font-bold">Get pricing & a 10‑minute demo</h2>
            <p className="mt-2 text-white/80">Tell us your trade and lead volume. We’ll show you how the assistant plugs into your current setup.</p>
            <form onSubmit={submitLead} className="mt-6 grid grid-cols-1 gap-4">
              <input name="name" required placeholder="Full name" className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" />
              <input name="email" required type="email" placeholder="Email" className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" />
              <input name="phone" required placeholder="Mobile number" className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" />
              <select name="trade" className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <option value="">Select your trade</option>
                <option>HVAC</option>
                <option>Roofing</option>
                <option>Plumbing</option>
                <option>Solar</option>
                <option>Remodeling/Painting</option>
                <option>Lawn/Pest</option>
                <option>Other</option>
              </select>
              <input name="city" placeholder="City / Service area" className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" />
              <select name="crm" className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <option value="">CRM (optional)</option>
                <option>Jobber</option>
                <option>Housecall Pro</option>
                <option>ServiceTitan</option>
                <option>GoHighLevel</option>
                <option>Google Sheets</option>
                <option>Other / None</option>
              </select>
              <textarea name="notes" rows={4} placeholder="How are you following up with leads today?" className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" />
              <input type="hidden" name="utm_source" value="website" />
              <input type="hidden" name="utm_campaign" value="aileadresponder_launch" />
              <button disabled={loading} className="rounded-xl bg-white text-neutral-900 px-5 py-3 font-semibold hover:bg-white/90 disabled:opacity-60">
                {loading ? "Sending…" : "Request Demo"}
              </button>
              {ok && <p className="text-emerald-400 text-sm">Thanks! We’ll be in touch shortly.</p>}
              {err && <p className="text-rose-400 text-sm">{err}</p>}
            </form>
          </div>

          {/* Calendly */}
          <div id="book" className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="font-semibold text-lg mb-3">Book a 10‑minute walkthrough</h3>
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black/30 grid place-items-center">
              <iframe src={CALENDLY_URL} className="w-full h-full" title="Calendar Booking" />
            </div>
            <p className="text-white/60 text-xs mt-3">Prefer SMS? Text "DEMO" to 7707444228 and we’ll send a link.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold">FAQ</h2>
        <div className="mt-6 divide-y divide-white/10">
          {[{
            q: "Do I need a CRM?",
            a: "No — we can run on Google Sheets or connect to Jobber, Housecall Pro, ServiceTitan, or GHL."},
            {q: "Who sends the texts?",
            a: "You’ll get a dedicated business number via compliant providers (e.g., Twilio, LeadConnector). Messages can come from your account or ours."},
            {q: "How fast is setup?",
            a: "Typical launch is 2–3 business days after onboarding. Many go live within 48 hours."},
            {q: "What about after‑hours?",
            a: "We use quiet hours and emergency routing. Lead gets a friendly message and a morning booking link; urgent issues can trigger an on‑call alert."},
          ].map((f) => (
            <details key={f.q} className="py-4">
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="mt-2 text-white/80 text-sm">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-white/60 flex flex-col sm:flex-row justify-between gap-3">
          <span>© {new Date().getFullYear()} AI Lead Responder — All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}


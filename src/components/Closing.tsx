import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { useReveal } from "../lib/core";
import {
  IconArrowRight,
  IconLinkedIn,
  IconX,
  IconYouTube,
  LogoMark,
} from "./icons";

/* -------------------------------- FAQ -------------------------------- */

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "What is a QR code?",
    a: "A Quick Response code is a machine-readable optical label that encodes URLs, text, contact cards, WiFi credentials and more. Both iOS and Android cameras decode them natively — no app needed — which makes QR the fastest bridge between print and digital.",
  },
  {
    q: "How do I make a QR code here?",
    a: (
      <>
        Four steps: <strong>1)</strong> paste your link or content in the workbench,{" "}
        <strong>2)</strong> flip on <em>Make dynamic</em> if you want analytics and editing,{" "}
        <strong>3)</strong> design it — colors, shapes, logo, sticker — and <strong>4)</strong>{" "}
        download the PNG or SVG, print, distribute.
      </>
    ),
  },
  {
    q: "What's the difference between static and dynamic QR codes?",
    a: "Static codes encode the payload directly — fast and free forever, but fixed once printed. Dynamic codes encode a short link that redirects to your content, so you can change the destination anytime without reprinting, and every scan is counted and located.",
  },
  {
    q: "Can I track how many times a QR code is scanned?",
    a: "Yes — any dynamic code reports total scans plus time, city, device, OS and browser from your dashboard. Compare codes side-by-side to A/B test print placements.",
  },
  {
    q: "Can QR codes be round, heart-shaped or anything else?",
    a: "Absolutely. The finder patterns carry most of the scannability budget, so the body dots can be rounded, dotted, classy — and frames can add stickers, shapes and CTAs. We ship 140+ combinations and they all scan on stock camera apps.",
  },
  {
    q: "How do I add my logo to a QR code?",
    a: "Open the Logo tab in the design panel, upload a PNG/JPG/SVG (up to 1.5 MB) and set its size. Error correction automatically bumps to level H, so the code stays scannable with the logo sitting in the middle.",
  },
  {
    q: "How do I create QR codes in bulk?",
    a: "Upload a CSV or XLSX — one row per code — apply a master design, and export everything as a ZIP of PNGs or a single print-ready PDF. Rows can override name, URL, colors and logo individually.",
  },
  {
    q: "Is the free plan really free forever?",
    a: "Yes. Static codes are unlimited and free for life. You also get your first 10 dynamic codes on us; upgrade only when you need more, white-label domains, or team seats.",
  },
  {
    q: "Can I create a QR code without signing up?",
    a: "You can. Static codes generate and download right from the workbench with no account. Saving to your dashboard, dynamic codes and analytics are the part that asks for a signup.",
  },
  {
    q: "What size should I print my QR code?",
    a: "Keep it at least 2 × 2 cm when viewed by a phone camera, preserve the quiet zone (the empty margin), and favour high-resolution PNG or SVG exports. Always test-scan a proof copy before the full print run.",
  },
  {
    q: "Is my data safe with QRForge?",
    a: "The platform is SOC 2 Type II certified, encrypts data in transit (TLS 1.3) and at rest (AES-256), supports MFA and passcode-protected pages, and complies with GDPR with a strong DPA on request.",
  },
  {
    q: "What can I use QR codes for?",
    a: "Nearly any offline-to-online moment: business cards, menus, packaging, brochures, standees, event badges, pet tags, loyalty programs, review collection, WiFi sharing — if a human can point a camera at it, a QR code fits.",
  },
];

export function Faq() {
  const [open, setOpen] = useState(0);
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="faq" className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="lg:sticky lg:top-32 lg:self-start">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-verm">
          /// 07 · Straight answers
        </p>
        <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
          Frequently asked, <span className="text-moss">honestly answered</span>
        </h2>
        <p className="mt-4 max-w-sm text-sm text-ink-soft">
          Everything people ask before their first print run. Something missing? The workbench is
          free — the fastest answer is a scan.
        </p>
      </div>

      <div ref={ref} className="reveal divide-y-[1.5px] divide-ink border-y-[1.5px] border-ink">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q}>
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="group flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span className="flex items-baseline gap-3">
                  <span className={`font-mono text-[11px] tracking-widest ${isOpen ? "text-verm" : "text-ink-soft/60"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`font-display text-base font-bold transition-colors sm:text-lg ${isOpen ? "text-verm" : "group-hover:text-moss"}`}>
                    {f.q}
                  </span>
                </span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-[1.5px] border-ink transition-all duration-300 ${
                    isOpen ? "rotate-45 bg-verm text-white" : "bg-white group-hover:bg-lime"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
              <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"}`}>
                <div className="min-h-0 overflow-hidden">
                  <p className="max-w-2xl pl-8 text-sm leading-relaxed text-ink-soft">{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------ final CTA ---------------------------- */

export function FinalCta() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="relative overflow-hidden border-t-[1.5px] border-ink bg-lime">
      <svg
        viewBox="0 0 200 200"
        className="pointer-events-none absolute -bottom-10 -left-10 h-64 w-64 rotate-12 text-ink/[0.08]"
        fill="currentColor"
        aria-hidden
      >
        {[0, 1, 2, 3, 4].map((r) =>
          [0, 1, 2, 3, 4].map((c) =>
            (r * 5 + c * 7) % 3 !== 1 ? (
              <rect key={`${r}${c}`} x={12 + c * 38} y={12 + r * 38} width="28" height="28" rx="6" />
            ) : null
          )
        )}
      </svg>
      <div ref={ref} className="reveal mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-verm">
            /// Last call
          </p>
          <h2 className="max-w-2xl font-display text-4xl font-extrabold leading-[1.03] tracking-tight text-ink sm:text-6xl">
            Your brand new QR code is five minutes away.
          </h2>
          <p className="mt-4 max-w-lg text-ink/70">
            Free forever for static codes. Your first 10 dynamic codes — analytics, editing and
            all — are on the house.
          </p>
        </div>
        <a
          href="#generator"
          className="card-hard group flex shrink-0 items-center gap-3 rounded-lg bg-ink px-8 py-5 font-display text-xl font-extrabold text-lime"
        >
          Forge it now
          <IconArrowRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1.5" />
        </a>
      </div>
    </section>
  );
}

/* -------------------------------- footer ------------------------------ */

const FOOTER_COLS: { title: string; links: string[] }[] = [
  { title: "Product", links: ["QR Generator", "Dynamic QR Codes", "Bulk Upload", "Analytics", "Pricing", "API"] },
  { title: "Solutions", links: ["Digital Business Cards", "vCard Plus", "PDF to QR", "Google Review", "Pet Tags", "Menus"] },
  { title: "Resources", links: ["Blog", "QR Academy", "Print Guide", "API Docs", "Status", "Changelog"] },
  { title: "Company", links: ["About", "Security", "Careers", "Contact", "Partners", "Press kit"] },
];

function FooterQr() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current;
    if (!host || host.childElementCount > 0) return;
    const qr = new QRCodeStyling({
      width: 132,
      height: 132,
      data: "https://qrforge.app",
      margin: 10,
      qrOptions: { errorCorrectionLevel: "M" },
      dotsOptions: { type: "rounded", color: "#141a12" },
      cornersSquareOptions: { type: "extra-rounded", color: "#141a12" },
      cornersDotOptions: { type: "dot", color: "#e4572e" },
      backgroundOptions: { color: "#fbfbf3" },
    });
    qr.append(host);
  }, []);
  return (
    <div className="w-fit rounded-xl border-[1.5px] border-ink bg-cream p-2 shadow-[4px_4px_0_0_#c9e964]">
      <div ref={ref} className="[&>canvas]:!h-auto [&>canvas]:!w-[132px]" />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <a href="#top" className="flex items-center gap-2.5">
            <LogoMark className="h-10 w-10" />
            <span className="font-display text-2xl font-extrabold tracking-tight">
              QR<span className="text-verm">Forge</span>
            </span>
          </a>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
            The QR workbench for brands that print. Design, track and manage QR codes that people
            actually want to scan.
          </p>
          <div className="mt-6 flex items-end gap-6">
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-lime">
                Yes, it's a real QR
              </p>
              <FooterQr />
            </div>
            <div className="flex flex-col gap-2.5 pb-1">
              {[
                { Ic: IconX, label: "X (Twitter)" },
                { Ic: IconLinkedIn, label: "LinkedIn" },
                { Ic: IconYouTube, label: "YouTube" },
              ].map(({ Ic, label }) => (
                <a
                  key={label}
                  href="#top"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-md border-[1.5px] border-paper/30 text-paper/70 transition hover:border-lime hover:text-lime"
                >
                  <Ic className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {FOOTER_COLS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-lime">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#top" className="text-sm text-paper/65 transition hover:text-lime hover:underline hover:underline-offset-4">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-paper/15">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6">
          <p className="font-mono text-[11px] text-paper/45">
            © 2026 QRForge Labs — crafted demo inspired by the QR-code-generator genre.
          </p>
          <p className="flex items-center gap-2 font-mono text-[11px] text-paper/45">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-lime" />
            All systems scannable
          </p>
        </div>
      </div>
    </footer>
  );
}

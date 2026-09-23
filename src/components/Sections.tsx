import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { formatNumber, useCountUp, useReveal } from "../lib/core";
import type { ContentState, ContentType } from "../lib/core";
import {
  IconArrowRight,
  IconArrowUpRight,
  IconBusinessCard,
  IconChart,
  IconChevronLeft,
  IconChevronRight,
  IconCursor,
  IconDocSeal,
  IconFingerprint,
  IconFolders,
  IconForm,
  IconGallery,
  IconGdpr,
  IconKeypad,
  IconLink,
  IconLock,
  IconMapPin,
  IconMenuCard,
  IconMultiUrl,
  IconPaw,
  IconPdf,
  IconQuote,
  IconScanUp,
  IconShieldCheck,
  IconStarBadge,
  IconStorefront,
  IconTag,
  IconVCardPlus,
  IconZap,
} from "./icons";

/* ------------------------------ helpers ----------------------------- */

function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function seedGenerator(type: ContentType, patch: Partial<ContentState>) {
  window.dispatchEvent(new CustomEvent("qrforge:seed", { detail: { type, patch } }));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("generator")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
}

function SectionHead({
  eyebrow,
  title,
  side,
  dark = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  side?: string;
  dark?: boolean;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal mb-10 grid items-end gap-4 lg:grid-cols-[1fr_0.7fr]">
      <div>
        <p className={`mb-2 font-mono text-[11px] uppercase tracking-[0.28em] ${dark ? "text-lime" : "text-verm"}`}>
          {eyebrow}
        </p>
        <h2 className={`font-display text-3xl font-extrabold tracking-tight sm:text-5xl ${dark ? "text-paper" : ""}`}>
          {title}
        </h2>
      </div>
      {side && <p className={`max-w-md text-sm leading-relaxed ${dark ? "text-paper/70" : "text-ink-soft"}`}>{side}</p>}
    </div>
  );
}

/* --------------------------- brand marquee -------------------------- */

const BRANDS = [
  "PAPERPLANE",
  "OKTOBER BREW",
  "NORDLYS HOTELS",
  "KIWI UNION BANK",
  "VOLTA MOTORS",
  "MAPLE & CO.",
  "ATLAS FEST",
  "BLOOM STUDIO",
  "HARBOR FITNESS",
  "ZEPHYR AIR",
];

function BrandRow({ outline }: { outline?: boolean }) {
  return (
    <div className="flex shrink-0 items-center">
      {BRANDS.map((b) => (
        <span key={b} className="flex items-center">
          <span
            className={`whitespace-nowrap px-8 font-display text-2xl font-extrabold tracking-tight sm:text-3xl ${
              outline ? "text-outline opacity-60" : "text-ink"
            }`}
          >
            {b}
          </span>
          <svg viewBox="0 0 20 20" className="h-4 w-4 text-verm" fill="currentColor" aria-hidden>
            <rect x="2" y="2" width="7" height="7" rx="1.5" />
            <rect x="11" y="2" width="7" height="7" rx="1.5" opacity="0.5" />
            <rect x="2" y="11" width="7" height="7" rx="1.5" opacity="0.5" />
            <rect x="11" y="11" width="7" height="7" rx="3.5" />
          </svg>
        </span>
      ))}
    </div>
  );
}

export function TrustedBand() {
  const ref = useReveal<HTMLDivElement>();
  const stats = useInView<HTMLDivElement>(0.4);
  const scans = useCountUp(1_400_000_000, stats.inView, 1800);
  const countries = useCountUp(190, stats.inView, 1400);
  const codes = useCountUp(12_000_000, stats.inView, 1600);
  const uptime = useCountUp(99.98, stats.inView, 1600);

  return (
    <section className="border-b-[1.5px] border-ink bg-cream">
      <div ref={ref} className="reveal overflow-hidden border-b-[1.5px] border-ink py-6">
        <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
          Printed, stuck & scanned by teams at
        </p>
        <div className="marquee-track" style={{ "--mq-speed": "44s" } as React.CSSProperties}>
          <BrandRow />
          <BrandRow outline />
        </div>
      </div>

      <div ref={stats.ref} className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 py-10 sm:px-6 lg:grid-cols-4">
        {[
          { v: formatNumber(scans), label: "scans tracked to date", note: "across dynamic codes" },
          { v: `${Math.round(countries)}+`, label: "countries scanning", note: "from Oslo to Osaka" },
          { v: formatNumber(codes), label: "QR codes forged", note: "static + dynamic" },
          { v: `${uptime.toFixed(2)}%`, label: "redirect uptime", note: "rolling 12 months" },
        ].map((s, i) => (
          <div
            key={s.label}
            className={`px-4 py-2 ${i > 0 ? "border-l-[1.5px] border-ink/15 max-lg:[&:nth-child(3)]:border-l-0 lg:border-ink/15" : ""}`}
          >
            <p className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">{s.v}</p>
            <p className="mt-1 text-sm font-bold">{s.label}</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">{s.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------- solutions ---------------------------- */

type Solution = {
  title: string;
  blurb: string;
  icon: ComponentType<{ className?: string }>;
  accent: string;
  type: ContentType;
  patch: Partial<ContentState>;
};

const SOLUTIONS: Solution[] = [
  {
    title: "Digital Business Cards",
    blurb: "Pre-designed profile pages. Share contacts, calendars and socials in one scan.",
    icon: IconBusinessCard,
    accent: "#e4572e",
    type: "vcard",
    patch: {
      vcard: { firstName: "Amara", lastName: "Okafor", org: "Studio North", title: "Brand Director", phone: "+44 20 7946 0810", email: "amara@studionorth.co", website: "https://studionorth.co" },
    },
  },
  {
    title: "vCard Plus",
    blurb: "A full contact record — phone, email, address — saved straight to the scanner's phone.",
    icon: IconVCardPlus,
    accent: "#177e71",
    type: "vcard",
    patch: {
      vcard: { firstName: "Jonas", lastName: "Lindqvist", org: "Fjell Logistics", title: "Fleet Manager", phone: "+46 8 5550 214", email: "jonas@fjell.se", website: "https://fjell.se" },
    },
  },
  {
    title: "URL / Link",
    blurb: "Turn any link into a branded doorway — campaigns, blogs, promos, sign-ups.",
    icon: IconLink,
    accent: "#1c4a34",
    type: "url",
    patch: { url: "https://yourbrand.com/spring-sale" },
  },
  {
    title: "PDF to QR",
    blurb: "Menus, manuals, spec sheets — one scan opens the document, always the latest version.",
    icon: IconPdf,
    accent: "#8a4b08",
    type: "url",
    patch: { url: "https://yourbrand.com/menu-2026.pdf" },
  },
  {
    title: "Pet Tags",
    blurb: "Collar tags with name, meds and your number. A scan reunites pets faster.",
    icon: IconPaw,
    accent: "#b0567a",
    type: "url",
    patch: { url: "https://petprofile.app/biscuit-the-beagle" },
  },
  {
    title: "Business Page",
    blurb: "Hours, location, links and a tap-to-save contact card for your storefront.",
    icon: IconStorefront,
    accent: "#2f6b4a",
    type: "url",
    patch: { url: "https://yourbrand.com/store/shoreditch" },
  },
  {
    title: "Google Maps",
    blurb: "Opens the map pinned exactly on your door. No typing the address wrong.",
    icon: IconMapPin,
    accent: "#177e71",
    type: "url",
    patch: { url: "https://maps.google.com/?q=14+Rivington+Street+London" },
  },
  {
    title: "Google Review",
    blurb: "One scan lands on your review form. The fastest route to a higher local rating.",
    icon: IconStarBadge,
    accent: "#e4572e",
    type: "url",
    patch: { url: "https://g.page/r/yourbrand/review" },
  },
  {
    title: "Image Gallery",
    blurb: "Portfolios, lookbooks, event shots — a whole gallery behind a single code.",
    icon: IconGallery,
    accent: "#5b6b52",
    type: "url",
    patch: { url: "https://yourbrand.com/gallery/ss26-lookbook" },
  },
  {
    title: "Menu Card",
    blurb: "Touchless menus for tables and takeout. Swap dishes anytime without reprinting.",
    icon: IconMenuCard,
    accent: "#b07a1f",
    type: "url",
    patch: { url: "https://yourbrand.com/menu/dinner" },
  },
];

export function Solutions() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="solutions" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHead
        eyebrow="/// 02 · One platform, many doors"
        title={
          <>
            A QR solution for every <span className="text-moss">business vertical</span>
          </>
        }
        side="Ten ready-made recipes below. Hit “Load sample” and the workbench upstairs fills itself with a sensible starting point — then make it yours."
      />

      <div ref={ref} className="reveal grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {SOLUTIONS.map((s, i) => {
          const Ic = s.icon;
          return (
            <div
              key={s.title}
              className="card-hard group relative flex flex-col rounded-xl bg-cream p-5"
              style={{ "--rv-delay": `${(i % 5) * 60}ms` } as React.CSSProperties}
            >
              <span
                className="absolute right-4 top-4 font-mono text-[10px] tracking-widest text-ink-soft/60 transition group-hover:text-ink"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border-[1.5px] border-ink text-ink transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
                style={{ backgroundColor: s.accent + "22", color: s.accent }}
              >
                <Ic className="h-6 w-6" />
              </span>
              <h3 className="font-display text-lg font-bold leading-tight">{s.title}</h3>
              <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-ink-soft">{s.blurb}</p>
              <button
                onClick={() => seedGenerator(s.type, s.patch)}
                className="mt-4 inline-flex items-center gap-1.5 self-start rounded-md border-[1.5px] border-ink bg-white px-3 py-1.5 text-xs font-bold transition hover:bg-ink hover:text-lime"
              >
                Load sample <IconArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* use case chips */}
      <div className="mt-10 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
          Seen everywhere →
        </span>
        {["Business cards", "Brochures", "Books", "Clothing tags", "Packaging", "Standees", "Product labels", "Table tents", "Billboards", "Event badges"].map((u) => (
          <span
            key={u}
            className="cursor-default rounded-full border-[1.5px] border-ink/30 bg-white px-3 py-1 text-xs font-semibold transition hover:-translate-y-0.5 hover:border-ink hover:bg-lime hover:shadow-[2px_2px_0_0_#141a12]"
          >
            {u}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ features ---------------------------- */

const FEATURES = [
  {
    icon: IconScanUp,
    title: "Very high scan rates",
    body: "Shaped bodies, bold eyes and CTA stickers aren't decoration — codes with a “SCAN ME” frame lift scans by up to 34% in our print tests. Tune contrast and quiet zones right in the preview.",
    visual: (
      <div className="flex items-end gap-3 rounded-lg border-[1.5px] border-ink/20 bg-white p-4">
        {[
          { h: "34%", w: "26%", label: "bare code" },
          { h: "57%", w: "44%", label: "+ brand color" },
          { h: "81%", w: "62%", label: "+ logo" },
          { h: "100%", w: "78%", label: "+ CTA sticker" },
        ].map((b, i) => (
          <div key={b.label} className="flex-1">
            <div className="flex h-24 items-end">
              <div
                className={`bar-grow w-full rounded-t-md border-[1.5px] border-ink ${i === 3 ? "bg-lime" : "bg-sage"}`}
                style={{ height: b.w, "--bar-delay": `${i * 120}ms` } as React.CSSProperties}
              />
            </div>
            <p className="mt-1.5 text-center font-mono text-[9px] uppercase tracking-wide text-ink-soft">{b.label}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: IconChart,
    title: "Real-time scan analytics",
    body: "Every dynamic code reports scans by hour, city, device, OS and browser. A/B two print variants, see which street poster wins, then double down — no spreadsheets required.",
    visual: (
      <div className="rounded-lg border-[1.5px] border-ink/20 bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">Scans · last 7 days</p>
          <span className="rounded bg-moss/15 px-2 py-0.5 font-mono text-[10px] font-bold text-moss">▲ 23.4%</span>
        </div>
        <div className="flex items-end gap-1.5">
          {[42, 65, 38, 74, 58, 90, 100].map((h, i) => (
            <div key={i} className="flex-1">
              <div
                className={`bar-grow w-full rounded-t-sm ${i === 6 ? "bg-verm" : "bg-teal/70"}`}
                style={{ height: `${h * 0.7}px`, "--bar-delay": `${i * 90}ms` } as React.CSSProperties}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[9px] text-ink-soft">
          {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: IconFolders,
    title: "Folders & bulk management",
    body: "Built for agencies and enterprise: upload a CSV, mint a thousand codes, organise them into campaign folders, re-style the whole set in one pass and export as a ZIP or print PDF.",
    visual: (
      <div className="rounded-lg border-[1.5px] border-ink/20 bg-white p-4 font-mono text-[11px]">
        {[
          { n: "▸ /ss26-lookbook", c: "214 codes", hot: true },
          { n: "▸ /store-openings", c: "38 codes", hot: false },
          { n: "▸ /loyalty-cards", c: "1,204 codes", hot: false },
        ].map((f) => (
          <div key={f.n} className={`flex items-center justify-between rounded px-2 py-1.5 ${f.hot ? "bg-lime/50" : ""}`}>
            <span>{f.n}</span>
            <span className="text-ink-soft">{f.c}</span>
          </div>
        ))}
        <div className="mt-2 border-t border-dashed border-ink/30 pt-2 text-ink-soft">
          ↳ summer-sale-table.png · menu-v3.svg · +212 more
        </div>
      </div>
    ),
  },
  {
    icon: IconTag,
    title: "White-label domains",
    body: "Retire the generic short link. Serve scans from qr.yourbrand.com and keep every touchpoint inside your own identity — landing pages, redirects and all.",
    visual: (
      <div className="rounded-lg border-[1.5px] border-ink/20 bg-white p-4">
        <div className="flex items-center gap-2 rounded-md border-[1.5px] border-ink/25 bg-paper px-3 py-2">
          <span className="flex gap-1">
            <i className="h-2 w-2 rounded-full bg-verm" />
            <i className="h-2 w-2 rounded-full bg-amber" />
            <i className="h-2 w-2 rounded-full bg-moss" />
          </span>
          <span className="truncate font-mono text-[11px] text-ink-soft">
            <s className="opacity-60">qrfg.io/xk29fd</s>
            <span className="ml-2 font-bold text-moss">qr.acmecoffee.co/roast-014</span>
          </span>
        </div>
        <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-widest text-ink-soft">
          your domain · your trust
        </p>
      </div>
    ),
  },
  {
    icon: IconCursor,
    title: "Post-scan engagement",
    body: "The scan is the handshake, not the finish line. Attach forms, coupons, videos or a full landing page so every scan pushes toward the action you actually want.",
    visual: (
      <div className="mx-auto w-40 rounded-xl border-[1.5px] border-ink/25 bg-white p-2.5">
        <div className="h-10 rounded-md bg-gradient-to-br from-moss to-teal" />
        <div className="mt-2 h-2 w-3/4 rounded bg-ink/15" />
        <div className="mt-1 h-2 w-1/2 rounded bg-ink/10" />
        <div className="mt-2.5 rounded-md bg-verm py-1.5 text-center font-mono text-[9px] font-bold uppercase tracking-widest text-white">
          Claim 15% off
        </div>
      </div>
    ),
  },
];

export function Features() {
  return (
    <section id="features" className="border-y-[1.5px] border-ink bg-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* sticky intro */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHead
            eyebrow="/// 03 · Built to be measured"
            title={
              <>
                Design, marketing and <span className="text-verm">management</span> in one bench
              </>
            }
            side="A pretty QR is table stakes. QRForge is the whole pipeline — create, brand, distribute, track, iterate — without leaving the tab."
          />
          <a href="#generator" className="card-hard inline-flex items-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-bold text-lime">
            Try the workbench <IconArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* scrolling blocks */}
        <div className="space-y-6">
          {FEATURES.map((f, i) => {
            const Ic = f.icon;
            return (
              <FeatureBlock key={f.title} index={i} icon={Ic} title={f.title} body={f.body} visual={f.visual} />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeatureBlock({
  icon: Ic,
  title,
  body,
  visual,
  index,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
  visual: React.ReactNode;
  index: number;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal card-hard rounded-xl bg-cream p-6" style={{ "--rv-delay": `${index * 40}ms` } as React.CSSProperties}>
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-[1.5px] border-ink bg-lime">
          <Ic className="h-6 w-6" />
        </span>
        <div>
          <h3 className="font-display text-xl font-bold">{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{body}</p>
        </div>
      </div>
      <div className="mt-5">{visual}</div>
    </div>
  );
}

/* ------------------------------ security ----------------------------- */

const SECURITY = [
  { icon: IconShieldCheck, title: "SOC 2 Type II certified", body: "Controls audited continuously — not a checkbox, a habit." },
  { icon: IconLock, title: "Encryption everywhere", body: "TLS 1.3 in transit, AES-256 at rest. Your payloads stay sealed." },
  { icon: IconFingerprint, title: "Multi-factor auth", body: "MFA on the main account and every sub-account you mint." },
  { icon: IconKeypad, title: "Passcode-protected pages", body: "Lock any landing page or card behind a 4-digit gate." },
  { icon: IconGdpr, title: "GDPR compliant", body: "Data-minimal scan analytics, EU hosting option, easy erasure." },
  { icon: IconDocSeal, title: "Strong DPA", body: "A data processing agreement with teeth, signed before you scale." },
];

export function Security() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="security" className="relative overflow-hidden bg-ink py-20 text-paper">
      <svg className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 text-paper/[0.04]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.6" aria-hidden>
        <path d="M12 2.8 4.5 5.6v6c0 4.7 3.2 8 7.5 9.6 4.3-1.6 7.5-4.9 7.5-9.6v-6L12 2.8Z" />
        <path d="m8.7 11.8 2.4 2.4 4.4-4.8" />
      </svg>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          dark
          eyebrow="/// 04 · Boring on purpose"
          title={
            <>
              Security you never <span className="text-lime">have to think about</span>
            </>
          }
          side="QR codes route strangers to your brand in one hop. Every layer below exists so that hop is never a leap of faith."
        />
        <div ref={ref} className="reveal grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECURITY.map((s, i) => {
            const Ic = s.icon;
            return (
              <div
                key={s.title}
                className="group rounded-xl border-[1.5px] border-paper/25 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-lime hover:bg-paper/[0.04]"
                style={{ "--rv-delay": `${(i % 3) * 70}ms` } as React.CSSProperties}
              >
                <Ic className="h-8 w-8 text-lime transition-transform duration-300 group-hover:scale-110" />
                <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-paper/65">{s.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- testimonials --------------------------- */

const QUOTES = [
  {
    quote: "The variety of designs is what hooked me. I made a WhatsApp-link QR for our resort bars and the preset designs were so good I bookmarked the site on the spot.",
    name: "Alan Harlow",
    role: "Copy Marketing, Oasis Hotels & Resorts",
    accent: "#e4572e",
  },
  {
    quote: "Totally customizable. I tried many generators and got nothing — here I styled codes for each garment line. I'd rate QRForge a solid 9.5.",
    name: "Srivatsan S.",
    role: "Managing Director, Varaha Apparels",
    accent: "#177e71",
  },
  {
    quote: "Our patients scan one code to find the nearest clinic. It works for every one of my clients, and the dashboard keeps us connected to the numbers.",
    name: "Dr. Dharmendra Panchal",
    role: "Founder Chairman, Dr. Diabeat",
    accent: "#1c4a34",
  },
  {
    quote: "I prepared an online congress with ten digital guides behind QR codes. Fifteen codes generated quickly and painlessly — we're coming back for the next project.",
    name: "Marion Wettengel",
    role: "Author, 'Braked Out — But Not Given Up'",
    accent: "#b07a1f",
  },
  {
    quote: "Different styles, colors, logos — the PDF export is always crisp. For our startup, this platform is genuinely useful every single week.",
    name: "Bigily Aji",
    role: "Owner, Spenta Bridal Makeover Studio",
    accent: "#b0567a",
  },
  {
    quote: "Scans are trackable in a simple dashboard, so I can see exactly how many prospects each ad pulls. It offers so much for a free tier — 10+ from me.",
    name: "Ariane van Wyk",
    role: "Marketing Manager, Harcourts Evolve",
    accent: "#5b6b52",
  },
];

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const ref = useReveal<HTMLDivElement>();
  const scroll = (dir: 1 | -1) =>
    trackRef.current?.scrollBy({ left: dir * 380, behavior: "smooth" });

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <SectionHead
          eyebrow="/// 05 · Field reports"
          title={
            <>
              Heard around <span className="text-moss">the print shop</span>
            </>
          }
        />
        <div className="mb-10 hidden gap-2 lg:flex">
          <button onClick={() => scroll(-1)} aria-label="Previous testimonials" className="card-hard-sm rounded-md bg-cream p-2.5 hover:bg-lime">
            <IconChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => scroll(1)} aria-label="Next testimonials" className="card-hard-sm rounded-md bg-cream p-2.5 hover:bg-lime">
            <IconChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div ref={ref} className="reveal no-scrollbar -mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
        {QUOTES.map((q, i) => (
          <figure
            key={q.name}
            className="card-hard relative w-[320px] shrink-0 snap-start rounded-xl bg-cream p-6 sm:w-[360px]"
            style={{ "--rv-delay": `${(i % 3) * 80}ms` } as React.CSSProperties}
          >
            <IconQuote className="h-8 w-8" style={{ color: q.accent }} />
            <blockquote className="mt-3 text-[15px] font-medium leading-relaxed">“{q.quote}”</blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t-[1.5px] border-dashed border-ink/30 pt-4">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-ink font-display text-sm font-extrabold"
                style={{ backgroundColor: q.accent + "26", color: q.accent }}
              >
                {q.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </span>
              <span>
                <span className="block text-sm font-bold">{q.name}</span>
                <span className="block text-xs text-ink-soft">{q.role}</span>
              </span>
              <span className="ml-auto font-mono text-[10px] tracking-widest text-amber">★★★★★</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ bulk band ---------------------------- */

export function BulkBand() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="border-y-[1.5px] border-ink bg-pine py-20 text-paper">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div ref={ref} className="reveal">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-lime">
            /// 06 · Scale without sweat
          </p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            One CSV in. <span className="text-lime">A thousand QRs out.</span>
          </h2>
          <p className="mt-4 max-w-lg text-paper/75">
            Bring your own spreadsheet — names, URLs, even per-row colors and logos. We mint the
            batch, apply your master design, and hand back a ZIP of PNGs or a single print-ready
            PDF.
          </p>
          <ol className="mt-8 space-y-4">
            {[
              ["Download the sample file", "Column names stay put; rows are yours."],
              ["Fill your records", "10 rows or 10,000 — same two minutes."],
              ["Upload, style once, export all", "Folder-organised, analytics-ready."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-[1.5px] border-lime font-mono text-sm font-bold text-lime">
                  {i + 1}
                </span>
                <div>
                  <p className="font-display font-bold">{t}</p>
                  <p className="text-sm text-paper/60">{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <a href="#generator" className="card-hard mt-8 inline-flex items-center gap-2 rounded-md bg-lime px-5 py-3 text-sm font-extrabold text-ink">
            <IconZap className="h-4 w-4" /> Start a batch — it's free
          </a>
        </div>

        {/* csv mock */}
        <div className="card-hard overflow-hidden rounded-xl bg-ink font-mono text-xs" style={{ boxShadow: "6px 6px 0 0 #c9e964" }}>
          <div className="flex items-center gap-2 border-b border-paper/15 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-verm" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber" />
            <span className="h-2.5 w-2.5 rounded-full bg-moss" />
            <span className="ml-2 text-paper/50">spring-campaign.csv — 1,204 rows</span>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full min-w-[420px] text-left">
              <thead>
                <tr className="text-lime">
                  {["name", "url", "fg", "bg", "logo"].map((h) => (
                    <th key={h} className="pb-2 pr-4 font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-paper/80">
                <tr className="row-flash">
                  <td className="py-1.5 pr-4">table-tent-01</td>
                  <td className="pr-4 text-teal">/menu/summer</td>
                  <td className="pr-4"><i className="inline-block h-3 w-3 rounded-sm border border-paper/40 bg-[#e4572e]" /></td>
                  <td className="pr-4"><i className="inline-block h-3 w-3 rounded-sm border border-paper/40 bg-[#fbfbf3]" /></td>
                  <td className="text-paper/40">logo.svg</td>
                </tr>
                <tr className="row-flash">
                  <td className="py-1.5 pr-4">window-decal</td>
                  <td className="pr-4 text-teal">/promo/-20</td>
                  <td className="pr-4"><i className="inline-block h-3 w-3 rounded-sm border border-paper/40 bg-[#c9e964]" /></td>
                  <td className="pr-4"><i className="inline-block h-3 w-3 rounded-sm border border-paper/40 bg-[#141a12]" /></td>
                  <td className="text-paper/40">—</td>
                </tr>
                <tr className="row-flash">
                  <td className="py-1.5 pr-4">receipt-footer</td>
                  <td className="pr-4 text-teal">/review</td>
                  <td className="pr-4"><i className="inline-block h-3 w-3 rounded-sm border border-paper/40 bg-[#141a12]" /></td>
                  <td className="pr-4"><i className="inline-block h-3 w-3 rounded-sm border border-paper/40 bg-[#fbfbf3]" /></td>
                  <td className="text-paper/40">logo.svg</td>
                </tr>
                <tr className="text-paper/40">
                  <td className="py-1.5 pr-4">… 1,201 more rows</td>
                  <td className="pr-4" />
                  <td className="pr-4" />
                  <td className="pr-4" />
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-paper/15 px-4 py-2.5 text-[10px] uppercase tracking-widest text-paper/50">
            <span>✓ header validated</span>
            <span>→ export: qr-spring.zip (1,204 files)</span>
          </div>
        </div>
      </div>
    </section>
  );
}

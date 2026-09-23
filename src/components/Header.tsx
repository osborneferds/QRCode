import { useEffect, useState } from "react";
import { IconClose, IconMenuBurger, IconZap, LogoMark } from "./icons";

const TICKER = [
  "Free forever plan",
  "Dynamic QR + scan analytics",
  "Bulk upload via CSV",
  "PNG · SVG · EPS export",
  "SOC 2 Type II ready",
  "White-label domains",
  "140+ shapes & stickers",
  "GDPR compliant",
  "No app needed to scan",
];

const NAV = [
  { href: "#generator", label: "Generator" },
  { href: "#solutions", label: "Solutions" },
  { href: "#features", label: "Features" },
  { href: "#security", label: "Security" },
  { href: "#faq", label: "FAQ" },
];

function TickerRow() {
  return (
    <div className="flex shrink-0 items-center">
      {TICKER.map((t) => (
        <span
          key={t}
          className="flex items-center gap-3 pr-3 font-mono text-[10px] uppercase tracking-[0.22em] text-lime/90"
        >
          {t}
          <span className="inline-block h-1.5 w-1.5 rotate-45 bg-verm" />
        </span>
      ))}
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* ticker */}
      <div className="overflow-hidden border-b border-ink bg-ink py-1.5">
        <div className="marquee-track" style={{ "--mq-speed": "36s" } as React.CSSProperties}>
          <TickerRow />
          <TickerRow />
        </div>
      </div>

      {/* nav */}
      <div
        className={`border-b border-ink bg-paper/95 backdrop-blur transition-shadow duration-300 ${
          scrolled ? "shadow-[0_4px_0_0_rgba(20,26,18,0.08)]" : ""
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href="#top" className="group flex items-center gap-2.5">
            <LogoMark className="h-9 w-9 transition-transform duration-300 group-hover:rotate-6" />
            <span className="font-display text-xl font-extrabold tracking-tight">
              QR<span className="text-verm">Forge</span>
            </span>
            <span className="mt-1 hidden font-mono text-[9px] uppercase tracking-[0.25em] text-ink-soft sm:block">
              scan lab
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="rounded-md px-3.5 py-2 text-sm font-semibold text-ink-soft transition-colors hover:bg-ink hover:text-lime"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href="#faq"
              className="hidden font-mono text-xs uppercase tracking-widest text-ink-soft underline-offset-4 hover:underline focus-visible:underline md:block"
            >
              Sign in
            </a>
            <a
              href="#generator"
              className="card-hard-sm hidden items-center gap-1.5 rounded-md bg-lime px-4 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5 focus-visible:-translate-y-0.5 sm:flex"
            >
              <IconZap className="h-4 w-4" />
              Start free
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="card-hard-sm rounded-md bg-cream p-2 transition-transform hover:scale-105 focus-visible:scale-105 lg:hidden"
            >
              {open ? <IconClose className="h-5 w-5" /> : <IconMenuBurger className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* mobile menu */}
        <div
          className={`grid overflow-hidden transition-all duration-300 lg:hidden ${
            open ? "grid-rows-[1fr] border-t border-ink" : "grid-rows-[0fr]"
          }`}
          aria-hidden={!open}
        >
          <div className="min-h-0">
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1 px-4 py-4">
              {NAV.map((n, i) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                  className="flex items-center justify-between rounded-md px-3 py-2.5 font-display text-lg font-bold hover:bg-ink hover:text-lime focus-visible:bg-ink focus-visible:text-lime"
                >
                  {n.label}
                  <span className="font-mono text-xs text-verm">0{i + 1}</span>
                </a>
              ))}
              <a
                href="#generator"
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="card-hard-sm mt-2 rounded-md bg-lime px-4 py-3 text-center font-bold transition-transform hover:-translate-y-0.5 focus-visible:-translate-y-0.5"
              >
                Start free — no signup
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

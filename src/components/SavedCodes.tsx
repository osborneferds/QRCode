import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { shortLink, useLocalStorage, useReveal } from "../lib/core";
import type { SavedQR } from "../lib/core";
import { IconCheck, IconCopy, IconTrash, IconZap } from "./icons";

function MiniQR({ item }: { item: SavedQR }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const d = item.design;
    const qr = new QRCodeStyling({
      width: 116,
      height: 116,
      data: item.data,
      margin: 8,
      qrOptions: { errorCorrectionLevel: d.logo ? "H" : "M" },
      image: d.logo ?? undefined,
      imageOptions: { imageSize: d.logoSize, margin: 2, hideBackgroundDots: true },
      dotsOptions: d.gradient
        ? {
            type: d.dotType,
            gradient: {
              type: "linear",
              rotation: Math.PI / 4,
              colorStops: [
                { offset: 0, color: d.fg },
                { offset: 1, color: d.fg2 },
              ],
            },
          }
        : { type: d.dotType, color: d.fg },
      cornersSquareOptions: { type: d.cornerSquare, color: d.fg },
      cornersDotOptions: { type: d.cornerDot, color: d.fg },
      backgroundOptions: { color: d.bg },
    });
    host.replaceChildren();
    qr.append(host);
  }, [item]);

  return <div ref={ref} className="flex items-center justify-center [&>canvas]:!h-auto [&>canvas]:!w-full" />;
}

export default function SavedCodes() {
  const [saved, setSaved] = useLocalStorage<SavedQR[]>("qrforge.saved.v1", []);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const headRef = useReveal<HTMLDivElement>();
  const bodyRef = useReveal<HTMLDivElement>();

  const copy = async (item: SavedQR) => {
    try {
      const text = item.dynamic ? `https://${shortLink(item.shortId)}` : item.data;
      await navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1400);
    } catch (error) {
      console.error("[QRForge] Copy failed:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = item.dynamic ? `https://${shortLink(item.shortId)}` : item.data;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 1400);
      } catch (err) {
        console.error("[QRForge] Fallback copy failed:", err);
      }
      document.body.removeChild(textArea);
    }
  };

  const remove = (id: string) => setSaved((prev) => prev.filter((q) => q.id !== id));

  return (
    <section className="border-y-[1.5px] border-ink bg-sage/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div ref={headRef} className="reveal mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-verm">
              /// Your bench drawer
            </p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              My QR codes
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink-soft">
            Everything you save lives here — stored locally in your browser. Dynamic codes show a
            simulated scan count so you can feel the dashboard.
          </p>
        </div>

        {saved.length === 0 ? (
          <div
            ref={bodyRef}
            className="reveal flex flex-col items-center gap-3 rounded-xl border-[1.5px] border-dashed border-ink/50 bg-cream/70 px-6 py-12 text-center"
          >
            <svg viewBox="0 0 48 48" className="h-12 w-12 text-ink/30" fill="currentColor" aria-hidden>
              <rect x="6" y="6" width="14" height="14" rx="3" />
              <rect x="28" y="6" width="14" height="14" rx="3" opacity="0.55" />
              <rect x="6" y="28" width="14" height="14" rx="3" opacity="0.55" />
              <rect x="28" y="28" width="6" height="6" rx="1.5" />
              <rect x="37" y="28" width="5" height="5" rx="1" opacity="0.4" />
              <rect x="28" y="37" width="5" height="5" rx="1" opacity="0.4" />
            </svg>
            <p className="font-display text-lg font-bold">Nothing forged yet</p>
            <p className="max-w-xs text-sm text-ink-soft">
              Build a code above and hit <strong>Save</strong> — it will land here with its short
              link and scan stats.
            </p>
            <a
              href="#generator"
              className="card-hard-sm mt-1 inline-flex items-center gap-1.5 rounded-md bg-lime px-4 py-2.5 text-sm font-bold"
            >
              <IconZap className="h-4 w-4" /> Forge your first QR
            </a>
          </div>
        ) : (
          <div ref={bodyRef} className="reveal no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
            {saved.map((item) => (
              <article
                key={item.id}
                className="card-hard w-[228px] shrink-0 snap-start rounded-xl bg-cream p-4"
              >
                <div className="overflow-hidden rounded-lg border-[1.5px] border-ink/20">
                  <MiniQR item={item} />
                </div>
                <div className="mt-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold" title={item.name}>
                      {item.name}
                    </h3>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">
                      {item.type} ·{" "}
                      {item.dynamic ? (
                        <span className="text-moss">
                          {shortLink(item.shortId)} · {item.scans} scans
                        </span>
                      ) : (
                        "static"
                      )}
                    </p>
                  </div>
                  {item.dynamic && (
                    <span className="shrink-0 rounded bg-lime px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider">
                      dyn
                    </span>
                  )}
                </div>
                <div className="mt-3 flex gap-1.5">
                  <button
                    onClick={() => copy(item)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-md border-[1.5px] border-ink bg-white px-2 py-1.5 text-[11px] font-bold transition hover:bg-ink hover:text-lime"
                  >
                    {copiedId === item.id ? (
                      <IconCheck className="h-3.5 w-3.5 text-moss" />
                    ) : (
                      <IconCopy className="h-3.5 w-3.5" />
                    )}
                    {copiedId === item.id ? "Copied" : "Copy link"}
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    aria-label={`Delete ${item.name}`}
                    className="flex items-center justify-center rounded-md border-[1.5px] border-ink bg-white px-2.5 transition hover:bg-verm hover:text-white"
                  >
                    <IconTrash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

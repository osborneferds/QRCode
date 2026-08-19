import { useCallback, useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import type { Options } from "qr-code-styling";
import {
  buildContent,
  COLOR_PRESETS,
  CONTENT_TABS,
  CORNER_DOTS,
  CORNER_SQUARES,
  DEFAULT_CONTENT,
  DEFAULT_DESIGN,
  DOT_STYLES,
  GRADIENT_PRESETS,
  makeShortId,
  shortLink,
  STICKERS,
  useLocalStorage,
  useReveal,
} from "../lib/core";
import type {
  ContentState,
  ContentType,
  CornerDotId,
  CornerStyleId,
  DesignState,
  DotStyleId,
  SavedQR,
} from "../lib/core";
import {
  IconBusinessCard,
  IconCheck,
  IconCopy,
  IconDownload,
  IconLink,
  IconMail,
  IconMessage,
  IconPhone,
  IconSave,
  IconSparkle,
  IconTrash,
  IconType,
  IconUpload,
  IconWifi,
} from "./icons";

/* ------------------------------ maps ------------------------------- */

/* Style ids in lib/core.ts match qr-code-styling's literal unions exactly,
   so they can be passed straight through to the renderer. */

const TAB_ICON: Record<ContentType, React.ComponentType<{ className?: string }>> = {
  url: IconLink,
  text: IconType,
  wifi: IconWifi,
  email: IconMail,
  phone: IconPhone,
  sms: IconMessage,
  vcard: IconBusinessCard,
};

/* --------------------------- tiny glyphs --------------------------- */

function DotGlyph({ style }: { style: DotStyleId }) {
  const cells = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const x = 3.5 + c * 6.4;
      const y = 3.5 + r * 6.4;
      const cx = x + 2.2;
      const cy = y + 2.2;
      if (style === "dots") cells.push(<circle key={`${r}${c}`} cx={cx} cy={cy} r={2.3} />);
      else if (style === "classy")
        cells.push(
          <path key={`${r}${c}`} d={`M${cx} ${y} L${x + 4.4} ${cy} L${cx} ${y + 4.4} L${x} ${cy} Z`} />
        );
      else if (style === "classy-rounded")
        cells.push(
          <rect key={`${r}${c}`} x={x} y={y} width={4.4} height={4.4} rx={2.2} transform={`rotate(45 ${cx} ${cy})`} />
        );
      else
        cells.push(
          <rect
            key={`${r}${c}`}
            x={x}
            y={y}
            width={4.4}
            height={4.4}
            rx={style === "square" ? 0.6 : style === "rounded" ? 1.6 : 2.2}
          />
        );
    }
  }
  return (
    <svg viewBox="0 0 26 26" className="h-8 w-8" fill="currentColor" aria-hidden>
      {cells}
    </svg>
  );
}

function CornerGlyph({ style }: { style: CornerStyleId }) {
  return (
    <svg viewBox="0 0 26 26" className="h-8 w-8" stroke="currentColor" strokeWidth="2" fill="none" aria-hidden>
      {style === "dot" ? (
        <>
          <circle cx="13" cy="13" r="9" />
          <circle cx="13" cy="13" r="3.4" fill="currentColor" stroke="none" />
        </>
      ) : (
        <>
          <rect x="3.5" y="3.5" width="19" height="19" rx={style === "square" ? 1 : 6.5} />
          <rect x="9" y="9" width="8" height="8" fill="currentColor" stroke="none" rx={style === "square" ? 0.5 : 3} />
        </>
      )}
    </svg>
  );
}

function PupilGlyph({ style }: { style: CornerDotId }) {
  return (
    <svg viewBox="0 0 26 26" className="h-8 w-8" fill="currentColor" aria-hidden>
      {style === "dot" ? <circle cx="13" cy="13" r="6.5" /> : <rect x="6.5" y="6.5" width="13" height="13" rx="1.5" />}
    </svg>
  );
}

/* ------------------------------ helpers ----------------------------- */

const inputCls =
  "w-full rounded-md border-[1.5px] border-ink bg-white px-3.5 py-2.5 text-sm font-medium outline-none transition placeholder:text-ink-soft/45 focus:border-verm focus:shadow-[2px_2px_0_0_#e4572e55]";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
        {label}
      </span>
      {children}
    </label>
  );
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = url;
  });
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* ==================================================================== */

export default function Generator() {
  const [content, setContent] = useState<ContentState>(DEFAULT_CONTENT);
  const [design, setDesign] = useState<DesignState>(DEFAULT_DESIGN);
  const [stickerId, setStickerId] = useState("scan");
  const [dynamic, setDynamic] = useState(true);
  const [shortId] = useState(makeShortId);
  const [qrName, setQrName] = useState("");
  const [designTab, setDesignTab] = useState<"sticker" | "color" | "shape" | "logo">("sticker");
  const [savedFlash, setSavedFlash] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scansToday, setScansToday] = useState(47);
  const [, setSaved] = useLocalStorage<SavedQR[]>("qrforge.saved.v1", []);

  const data = buildContent(content);
  const sticker = STICKERS.find((s) => s.id === stickerId) ?? STICKERS[0];

  /* live scan ticker */
  useEffect(() => {
    const t = setInterval(() => setScansToday((s) => s + Math.floor(Math.random() * 3) + 1), 4000);
    return () => clearInterval(t);
  }, []);

  /* listen for "load sample" seeds from the solutions grid */
  useEffect(() => {
    const onSeed = (e: Event) => {
      const detail = (e as CustomEvent<{ type: ContentType; patch: Partial<ContentState> }>).detail;
      if (!detail) return;
      setContent((c) => ({ ...c, ...detail.patch, type: detail.type }));
    };
    window.addEventListener("qrforge:seed", onSeed);
    return () => window.removeEventListener("qrforge:seed", onSeed);
  }, []);

  /* ---------------------- qr instances ---------------------- */
  const previewRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const hiRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const hiQrRef = useRef<QRCodeStyling | null>(null);

  const buildOptions = useCallback(
    (size: number): Options => {
      const scale = size / 300;
      const dots = design.gradient
        ? {
            type: design.dotType,
            gradient: {
              type: "linear" as const,
              rotation: Math.PI / 4,
              colorStops: [
                { offset: 0, color: design.fg },
                { offset: 1, color: design.fg2 },
              ],
            },
          }
        : { type: design.dotType, color: design.fg };
      return {
        width: size,
        height: size,
        data: data || "https://qrforge.app",
        margin: Math.round(design.margin * scale),
        qrOptions: {
          errorCorrectionLevel: design.logo ? ("H" as const) : ("M" as const),
        },
        image: design.logo ?? undefined,
        imageOptions: { crossOrigin: "anonymous", imageSize: design.logoSize, margin: 4, hideBackgroundDots: true },
        dotsOptions: dots,
        cornersSquareOptions: { type: design.cornerSquare, color: design.fg },
        cornersDotOptions: { type: design.cornerDot, color: design.fg },
        backgroundOptions: { color: design.bg },
      };
    },
    [data, design]
  );

  useEffect(() => {
    if (previewRef.current && !qrRef.current) {
      const qr = new QRCodeStyling(buildOptions(300));
      qr.append(previewRef.current);
      qrRef.current = qr;
    }
    if (hiRef.current && !hiQrRef.current) {
      hiQrRef.current = new QRCodeStyling(buildOptions(1200));
      hiQrRef.current.append(hiRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    qrRef.current?.update(buildOptions(300));
    hiQrRef.current?.update(buildOptions(1200));
    const el = popRef.current;
    if (el) {
      el.classList.remove("qr-pop");
      void el.offsetWidth;
      el.classList.add("qr-pop");
    }
  }, [buildOptions]);

  /* ---------------------- downloads ---------------------- */
  const fileBase = (qrName.trim() || `qrforge-${shortId}`).toLowerCase().replace(/[^a-z0-9-_]+/g, "-");

  const downloadPng = async () => {
    const blob = await hiQrRef.current?.getRawData("png");
    if (blob) saveBlob(blob, `${fileBase}.png`);
  };

  const downloadSvg = async () => {
    const blob = await hiQrRef.current?.getRawData("svg");
    if (blob) saveBlob(blob, `${fileBase}.svg`);
  };

  const downloadSticker = async () => {
    if (!hiQrRef.current || sticker.id === "none") return;
    try {
      await (document as Document & { fonts: FontFaceSet }).fonts.load("700 120px 'Space Mono'");
    } catch {
      /* font optional */
    }
    const blob = await hiQrRef.current.getRawData("png");
    if (!blob) return;
    const img = await loadImage(URL.createObjectURL(blob));
    const qr = 1200;
    const pad = 84;
    const band = 250;
    const W = qr + pad * 2;
    const H = W + band;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = sticker.bg;
    roundRectPath(ctx, 0, 0, W, H, 56);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    roundRectPath(ctx, pad - 26, pad - 26, qr + 52, qr + 52, 30);
    ctx.fill();
    ctx.drawImage(img, pad, pad, qr, qr);
    ctx.fillStyle = sticker.fg;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "700 108px 'Space Mono', monospace";
    ctx.fillText(sticker.text, W / 2, qr + pad + band / 2 + 6);
    ctx.globalAlpha = 0.55;
    ctx.fillRect(W / 2 - 190, qr + pad + band - 46, 380, 10);
    ctx.globalAlpha = 1;
    canvas.toBlob((b) => b && saveBlob(b, `${fileBase}-sticker.png`), "image/png");
  };

  /* ---------------------- actions ---------------------- */
  const copyShort = async () => {
    try {
      await navigator.clipboard.writeText(`https://${shortLink(shortId)}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  };

  const saveQr = () => {
    const item: SavedQR = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: qrName.trim() || `${content.type.toUpperCase()} · ${shortLink(shortId)}`,
      data: data || "https://qrforge.app",
      type: content.type,
      dynamic,
      shortId,
      design: { ...design },
      stickerId,
      createdAt: Date.now(),
      scans: dynamic ? 12 + Math.floor(Math.random() * 220) : 0,
    };
    setSaved((prev) => [item, ...prev].slice(0, 24));
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  };

  const onLogoFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      alert("Logo is larger than 1.5 MB — please pick a smaller image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setDesign((d) => ({ ...d, logo: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const setC = (patch: Partial<ContentState>) => setContent((c) => ({ ...c, ...patch }));
  const setD = (patch: Partial<DesignState>) => setDesign((d) => ({ ...d, ...patch }));

  const headRef = useReveal<HTMLDivElement>();
  const deckRef = useReveal<HTMLDivElement>();
  const prevRef = useReveal<HTMLDivElement>();

  /* ================================================================== */

  return (
    <section id="generator" className="relative overflow-hidden">
      {/* ambient decor */}
      <svg
        viewBox="0 0 200 200"
        className="pointer-events-none absolute -right-16 -top-16 h-[340px] w-[340px] text-ink/[0.06]"
        fill="currentColor"
        aria-hidden
      >
        {[0, 1, 2, 3, 4, 5, 6].map((r) =>
          [0, 1, 2, 3, 4, 5, 6].map((c) =>
            (r * 7 + c * 13 + r * c) % 3 === 0 ? (
              <rect key={`${r}-${c}`} x={10 + c * 26} y={10 + r * 26} width="20" height="20" rx="4" />
            ) : null
          )
        )}
      </svg>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
        {/* heading */}
        <div ref={headRef} className="reveal mb-10 grid items-end gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-verm">
              /// 01 · The workbench — free, no signup for static codes
            </p>
            <h1 className="font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
              Make a QR code{" "}
              <span className="relative inline-block">
                people
                <svg viewBox="0 0 120 12" className="absolute -bottom-1 left-0 w-full" aria-hidden>
                  <path d="M3 9c30-6 60-6 114-3" stroke="#e4572e" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>{" "}
              actually scan.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink-soft">
              Paste a link, dress it in your brand — colors, shapes, logo, sticker — and download
              print-ready files in seconds. Dynamic codes stay editable forever.
            </p>
          </div>
          <ol className="hidden gap-0 lg:flex">
            {["Paste content", "Design & brand it", "Download or track"].map((s, i) => (
              <li key={s} className="flex items-center">
                <div className="card-hard-sm rounded-md bg-cream px-4 py-3">
                  <span className="block font-mono text-[10px] tracking-widest text-verm">STEP 0{i + 1}</span>
                  <span className="font-display text-sm font-bold">{s}</span>
                </div>
                {i < 2 && (
                  <svg viewBox="0 0 24 24" className="mx-1 h-5 w-5 shrink-0 text-ink" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M4 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1.04fr_0.96fr]">
          {/* ================= CONTROL DECK ================= */}
          <div ref={deckRef} className="reveal space-y-6">
            {/* --- content card --- */}
            <div className="card-hard rounded-xl bg-cream">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-[1.5px] border-ink px-5 py-3.5">
                <h2 className="font-mono text-xs uppercase tracking-[0.22em]">
                  <span className="text-verm">01</span> · Content
                </h2>
                <div className="flex flex-wrap gap-1">
                  {CONTENT_TABS.map((t) => {
                    const Ic = TAB_ICON[t.id];
                    const active = content.type === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setC({ type: t.id })}
                        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold transition-all ${
                          active
                            ? "bg-ink text-lime shadow-[2px_2px_0_0_#c9e964]"
                            : "text-ink-soft hover:bg-sage"
                        }`}
                      >
                        <Ic className="h-3.5 w-3.5" />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-2">
                {content.type === "url" && (
                  <Field label="Website or page URL" className="sm:col-span-2">
                    <input
                      className={inputCls}
                      value={content.url}
                      onChange={(e) => setC({ url: e.target.value })}
                      placeholder="https://yourbrand.com/offer"
                      spellCheck={false}
                    />
                  </Field>
                )}
                {content.type === "text" && (
                  <Field label="Your text (up to 300 chars)" className="sm:col-span-2">
                    <textarea
                      className={`${inputCls} min-h-24 resize-y`}
                      maxLength={300}
                      value={content.text}
                      onChange={(e) => setC({ text: e.target.value })}
                      placeholder="Wi‑Fi password, serial number, a secret note…"
                    />
                  </Field>
                )}
                {content.type === "wifi" && (
                  <>
                    <Field label="Network name (SSID)">
                      <input className={inputCls} value={content.wifi.ssid} onChange={(e) => setC({ wifi: { ...content.wifi, ssid: e.target.value } })} placeholder="Café Lumière" />
                    </Field>
                    <Field label="Password">
                      <input className={inputCls} type="text" value={content.wifi.password} onChange={(e) => setC({ wifi: { ...content.wifi, password: e.target.value } })} placeholder="••••••••" />
                    </Field>
                    <Field label="Encryption">
                      <div className="flex gap-1.5">
                        {(["WPA", "WEP", "nopass"] as const).map((enc) => (
                          <button
                            key={enc}
                            onClick={() => setC({ wifi: { ...content.wifi, encryption: enc } })}
                            className={`flex-1 rounded-md border-[1.5px] border-ink px-2 py-2 text-xs font-bold transition ${
                              content.wifi.encryption === enc ? "bg-ink text-lime" : "bg-white hover:bg-sage"
                            }`}
                          >
                            {enc === "nopass" ? "Open" : enc}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <Field label="Hidden network">
                      <button
                        onClick={() => setC({ wifi: { ...content.wifi, hidden: !content.wifi.hidden } })}
                        className={`w-full rounded-md border-[1.5px] border-ink px-3 py-2 text-xs font-bold transition ${
                          content.wifi.hidden ? "bg-verm text-white" : "bg-white hover:bg-sage"
                        }`}
                      >
                        {content.wifi.hidden ? "Yes — SSID is hidden" : "No — visible SSID"}
                      </button>
                    </Field>
                  </>
                )}
                {content.type === "email" && (
                  <>
                    <Field label="Recipient" className="sm:col-span-2">
                      <input className={inputCls} type="email" value={content.email.to} onChange={(e) => setC({ email: { ...content.email, to: e.target.value } })} placeholder="hello@yourbrand.com" />
                    </Field>
                    <Field label="Subject">
                      <input className={inputCls} value={content.email.subject} onChange={(e) => setC({ email: { ...content.email, subject: e.target.value } })} placeholder="Partnership idea" />
                    </Field>
                    <Field label="Body (optional)">
                      <input className={inputCls} value={content.email.body} onChange={(e) => setC({ email: { ...content.email, body: e.target.value } })} placeholder="Hi! I'd love to…" />
                    </Field>
                  </>
                )}
                {content.type === "phone" && (
                  <Field label="Phone number (with country code)" className="sm:col-span-2">
                    <input className={inputCls} value={content.phone} onChange={(e) => setC({ phone: e.target.value })} placeholder="+1 415 555 0134" />
                  </Field>
                )}
                {content.type === "sms" && (
                  <>
                    <Field label="Phone number">
                      <input className={inputCls} value={content.sms.number} onChange={(e) => setC({ sms: { ...content.sms, number: e.target.value } })} placeholder="+1 415 555 0134" />
                    </Field>
                    <Field label="Prefilled message">
                      <input className={inputCls} value={content.sms.message} onChange={(e) => setC({ sms: { ...content.sms, message: e.target.value } })} placeholder="BOOK TABLE for 2" />
                    </Field>
                  </>
                )}
                {content.type === "vcard" && (
                  <>
                    <Field label="First name">
                      <input className={inputCls} value={content.vcard.firstName} onChange={(e) => setC({ vcard: { ...content.vcard, firstName: e.target.value } })} placeholder="Ada" />
                    </Field>
                    <Field label="Last name">
                      <input className={inputCls} value={content.vcard.lastName} onChange={(e) => setC({ vcard: { ...content.vcard, lastName: e.target.value } })} placeholder="Lovelace" />
                    </Field>
                    <Field label="Company">
                      <input className={inputCls} value={content.vcard.org} onChange={(e) => setC({ vcard: { ...content.vcard, org: e.target.value } })} placeholder="Analytical Engines Inc." />
                    </Field>
                    <Field label="Job title">
                      <input className={inputCls} value={content.vcard.title} onChange={(e) => setC({ vcard: { ...content.vcard, title: e.target.value } })} placeholder="Chief Algorithm Officer" />
                    </Field>
                    <Field label="Phone">
                      <input className={inputCls} value={content.vcard.phone} onChange={(e) => setC({ vcard: { ...content.vcard, phone: e.target.value } })} placeholder="+44 20 7946 0810" />
                    </Field>
                    <Field label="Email">
                      <input className={inputCls} value={content.vcard.email} onChange={(e) => setC({ vcard: { ...content.vcard, email: e.target.value } })} placeholder="ada@engines.io" />
                    </Field>
                    <Field label="Website" className="sm:col-span-2">
                      <input className={inputCls} value={content.vcard.website} onChange={(e) => setC({ vcard: { ...content.vcard, website: e.target.value } })} placeholder="https://ada.dev" />
                    </Field>
                  </>
                )}

                {/* dynamic toggle */}
                <div className="flex items-center justify-between gap-4 rounded-lg border-[1.5px] border-dashed border-ink/60 bg-paper px-4 py-3 sm:col-span-2">
                  <div>
                    <p className="text-sm font-bold">
                      Make dynamic{" "}
                      <span className="ml-1 rounded bg-lime px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider">
                        recommended
                      </span>
                    </p>
                    <p className="text-xs text-ink-soft">
                      Edit destination after printing + unlock scan analytics.
                    </p>
                  </div>
                  <button
                    role="switch"
                    aria-checked={dynamic}
                    onClick={() => setDynamic((v) => !v)}
                    className={`relative h-7 w-[52px] shrink-0 rounded-full border-[1.5px] border-ink transition-colors ${
                      dynamic ? "bg-moss" : "bg-white"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full border-[1.5px] border-ink bg-lime transition-all ${
                        dynamic ? "left-[26px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* --- design card --- */}
            <div className="card-hard rounded-xl bg-cream">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-[1.5px] border-ink px-5 py-3.5">
                <h2 className="font-mono text-xs uppercase tracking-[0.22em]">
                  <span className="text-verm">02</span> · Design, color & decorate
                </h2>
                <div className="flex gap-1">
                  {(["sticker", "color", "shape", "logo"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setDesignTab(t)}
                      className={`rounded-md px-3 py-1.5 text-xs font-bold capitalize transition ${
                        designTab === t ? "bg-ink text-lime shadow-[2px_2px_0_0_#c9e964]" : "text-ink-soft hover:bg-sage"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5">
                {/* STICKER */}
                {designTab === "sticker" && (
                  <div>
                    <p className="mb-3 text-sm text-ink-soft">
                      A call-to-action frame lifts scan rates by up to <strong className="text-ink">+34%</strong>.
                      Pick one — it renders on the preview and on the sticker PNG export.
                    </p>
                    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                      {STICKERS.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setStickerId(s.id)}
                          className={`group rounded-lg border-[1.5px] p-2 transition-all ${
                            stickerId === s.id
                              ? "border-ink bg-sage shadow-[3px_3px_0_0_#141a12]"
                              : "border-ink/25 bg-white hover:border-ink"
                          }`}
                        >
                          {s.id === "none" ? (
                            <div className="flex aspect-square items-center justify-center rounded-md border-[1.5px] border-dashed border-ink/40">
                              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">Bare</span>
                            </div>
                          ) : (
                            <div
                              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-md p-1"
                              style={{ backgroundColor: s.bg }}
                            >
                              <div className="grid h-8 w-8 grid-cols-3 gap-[2px] rounded-sm bg-white p-1">
                                {Array.from({ length: 9 }).map((_, i) => (
                                  <span key={i} className={`rounded-[1px] ${[0, 2, 4, 6, 8].includes(i) ? "bg-ink" : "bg-transparent"}`} />
                                ))}
                              </div>
                              <span className="font-mono text-[8px] font-bold tracking-widest" style={{ color: s.fg }}>
                                {s.text}
                              </span>
                            </div>
                          )}
                          <span className="mt-1.5 block text-center text-[11px] font-semibold text-ink-soft group-hover:text-ink">
                            {s.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* COLOR */}
                {designTab === "color" && (
                  <div className="space-y-5">
                    <div className="flex flex-wrap gap-2">
                      {COLOR_PRESETS.map((p) => (
                        <button
                          key={p.name}
                          title={p.name}
                          onClick={() => setD({ fg: p.fg, bg: p.bg, gradient: false })}
                          className={`flex items-center gap-1.5 rounded-full border-[1.5px] px-2 py-1.5 transition hover:shadow-[2px_2px_0_0_#141a12] ${
                            !design.gradient && design.fg === p.fg && design.bg === p.bg
                              ? "border-ink bg-sage"
                              : "border-ink/30 bg-white"
                          }`}
                        >
                          <span className="h-4 w-4 rounded-full border border-ink" style={{ background: p.fg }} />
                          <span className="h-4 w-4 rounded-full border border-ink" style={{ background: p.bg }} />
                          <span className="pr-1 text-[11px] font-semibold">{p.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Foreground">
                        <div className="flex items-center gap-2">
                          <input type="color" value={design.fg} onChange={(e) => setD({ fg: e.target.value })} className="h-10 w-14" />
                          <input className={inputCls} value={design.fg} onChange={(e) => setD({ fg: e.target.value })} spellCheck={false} />
                        </div>
                      </Field>
                      <Field label="Background">
                        <div className="flex items-center gap-2">
                          <input type="color" value={design.bg} onChange={(e) => setD({ bg: e.target.value })} className="h-10 w-14" />
                          <input className={inputCls} value={design.bg} onChange={(e) => setD({ bg: e.target.value })} spellCheck={false} />
                        </div>
                      </Field>
                    </div>

                    <div className="rounded-lg border-[1.5px] border-ink/25 bg-paper p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold">Gradient foreground</p>
                        <button
                          role="switch"
                          aria-checked={design.gradient}
                          onClick={() => setD({ gradient: !design.gradient })}
                          className={`relative h-6 w-11 rounded-full border-[1.5px] border-ink transition-colors ${design.gradient ? "bg-moss" : "bg-white"}`}
                        >
                          <span className={`absolute top-0.5 h-4 w-4 rounded-full border-[1.5px] border-ink bg-lime transition-all ${design.gradient ? "left-[22px]" : "left-0.5"}`} />
                        </button>
                      </div>
                      {design.gradient && (
                        <div className="mt-3 space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {GRADIENT_PRESETS.map(([a, b]) => (
                              <button
                                key={a + b}
                                onClick={() => setD({ fg: a, fg2: b, gradient: true })}
                                className="h-8 w-14 rounded-md border-[1.5px] border-ink transition hover:scale-110"
                                style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
                                aria-label={`Gradient ${a} to ${b}`}
                              />
                            ))}
                          </div>
                          <Field label="Second stop">
                            <div className="flex items-center gap-2">
                              <input type="color" value={design.fg2} onChange={(e) => setD({ fg2: e.target.value })} className="h-10 w-14" />
                              <input className={inputCls} value={design.fg2} onChange={(e) => setD({ fg2: e.target.value })} spellCheck={false} />
                            </div>
                          </Field>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SHAPE */}
                {designTab === "shape" && (
                  <div className="space-y-5">
                    <div>
                      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">Body dots</p>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                        {DOT_STYLES.map((d) => (
                          <button
                            key={d.id}
                            onClick={() => setD({ dotType: d.id })}
                            className={`flex flex-col items-center gap-1 rounded-lg border-[1.5px] px-1 py-2.5 transition ${
                              design.dotType === d.id
                                ? "border-ink bg-sage shadow-[3px_3px_0_0_#141a12]"
                                : "border-ink/25 bg-white hover:border-ink"
                            }`}
                          >
                            <DotGlyph style={d.id} />
                            <span className="text-[10px] font-semibold leading-tight">{d.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">Eye frames</p>
                        <div className="flex gap-2">
                          {CORNER_SQUARES.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => setD({ cornerSquare: c.id })}
                              title={c.label}
                              className={`flex flex-1 flex-col items-center gap-1 rounded-lg border-[1.5px] py-2.5 transition ${
                                design.cornerSquare === c.id
                                  ? "border-ink bg-sage shadow-[3px_3px_0_0_#141a12]"
                                  : "border-ink/25 bg-white hover:border-ink"
                              }`}
                            >
                              <CornerGlyph style={c.id} />
                              <span className="text-[10px] font-semibold">{c.label.split(" ")[0]}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">Eye pupils</p>
                        <div className="flex gap-2">
                          {CORNER_DOTS.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => setD({ cornerDot: c.id })}
                              title={c.label}
                              className={`flex flex-1 flex-col items-center gap-1 rounded-lg border-[1.5px] py-2.5 transition ${
                                design.cornerDot === c.id
                                  ? "border-ink bg-sage shadow-[3px_3px_0_0_#141a12]"
                                  : "border-ink/25 bg-white hover:border-ink"
                              }`}
                            >
                              <PupilGlyph style={c.id} />
                              <span className="text-[10px] font-semibold">{c.label.split(" ")[0]}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Field label={`Quiet zone — ${design.margin}px`}>
                      <input
                        type="range"
                        min={0}
                        max={48}
                        value={design.margin}
                        onChange={(e) => setD({ margin: Number(e.target.value) })}
                        className="w-full"
                      />
                    </Field>
                  </div>
                )}

                {/* LOGO */}
                {designTab === "logo" && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                      {design.logo ? (
                        <div className="flex items-center gap-3">
                          <img src={design.logo} alt="Logo preview" className="h-16 w-16 rounded-lg border-[1.5px] border-ink bg-white object-contain p-1.5" />
                          <button
                            onClick={() => setD({ logo: null })}
                            className="flex items-center gap-1.5 rounded-md border-[1.5px] border-ink bg-white px-3 py-2 text-xs font-bold transition hover:bg-verm hover:text-white"
                          >
                            <IconTrash className="h-4 w-4" /> Remove
                          </button>
                        </div>
                      ) : (
                        <label className="card-hard-sm flex cursor-pointer items-center gap-2.5 rounded-lg bg-lime px-5 py-3.5 text-sm font-bold transition hover:-translate-y-0.5">
                          <IconUpload className="h-5 w-5" />
                          Upload your logo
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => onLogoFile(e.target.files?.[0])}
                          />
                        </label>
                      )}
                      <p className="flex items-center gap-1.5 text-xs text-ink-soft">
                        <IconSparkle className="h-4 w-4 text-verm" />
                        PNG · JPG · SVG up to 1.5 MB — error correction auto-bumps to level H.
                      </p>
                    </div>
                    {design.logo && (
                      <Field label={`Logo size — ${Math.round(design.logoSize * 100)}%`}>
                        <input
                          type="range"
                          min={18}
                          max={45}
                          value={Math.round(design.logoSize * 100)}
                          onChange={(e) => setD({ logoSize: Number(e.target.value) / 100 })}
                          className="w-full"
                        />
                      </Field>
                    )}
                    <div className="rounded-lg border-[1.5px] border-dashed border-ink/50 bg-paper p-4 text-sm text-ink-soft">
                      <strong className="text-ink">Pro tip:</strong> keep the logo inside 30% of the code width and
                      always test-scan on both iOS and Android before a big print run.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= PREVIEW PANEL ================= */}
          <div ref={prevRef} className="reveal lg:sticky lg:top-28">
            <div className="card-hard rounded-xl bg-ink p-5 text-paper sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-lime">
                  <span className="text-verm">03</span> · Live preview
                </h2>
                <span className="flex items-center gap-2 rounded-full border border-lime/40 px-2.5 py-1 font-mono text-[10px] tracking-widest text-lime">
                  <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-lime" />
                  LIVE · {scansToday} scans today
                </span>
              </div>

              {/* qr stage */}
              <div className="relative mx-auto max-w-[340px]">
                {/* corner ticks */}
                {["-top-2 -left-2 border-t-2 border-l-2", "-top-2 -right-2 border-t-2 border-r-2", "-bottom-2 -left-2 border-b-2 border-l-2", "-bottom-2 -right-2 border-b-2 border-r-2"].map((c) => (
                  <span key={c} className={`pointer-events-none absolute h-5 w-5 border-lime ${c}`} />
                ))}

                <div
                  className={`overflow-hidden rounded-xl transition-shadow duration-300 ${
                    sticker.id !== "none" ? "p-3 pb-2 shadow-[0_18px_40px_rgba(0,0,0,0.45)]" : ""
                  }`}
                  style={sticker.id !== "none" ? { backgroundColor: sticker.bg } : undefined}
                >
                  <div ref={popRef} className="qr-pop">
                    <div className="rounded-lg bg-white p-3">
                      <div ref={previewRef} className="mx-auto flex min-h-[252px] w-full max-w-[280px] items-center justify-center [&>canvas]:!h-auto [&>canvas]:!w-full" />
                    </div>
                    {sticker.id !== "none" && (
                      <p
                        className="py-2 text-center font-mono text-sm font-bold tracking-[0.3em]"
                        style={{ color: sticker.fg }}
                      >
                        {sticker.text}
                      </p>
                    )}
                  </div>
                  {/* scanline */}
                  <div className="pointer-events-none absolute inset-x-3 top-0 h-full overflow-hidden rounded-xl">
                    <div className="scanline absolute inset-x-2 h-[3px] rounded-full bg-verm/90 shadow-[0_0_14px_2px_rgba(228,87,46,0.7)]" />
                  </div>
                </div>
              </div>

              {/* payload inspector */}
              <div className="mt-5 rounded-lg border border-paper/20 bg-paper/[0.06] px-3.5 py-2.5">
                <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-paper/50">Payload · {content.type}</p>
                <p className="mt-1 truncate font-mono text-xs text-lime">
                  {data || "https://qrforge.app"}
                  <span className="blink-caret ml-0.5 inline-block h-3 w-[7px] translate-y-[2px] bg-lime" />
                </p>
              </div>

              {/* short link */}
              {dynamic && (
                <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-lime/40 bg-lime/10 px-3.5 py-2.5">
                  <div className="min-w-0">
                    <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-lime/70">Dynamic short link</p>
                    <p className="truncate font-mono text-sm font-bold text-lime">{shortLink(shortId)}</p>
                  </div>
                  <button
                    onClick={copyShort}
                    className="flex shrink-0 items-center gap-1.5 rounded-md bg-lime px-3 py-2 text-xs font-bold text-ink transition hover:bg-paper"
                  >
                    {copied ? <IconCheck className="h-3.5 w-3.5" /> : <IconCopy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              )}

              {/* name + save */}
              <div className="mt-4 flex gap-2">
                <input
                  className="w-full rounded-md border-[1.5px] border-paper/30 bg-paper/10 px-3 py-2.5 text-sm font-medium text-paper outline-none transition placeholder:text-paper/40 focus:border-lime"
                  placeholder="Name this QR — e.g. “Summer menu — table tents”"
                  value={qrName}
                  onChange={(e) => setQrName(e.target.value)}
                />
                <button
                  onClick={saveQr}
                  className={`flex shrink-0 items-center gap-1.5 rounded-md border-[1.5px] px-3.5 py-2 text-sm font-bold transition ${
                    savedFlash
                      ? "border-lime bg-lime text-ink"
                      : "border-lime/60 text-lime hover:bg-lime hover:text-ink"
                  }`}
                >
                  {savedFlash ? <IconCheck className="h-4 w-4" /> : <IconSave className="h-4 w-4" />}
                  {savedFlash ? "Saved" : "Save"}
                </button>
              </div>

              {/* downloads */}
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <button
                  onClick={downloadPng}
                  className="card-hard-sm col-span-2 flex items-center justify-center gap-2 rounded-md bg-lime px-4 py-3 text-sm font-extrabold text-ink"
                >
                  <IconDownload className="h-4 w-4" /> Download PNG · 1200px
                </button>
                <button
                  onClick={downloadSvg}
                  className="flex items-center justify-center gap-2 rounded-md border-[1.5px] border-paper/40 px-4 py-2.5 text-sm font-bold text-paper transition hover:border-lime hover:text-lime"
                >
                  <IconDownload className="h-4 w-4" /> Vector SVG
                </button>
                <button
                  onClick={downloadSticker}
                  disabled={sticker.id === "none"}
                  className="flex items-center justify-center gap-2 rounded-md border-[1.5px] border-paper/40 px-4 py-2.5 text-sm font-bold text-paper transition enabled:hover:border-verm enabled:hover:text-verm disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <IconSparkle className="h-4 w-4" /> Sticker PNG
                </button>
              </div>
              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-paper/40">
                Print at ≥ 2 × 2 cm · test-scan before mass print
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* hidden hi-res canvas host */}
      <div ref={hiRef} aria-hidden className="pointer-events-none fixed left-[-9999px] top-0 opacity-0" />
    </section>
  );
}

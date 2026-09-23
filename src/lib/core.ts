import { useEffect, useRef, useState } from "react";

/* ============================== types ============================== */

export type ContentType =
  | "url"
  | "text"
  | "wifi"
  | "email"
  | "phone"
  | "sms"
  | "vcard";

export interface WifiContent {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

export interface ContentState {
  type: ContentType;
  url: string;
  text: string;
  wifi: WifiContent;
  email: { to: string; subject: string; body: string };
  phone: string;
  sms: { number: string; message: string };
  vcard: {
    firstName: string;
    lastName: string;
    org: string;
    title: string;
    phone: string;
    email: string;
    website: string;
  };
}

export type DotStyleId =
  | "square"
  | "rounded"
  | "extra-rounded"
  | "dots"
  | "classy"
  | "classy-rounded";

export type CornerStyleId = "square" | "extra-rounded" | "dot";
export type CornerDotId = "square" | "dot";

export interface DesignState {
  fg: string;
  fg2: string;
  bg: string;
  gradient: boolean;
  dotType: DotStyleId;
  cornerSquare: CornerStyleId;
  cornerDot: CornerDotId;
  margin: number;
  logo: string | null;
  logoSize: number;
}

export interface StickerStyle {
  id: string;
  label: string;
  text: string;
  bg: string;
  fg: string;
}

export interface SavedQR {
  id: string;
  name: string;
  data: string;
  type: ContentType;
  dynamic: boolean;
  shortId: string;
  design: DesignState;
  stickerId: string;
  createdAt: number;
  scans: number;
}

/* ============================ defaults ============================= */

export const DEFAULT_CONTENT: ContentState = {
  type: "url",
  url: "https://qrforge.app/welcome",
  text: "",
  wifi: { ssid: "", password: "", encryption: "WPA", hidden: false },
  email: { to: "", subject: "", body: "" },
  phone: "",
  sms: { number: "", message: "" },
  vcard: {
    firstName: "",
    lastName: "",
    org: "",
    title: "",
    phone: "",
    email: "",
    website: "",
  },
};

export const DEFAULT_DESIGN: DesignState = {
  fg: "#141a12",
  fg2: "#2f6b4a",
  bg: "#fbfbf3",
  gradient: false,
  dotType: "rounded",
  cornerSquare: "extra-rounded",
  cornerDot: "dot",
  margin: 12,
  logo: null,
  logoSize: 0.32,
};

/* ============================ presets ============================== */

export const DOT_STYLES: { id: DotStyleId; label: string }[] = [
  { id: "square", label: "Square" },
  { id: "rounded", label: "Rounded" },
  { id: "extra-rounded", label: "Pillow" },
  { id: "dots", label: "Dots" },
  { id: "classy", label: "Classy" },
  { id: "classy-rounded", label: "Soft classy" },
];

export const CORNER_SQUARES: { id: CornerStyleId; label: string }[] = [
  { id: "square", label: "Square eyes" },
  { id: "extra-rounded", label: "Round eyes" },
  { id: "dot", label: "Orbit eyes" },
];

export const CORNER_DOTS: { id: CornerDotId; label: string }[] = [
  { id: "square", label: "Square pupil" },
  { id: "dot", label: "Round pupil" },
];

export const COLOR_PRESETS: { fg: string; bg: string; name: string }[] = [
  { name: "Classic press", fg: "#141a12", bg: "#fbfbf3" },
  { name: "Pine on cream", fg: "#1c4a34", bg: "#f6f4e4" },
  { name: "Vermilion", fg: "#e4572e", bg: "#fdf3ec" },
  { name: "Deep teal", fg: "#177e71", bg: "#ecf6f2" },
  { name: "Ink on lime", fg: "#141a12", bg: "#c9e964" },
  { name: "Amber heat", fg: "#8a4b08", bg: "#fbe9c8" },
];

export const GRADIENT_PRESETS: [string, string][] = [
  ["#1c4a34", "#c9e964"],
  ["#e4572e", "#f2a93b"],
  ["#177e71", "#8fd6c8"],
  ["#141a12", "#5b6b52"],
  ["#7a1fa0", "#e4572e"],
];

export const STICKERS: StickerStyle[] = [
  { id: "none", label: "Bare", text: "", bg: "", fg: "" },
  { id: "scan", label: "Scan me", text: "SCAN ME", bg: "#e4572e", fg: "#fbfbf3" },
  { id: "visit", label: "Visit us", text: "VISIT US", bg: "#1c4a34", fg: "#c9e964" },
  { id: "menu", label: "Our menu", text: "OUR MENU", bg: "#f2a93b", fg: "#141a12" },
  { id: "follow", label: "Follow", text: "FOLLOW US", bg: "#177e71", fg: "#fbfbf3" },
  { id: "order", label: "Order now", text: "ORDER NOW", bg: "#141a12", fg: "#c9e964" },
  { id: "wifi", label: "Free wifi", text: "FREE WIFI", bg: "#2f6b4a", fg: "#fbfbf3" },
];

export const CONTENT_TABS: { id: ContentType; label: string }[] = [
  { id: "url", label: "URL" },
  { id: "text", label: "Text" },
  { id: "wifi", label: "WiFi" },
  { id: "vcard", label: "vCard" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "sms", label: "SMS" },
];

/* ======================= content → payload ========================= */

const escWifi = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");

export function buildContent(c: ContentState): string {
  try {
    switch (c.type) {
      case "url": {
        let u = c.url.trim();
        if (!u) return "";
        if (!/^[a-z][a-z0-9+.-]*:/i.test(u)) u = "https://" + u;
        return u;
      }
    case "text":
      return c.text.trim();
    case "wifi":
      if (!c.wifi.ssid.trim()) return "";
      return `WIFI:T:${c.wifi.encryption === "nopass" ? "nopass" : c.wifi.encryption};S:${escWifi(c.wifi.ssid)};${
        c.wifi.encryption === "nopass" ? "" : `P:${escWifi(c.wifi.password)};`
      }${c.wifi.hidden ? "H:true;" : ""};`;
    case "email": {
      const params: string[] = [];
      if (c.email.subject.trim())
        params.push(`subject=${encodeURIComponent(c.email.subject.trim())}`);
      if (c.email.body.trim())
        params.push(`body=${encodeURIComponent(c.email.body.trim())}`);
      return `mailto:${c.email.to.trim()}${params.length ? "?" + params.join("&") : ""}`;
    }
    case "phone": {
      const n = c.phone.replace(/[^\d+]/g, "");
      return n ? `tel:${n}` : "";
    }
    case "sms": {
      const n = c.sms.number.replace(/[^\d+]/g, "");
      if (!n) return "";
      return `sms:${n}${c.sms.message.trim() ? `?body=${encodeURIComponent(c.sms.message.trim())}` : ""}`;
    }
    case "vcard": {
      const v = c.vcard;
      if (!v.firstName.trim() && !v.lastName.trim()) return "";
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${v.lastName};${v.firstName};;;`,
        `FN:${[v.firstName, v.lastName].filter(Boolean).join(" ")}`,
        v.org.trim() && `ORG:${v.org.trim()}`,
        v.title.trim() && `TITLE:${v.title.trim()}`,
        v.phone.trim() && `TEL;TYPE=CELL:${v.phone.trim()}`,
        v.email.trim() && `EMAIL:${v.email.trim()}`,
        v.website.trim() && `URL:${v.website.trim()}`,
        "END:VCARD",
      ];
      return lines.filter((l): l is string => Boolean(l)).join("\n");
    }
  }
  } catch (error) {
    console.error("[QRForge] Error building content:", error);
    return "";
  }
}

export function makeShortId(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export const shortLink = (id: string) => `qrfg.io/${id}`;

/* ============================= hooks =============================== */

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-revealed");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("is-revealed");
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export function useCountUp(target: number, start: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration, reduced]);
  return value;
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* storage full / private mode */
    }
  }, [key, state]);
  return [state, setState] as const;
}

export function formatNumber(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return Math.round(n).toString();
}

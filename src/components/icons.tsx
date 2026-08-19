import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

/* ------------------------------- brand ------------------------------ */

export const LogoMark = (props: P) => (
  <svg viewBox="0 0 32 32" aria-hidden {...props}>
    <rect width="32" height="32" rx="7" fill="#141a12" />
    <rect x="6" y="6" width="8.5" height="8.5" rx="2" fill="#c9e964" />
    <rect x="17.5" y="6" width="8.5" height="8.5" rx="2" fill="#f4f4ec" />
    <rect x="6" y="17.5" width="8.5" height="8.5" rx="2" fill="#f4f4ec" />
    <rect x="8.4" y="8.4" width="3.7" height="3.7" rx="0.8" fill="#141a12" />
    <rect x="19.9" y="8.4" width="3.7" height="3.7" rx="0.8" fill="#141a12" />
    <rect x="8.4" y="19.9" width="3.7" height="3.7" rx="0.8" fill="#141a12" />
    <rect x="17.5" y="17.5" width="4" height="4" rx="1" fill="#e4572e" />
    <rect x="24" y="17.5" width="2" height="2" fill="#c9e964" />
    <rect x="17.5" y="24" width="2" height="2" fill="#c9e964" />
    <rect x="24" y="24" width="2" height="2" fill="#f4f4ec" />
  </svg>
);

/* ----------------------------- solutions ---------------------------- */

export const IconBusinessCard = (props: P) => (
  <svg {...base(props)}>
    <rect x="2.5" y="5" width="19" height="14" rx="2" />
    <circle cx="8" cy="11" r="2.2" />
    <path d="M4.8 16.4c.6-1.7 1.8-2.5 3.2-2.5s2.6.8 3.2 2.5" />
    <path d="M14.5 9.5h4.5M14.5 12.5h4.5M14.5 15.5h2.8" />
  </svg>
);

export const IconVCardPlus = (props: P) => (
  <svg {...base(props)}>
    <rect x="2.5" y="4.5" width="16" height="12.5" rx="2" />
    <circle cx="7.5" cy="9.5" r="1.9" />
    <path d="M4.6 14.4c.5-1.5 1.6-2.2 2.9-2.2s2.4.7 2.9 2.2" />
    <path d="M11.5 8h4M11.5 10.8h3" />
    <circle cx="18.5" cy="17.5" r="3.6" fill="#c9e964" stroke="currentColor" />
    <path d="M18.5 15.9v3.2M16.9 17.5h3.2" />
  </svg>
);

export const IconLink = (props: P) => (
  <svg {...base(props)}>
    <path d="M10 14a4.5 4.5 0 0 0 6.4.4l3-3a4.5 4.5 0 0 0-6.3-6.3l-1.7 1.7" />
    <path d="M14 10a4.5 4.5 0 0 0-6.4-.4l-3 3a4.5 4.5 0 0 0 6.3 6.3l1.7-1.7" />
  </svg>
);

export const IconPdf = (props: P) => (
  <svg {...base(props)}>
    <path d="M6 2.8h8l4 4.2v13.2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.8a1 1 0 0 1 1-1Z" />
    <path d="M14 2.8V7h4" />
    <rect x="3" y="12" width="12.5" height="6" rx="1" fill="#e4572e" stroke="none" />
    <path d="M5 15h2.2M5 13.6v2.8M10.4 13.6v2.8h1.4a1.1 1.1 0 0 0 0-2.2h-1.4" stroke="#fbfbf3" strokeWidth="1.1" />
  </svg>
);

export const IconPaw = (props: P) => (
  <svg {...base(props)}>
    <ellipse cx="6" cy="9.2" rx="1.8" ry="2.3" />
    <ellipse cx="18" cy="9.2" rx="1.8" ry="2.3" />
    <ellipse cx="9.6" cy="5.6" rx="1.9" ry="2.4" />
    <ellipse cx="14.4" cy="5.6" rx="1.9" ry="2.4" />
    <path d="M12 11c-3.2 0-5.8 2.6-5.8 5.2 0 1.6 1.2 2.7 2.8 2.7 1.2 0 2-.6 3-.6s1.8.6 3 .6c1.6 0 2.8-1.1 2.8-2.7C17.8 13.6 15.2 11 12 11Z" />
  </svg>
);

export const IconStorefront = (props: P) => (
  <svg {...base(props)}>
    <path d="M3.5 9 5 3.8h14L20.5 9" />
    <path d="M3.5 9a2.6 2.6 0 0 0 5.2 0 2.7 2.7 0 0 0 5.4 0 2.6 2.6 0 0 0 5.2 0" />
    <path d="M4.5 11.5v8h15v-8" />
    <path d="M9.5 19.5v-5h5v5" />
  </svg>
);

export const IconMapPin = (props: P) => (
  <svg {...base(props)}>
    <path d="M12 21.5s-7-6.4-7-11.5a7 7 0 0 1 14 0c0 5.1-7 11.5-7 11.5Z" />
    <circle cx="12" cy="9.8" r="2.6" />
    <path d="M12 8.4v2.8M10.6 9.8h2.8" strokeWidth="1.3" />
  </svg>
);

export const IconStarBadge = (props: P) => (
  <svg {...base(props)}>
    <path d="M12 2.8 14.4 5l3.2-.3.5 3.2 2.7 1.8-1.4 2.9 1.4 2.9-2.7 1.8-.5 3.2-3.2-.3L12 22l-2.4-2.2-3.2.3-.5-3.2-2.7-1.8 1.4-2.9L3.2 9.7l2.7-1.8.5-3.2L9.6 5 12 2.8Z" />
    <path d="m9.2 12.2 2 2 3.8-4.2" />
  </svg>
);

export const IconGallery = (props: P) => (
  <svg {...base(props)}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m3.5 17 5-5 3.5 3.5L15.5 12l5 5" />
  </svg>
);

export const IconMenuCard = (props: P) => (
  <svg {...base(props)}>
    <path d="M4 3.5h16v17l-2.7-1.8-2.6 1.8-2.7-1.8-2.7 1.8-2.6-1.8L4 20.5v-17Z" />
    <path d="M7.5 8h9M7.5 11.5h9M7.5 15h5.5" />
  </svg>
);

export const IconForm = (props: P) => (
  <svg {...base(props)}>
    <rect x="3.5" y="3" width="17" height="18" rx="2" />
    <path d="M7 8h4M7 12h10M7 16h10" />
    <rect x="14" y="6.6" width="3" height="2.8" rx="0.6" fill="#c9e964" stroke="none" />
  </svg>
);

export const IconMultiUrl = (props: P) => (
  <svg {...base(props)}>
    <circle cx="6" cy="12" r="2.6" />
    <circle cx="17.5" cy="5.5" r="2.4" />
    <circle cx="17.5" cy="18.5" r="2.4" />
    <path d="M8.4 10.8 15.3 6.6M8.4 13.2l6.9 4.2" />
  </svg>
);

/* ------------------------------ security ----------------------------- */

export const IconShieldCheck = (props: P) => (
  <svg {...base(props)}>
    <path d="M12 2.8 4.5 5.6v6c0 4.7 3.2 8 7.5 9.6 4.3-1.6 7.5-4.9 7.5-9.6v-6L12 2.8Z" />
    <path d="m8.7 11.8 2.4 2.4 4.4-4.8" />
  </svg>
);

export const IconLock = (props: P) => (
  <svg {...base(props)}>
    <rect x="4.5" y="10" width="15" height="11" rx="2" />
    <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
    <path d="M12 14v3" />
    <circle cx="12" cy="14" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconFingerprint = (props: P) => (
  <svg {...base(props)}>
    <path d="M7 5.2A8 8 0 0 1 12 3.5c1.9 0 3.6.6 5 1.7" />
    <path d="M4.6 9.6A8 8 0 0 1 6 7.5M19.4 9.5c.1.7.1 1.4.1 2.1 0 1.8-.2 3.6-.7 5.2" />
    <path d="M8 20.2c1.4-1 2.2-2.7 2.4-4.6.5-3.4.3-5.6-.4-7.1" />
    <path d="M12 8.5c2.6.6 3.8 3 3.4 6.9-.2 1.8-.6 3.4-1.3 4.8" />
    <path d="M12 12.5c.3 1.9 0 4.3-1 6.3" />
  </svg>
);

export const IconKeypad = (props: P) => (
  <svg {...base(props)}>
    <rect x="4" y="3" width="16" height="18" rx="2.5" />
    <path d="M8.2 8h.01M12 8h.01M15.8 8h.01M8.2 12h.01M12 12h.01M15.8 12h.01M8.2 16h.01M12 16h.01" strokeWidth="2.6" />
    <path d="M14.8 16h2" />
  </svg>
);

export const IconGdpr = (props: P) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.2c-2.7 0-4.6 2-4.6 4.8s1.9 4.8 4.6 4.8c1.9 0 3.3-.9 4.1-2.3" />
    <path d="M15.5 12.5h-3.2" />
  </svg>
);

export const IconDocSeal = (props: P) => (
  <svg {...base(props)}>
    <path d="M6 2.8h8l4 4.2v13.2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.8a1 1 0 0 1 1-1Z" />
    <path d="M14 2.8V7h4" />
    <circle cx="10" cy="13" r="2.4" />
    <path d="m8.8 15 .8 4 1.4-1 1.4 1 .8-4" />
  </svg>
);

/* ------------------------------ features ----------------------------- */

export const IconScanUp = (props: P) => (
  <svg {...base(props)}>
    <path d="M3 5.5V4a1.5 1.5 0 0 1 1.5-1.5H6M18 2.5h1.5A1.5 1.5 0 0 1 21 4v1.5M21 18v1.5a1.5 1.5 0 0 1-1.5 1.5H18M6 21H4.5A1.5 1.5 0 0 1 3 19.5V18" />
    <path d="m6.5 15.5 3.8-3.8 2.5 2.5 4.7-4.7" />
    <path d="M14 9.5h3.5V13" />
  </svg>
);

export const IconChart = (props: P) => (
  <svg {...base(props)}>
    <path d="M3.5 3.5v17h17" />
    <rect x="7" y="12" width="3" height="6" rx="0.6" fill="#c9e964" stroke="none" />
    <rect x="12" y="8" width="3" height="10" rx="0.6" fill="#e4572e" stroke="none" />
    <rect x="17" y="5" width="3" height="13" rx="0.6" />
  </svg>
);

export const IconFolders = (props: P) => (
  <svg {...base(props)}>
    <path d="M3 7.5V6a1.5 1.5 0 0 1 1.5-1.5h4L10.5 7h9A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-10Z" />
    <path d="M3 10.5h18" />
    <path d="M7 14.5h4" />
  </svg>
);

export const IconTag = (props: P) => (
  <svg {...base(props)}>
    <path d="m12.7 2.9 8.2 8.2a1.6 1.6 0 0 1 0 2.3l-7.5 7.5a1.6 1.6 0 0 1-2.3 0L2.9 12.7V4.5a1.6 1.6 0 0 1 1.6-1.6h8.2Z" />
    <circle cx="8" cy="8" r="1.6" />
  </svg>
);

export const IconCursor = (props: P) => (
  <svg {...base(props)}>
    <path d="m5 4 14 6.2-6.2 2L10.5 18 5 4Z" />
    <path d="m13.5 13.5 5.5 5.5" />
  </svg>
);

/* --------------------------------- ui -------------------------------- */

export const IconDownload = (props: P) => (
  <svg {...base(props)}>
    <path d="M12 3.5v11M7.5 10 12 14.5 16.5 10" />
    <path d="M4 16.5v3A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5v-3" />
  </svg>
);

export const IconSave = (props: P) => (
  <svg {...base(props)}>
    <path d="M5 3.5h11l3.5 3.5v12a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V5A1.5 1.5 0 0 1 5 3.5Z" />
    <path d="M7.5 3.5V9h8V3.5M7.5 20.5V14h9v6.5" />
  </svg>
);

export const IconTrash = (props: P) => (
  <svg {...base(props)}>
    <path d="M4 6.5h16M9.5 6.5V4.8A1.3 1.3 0 0 1 10.8 3.5h2.4a1.3 1.3 0 0 1 1.3 1.3v1.7M6 6.5l.8 12.7a1.5 1.5 0 0 0 1.5 1.3h7.4a1.5 1.5 0 0 0 1.5-1.3L18 6.5" />
    <path d="M10 10.5v6M14 10.5v6" />
  </svg>
);

export const IconCopy = (props: P) => (
  <svg {...base(props)}>
    <rect x="8.5" y="8.5" width="12" height="12" rx="1.5" />
    <path d="M15.5 5.5v-.7A1.8 1.8 0 0 0 13.7 3H5.3a1.8 1.8 0 0 0-1.8 1.8v8.4a1.8 1.8 0 0 0 1.8 1.8h.7" />
  </svg>
);

export const IconCheck = (props: P) => (
  <svg {...base(props)}>
    <path d="m4.5 12.5 5 5L19.5 7" />
  </svg>
);

export const IconArrowRight = (props: P) => (
  <svg {...base(props)}>
    <path d="M4 12h15M13.5 5.5 20 12l-6.5 6.5" />
  </svg>
);

export const IconArrowUpRight = (props: P) => (
  <svg {...base(props)}>
    <path d="M6.5 17.5 17.5 6.5M8.5 6.5h9v9" />
  </svg>
);

export const IconChevronLeft = (props: P) => (
  <svg {...base(props)}>
    <path d="M14.5 5 7.5 12l7 7" />
  </svg>
);

export const IconChevronRight = (props: P) => (
  <svg {...base(props)}>
    <path d="m9.5 5 7 7-7 7" />
  </svg>
);

export const IconUpload = (props: P) => (
  <svg {...base(props)}>
    <path d="M12 14.5v-11M7.5 8 12 3.5 16.5 8" />
    <path d="M4 16.5v3A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5v-3" />
  </svg>
);

export const IconSparkle = (props: P) => (
  <svg {...base(props)}>
    <path d="M12 3.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5Z" />
    <path d="M19 15.5c.3 1.8 1.2 2.7 3 3-1.8.3-2.7 1.2-3 3-.3-1.8-1.2-2.7-3-3 1.8-.3 2.7-1.2 3-3Z" />
  </svg>
);

export const IconZap = (props: P) => (
  <svg {...base(props)}>
    <path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12l1-8Z" />
  </svg>
);

export const IconCamera = (props: P) => (
  <svg {...base(props)}>
    <path d="M4 8h2.5l1.5-2.5h8L17.5 8H20a1.5 1.5 0 0 1 1.5 1.5V18A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18V9.5A1.5 1.5 0 0 1 4 8Z" />
    <circle cx="12" cy="13.5" r="3.4" />
  </svg>
);

export const IconGlobe = (props: P) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.4 2.2 3.6 5 3.6 8.5s-1.2 6.3-3.6 8.5c-2.4-2.2-3.6-5-3.6-8.5s1.2-6.3 3.6-8.5Z" />
  </svg>
);

export const IconMail = (props: P) => (
  <svg {...base(props)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7.5 8 6 8-6" />
  </svg>
);

export const IconPhone = (props: P) => (
  <svg {...base(props)}>
    <path d="M7.6 3.5c.5 0 1 .3 1.2.8l1.3 2.9c.2.5.1 1.1-.3 1.5L8.4 10a12.6 12.6 0 0 0 5.6 5.6l1.3-1.4c.4-.4 1-.5 1.5-.3l2.9 1.3c.5.2.8.7.8 1.2v2.4c0 .9-.7 1.7-1.7 1.6C10.5 19.7 4.3 13.5 3.5 5.2c-.1-1 .7-1.7 1.6-1.7h2.5Z" />
  </svg>
);

export const IconWifi = (props: P) => (
  <svg {...base(props)}>
    <path d="M2.5 8.8a14 14 0 0 1 19 0M5.5 12.2a9.5 9.5 0 0 1 13 0M8.6 15.5a5 5 0 0 1 6.8 0" />
    <circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const IconMessage = (props: P) => (
  <svg {...base(props)}>
    <path d="M12 3.5c-5 0-9 3.2-9 7.2 0 1.9.9 3.7 2.4 5L4.5 20l4-1.5c1.1.3 2.3.5 3.5.5 5 0 9-3.2 9-7.2s-4-7.8-9-7.8Z" />
    <path d="M8 11h.01M12 11h.01M16 11h.01" strokeWidth="2.6" />
  </svg>
);

export const IconUserCard = (props: P) => (
  <svg {...base(props)}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20.5c.9-4 3.9-6 7.5-6s6.6 2 7.5 6" />
  </svg>
);

export const IconType = (props: P) => (
  <svg {...base(props)}>
    <path d="M5 7V4.5h14V7M12 4.5v15M8.5 19.5h7" />
  </svg>
);

export const IconMenuBurger = (props: P) => (
  <svg {...base(props)}>
    <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h11" />
  </svg>
);

export const IconClose = (props: P) => (
  <svg {...base(props)}>
    <path d="m5.5 5.5 13 13M18.5 5.5l-13 13" />
  </svg>
);

export const IconQuote = (props: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M4 5.5h6.5V12c0 4-2.3 6.4-6.5 7v-3.4c1.8-.5 2.8-1.7 3-3.6H4V5.5Zm9.5 0H20V12c0 4-2.3 6.4-6.5 7v-3.4c1.8-.5 2.8-1.7 3-3.6h-3V5.5Z" />
  </svg>
);

/* ------------------------------- socials ------------------------------ */

export const IconX = (props: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M17.6 3H21l-7.3 8.3L22 21h-6.6l-5.2-6.2L4.3 21H1l7.8-8.9L1.5 3h6.8l4.7 5.7L17.6 3Zm-1.2 16h1.8L7.1 4.9H5.2L16.4 19Z" />
  </svg>
);

export const IconLinkedIn = (props: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.5c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9V21h-4V9Z" />
  </svg>
);

export const IconYouTube = (props: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.5.4 7.8.4 7.8.4s6.3 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.2V8.8l5.2 3.2L10 15.2Z" />
  </svg>
);

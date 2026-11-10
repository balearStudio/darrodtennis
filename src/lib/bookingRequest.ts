/**
 * Delivery for booking requests (`BookingMock`) and contact enquiries
 * (`EnquiryForm`).
 *
 * The site is a static export on GitHub Pages, so there is no server to send
 * mail from: the browser POSTs the request straight to Web3Forms, which relays
 * it as an email to the academy inbox. The access key is public by design (it
 * only authorises "send a mail to the address this key is bound to"), but it
 * still lives in an env var so it is not baked into the repo — set
 * `NEXT_PUBLIC_WEB3FORMS_KEY` locally in `.env.local` and as a repo secret for
 * the deploy workflow.
 *
 * With no key configured the request falls back to opening the visitor's own
 * mail client with the same structured body, so the flow is never a dead end.
 */

import { CONTACT } from "@/lib/site";

const ENDPOINT = "https://api.web3forms.com/submit";

export const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

export type RequestedSession = {
  /** `YYYY-MM-DD`, for the machine-readable line. */
  date: string;
  time: string;
  /** Localised day label, e.g. "miércoles, 10 sept". */
  label: string;
};

export type BookingRequest = {
  locale: string;
  name: string;
  email: string;
  /** Localised country name. */
  country: string;
  countryCode: string;
  /** Dial code, digits only. */
  dial: string;
  phone: string;
  comment: string;
  classType: string;
  players: number;
  sessions: RequestedSession[];
};

export type SendOutcome =
  | { ok: true; via: "email" | "mailto" }
  | { ok: false; error: string };

const fullPhone = (r: BookingRequest) => `+${r.dial} ${r.phone}`.trim();

const sessionLines = (r: BookingRequest) =>
  r.sessions.map((s) => `${s.label} (${s.date}) — ${s.time}`);

/** Plain-text version of the request, used in the mail body and the fallback. */
export function summarise(r: BookingRequest): string {
  return [
    "SOLICITUD DE CLASE / LESSON REQUEST",
    "",
    "— Contacto —",
    `Nombre:     ${r.name}`,
    `Email:      ${r.email}`,
    `Teléfono:   ${fullPhone(r)}`,
    `País:       ${r.country} (${r.countryCode})`,
    `Idioma web: ${r.locale.toUpperCase()}`,
    "",
    "— Clase —",
    `Tipo:       ${r.classType}`,
    `Jugadores:  ${r.players}`,
    "",
    `— Fechas solicitadas (${r.sessions.length}) —`,
    ...sessionLines(r).map((line) => `· ${line}`),
    "",
    "— Comentario —",
    r.comment.trim() || "(sin comentario)",
    "",
  ].join("\n");
}

/**
 * Web3Forms renders every extra key as a labelled row, so the field names are
 * the email's structure. Insertion order is preserved.
 */
function payload(r: BookingRequest) {
  return {
    subject: `Solicitud de clase — ${r.name} (${r.sessions.length} ${
      r.sessions.length === 1 ? "sesión" : "sesiones"
    })`,
    from_name: "Darrod Tennis Academy · Reservas",
    // Web3Forms uses these two for the reply-to header.
    name: r.name,
    email: r.email,
    Nombre: r.name,
    Email: r.email,
    Teléfono: fullPhone(r),
    País: `${r.country} (${r.countryCode})`,
    "Tipo de clase": r.classType,
    Jugadores: String(r.players),
    "Fechas solicitadas": sessionLines(r).join("\n"),
    Comentario: r.comment.trim() || "—",
    "Idioma de la web": r.locale.toUpperCase(),
    Resumen: summarise(r),
  };
}

/** No key configured: open the visitor's mail client with the same body. */
function mailtoFallback(subject: string, body: string): SendOutcome {
  if (typeof window === "undefined") {
    return { ok: false, error: "no-window" };
  }
  window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
  return { ok: true, via: "mailto" };
}

/** POSTs one submission; every key of `fields` becomes a row of the email. */
async function postToWeb3Forms(fields: Record<string, string>): Promise<SendOutcome> {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        ...fields,
        // Honeypot — Web3Forms drops the submission when this is non-empty.
        botcheck: "",
      }),
    });
    const data: { success?: boolean; message?: string } = await res
      .json()
      .catch(() => ({}));
    if (res.ok && data.success) return { ok: true, via: "email" };
    return { ok: false, error: data.message ?? `HTTP ${res.status}` };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "network" };
  }
}

export async function sendBookingRequest(
  r: BookingRequest,
): Promise<SendOutcome> {
  if (!WEB3FORMS_KEY) {
    return mailtoFallback(`Solicitud de clase — ${r.name}`, summarise(r));
  }
  return postToWeb3Forms(payload(r));
}

/**
 * Contact-page enquiry. Option fields (level, schedule, duration) arrive as the
 * labels the visitor saw, so the email reads without decoding; empty optional
 * fields are sent as "—".
 */
export type Enquiry = {
  locale: string;
  name: string;
  phone: string;
  email: string;
  cityCountry: string;
  age: string;
  level: string;
  start: string;
  schedule: string;
  duration: string;
  message: string;
};

function enquiryRows(e: Enquiry): [string, string][] {
  return [
    ["Nombre", e.name],
    ["Email", e.email],
    ["Teléfono", e.phone],
    ["Ciudad y país", e.cityCountry],
    ["Edad", e.age],
    ["Nivel", e.level],
    ["Fecha de inicio", e.start],
    ["Horario", e.schedule],
    ["Tiempo estimado", e.duration],
    ["Mensaje", e.message],
    ["Idioma de la web", e.locale.toUpperCase()],
  ].map(([k, v]) => [k, v.trim() || "—"]);
}

export async function sendEnquiry(e: Enquiry): Promise<SendOutcome> {
  const subject = `Consulta web — ${e.name}`;
  const rows = enquiryRows(e);
  if (!WEB3FORMS_KEY) {
    const body = ["CONSULTA WEB / WEB ENQUIRY", "", ...rows.map(([k, v]) => `${k}: ${v}`)];
    return mailtoFallback(subject, body.join("\n"));
  }
  return postToWeb3Forms({
    subject,
    from_name: "Darrod Tennis Academy · Contacto",
    // Web3Forms uses these two for the reply-to header.
    name: e.name,
    email: e.email,
    ...Object.fromEntries(rows),
  });
}

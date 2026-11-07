"use client";

import { useId, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  CLASS_TYPES,
  classTypeById,
  dateFromKey,
  dateKey,
  firstAvailableDay,
  hasAvailability,
  isMorning,
  isOpenDay,
  monthGrid,
  sameDay,
  slotsForDay,
  startOfDay,
  type ClassTypeId,
} from "@/lib/booking";
import {
  DEFAULT_COUNTRY,
  countryName,
  dialFor,
  localisedCountries,
} from "@/lib/countries";
import { sendBookingRequest } from "@/lib/bookingRequest";
import { CONTACT } from "@/lib/site";

type Props = {
  /** Compact single-column layout for narrow contexts. */
  compact?: boolean;
};

/** One requested slot: a day key (`YYYY-MM-DD`) plus a time on that day. */
type Session = { date: string; time: string };

type Status = "idle" | "sending" | "sent" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function BookingMock({ compact = false }: Props) {
  const t = useTranslations("book.widget");
  const tct = useTranslations("booking.classTypes");
  const locale = useLocale();

  // `false` on the server, `true` after hydration — no effect, no cascading
  // render. The calendar's "today" only exists client-side.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const today = useMemo(() => startOfDay(new Date()), []);
  const [classId, setClassId] = useState<ClassTypeId>("tennis-60");
  const [playersRaw, setPlayersRaw] = useState(1);
  // The month the calendar shows: user overrides via the arrows; otherwise it
  // follows the active day. No effects — everything is derived here.
  const [viewOverride, setViewOverride] = useState<{
    year: number;
    month: number;
  } | null>(null);
  // The day whose times are on screen. The actual picks live in `sessions`.
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [phoneCountry, setPhoneCountry] = useState(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [sentVia, setSentVia] = useState<"email" | "mailto">("email");

  const classType = classTypeById(classId);
  // Player count, clamped to the chosen class type during render.
  const players = Math.min(
    classType.maxPlayers,
    Math.max(classType.minPlayers, playersRaw),
  );

  // First bookable day for the current class type (used as the default).
  const autoDay = useMemo(
    () => (mounted ? firstAvailableDay(classId, today) : null),
    [mounted, classId, today],
  );

  const openDate = openDay ? dateFromKey(openDay) : null;
  const openDayValid =
    openDate &&
    openDate >= today &&
    isOpenDay(openDate) &&
    hasAvailability(openDate, classId);
  const selectedDay = openDayValid ? openDate : autoDay;
  const selectedKey = selectedDay ? dateKey(selectedDay) : null;

  const daySlots = selectedDay ? slotsForDay(selectedDay, classId) : [];

  const anchor = selectedDay ?? today;
  const view =
    viewOverride ?? { year: anchor.getFullYear(), month: anchor.getMonth() };

  const dateFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-GB", {
        weekday: "long",
        day: "numeric",
        month: "short",
      }),
    [locale],
  );

  const countries = useMemo(() => localisedCountries(locale), [locale]);

  const sorted = useMemo(
    () =>
      [...sessions].sort((a, b) =>
        a.date === b.date
          ? a.time.localeCompare(b.time)
          : a.date.localeCompare(b.date),
      ),
    [sessions],
  );

  const months = t.raw("months") as string[];
  const weekdays = t.raw("weekdays") as string[];
  const monthLabel = `${months[view.month] ?? ""} ${view.year}`;
  const monthLabelCap = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  const grid = monthGrid(view.year, view.month);
  const atCurrentMonth =
    view.year === today.getFullYear() && view.month === today.getMonth();

  const morning = daySlots.filter((s) => isMorning(s.time));
  const afternoon = daySlots.filter((s) => !isMorning(s.time));

  const durationLabel = t("duration", { minutes: classType.minutes });
  const playersLabel = `${players} ${players === 1 ? t("playersOne") : t("playersOther")}`;
  const sessionUnit =
    sorted.length === 1 ? t("sessionsOne") : t("sessionsOther");

  function shiftMonth(dir: -1 | 1) {
    const d = new Date(view.year, view.month + dir, 1);
    setViewOverride({ year: d.getFullYear(), month: d.getMonth() });
  }

  function chooseClass(id: ClassTypeId) {
    setClassId(id);
    setViewOverride(null); // snap the calendar back to the new default day
    setOpenDay(null);
    // Time slots differ per class type, so previous picks no longer apply.
    setSessions([]);
  }

  function toggleSlot(time: string) {
    if (!selectedKey) return;
    setSessions((list) => {
      const has = list.some((s) => s.date === selectedKey && s.time === time);
      return has
        ? list.filter((s) => !(s.date === selectedKey && s.time === time))
        : [...list, { date: selectedKey, time }];
    });
    setErrors((e) => ({ ...e, sessions: "" }));
  }

  function removeSession(session: Session) {
    setSessions((list) =>
      list.filter((s) => !(s.date === session.date && s.time === session.time)),
    );
  }

  function chooseCountry(code: string) {
    setCountry(code);
    setPhoneCountry(code); // keep the dial code in step unless it is changed
    setErrors((e) => ({ ...e, country: "" }));
  }

  function reset() {
    setStatus("idle");
    setClassId("tennis-60");
    setPlayersRaw(1);
    setViewOverride(null);
    setOpenDay(null);
    setSessions([]);
    setName("");
    setEmail("");
    setCountry(DEFAULT_COUNTRY);
    setPhoneCountry(DEFAULT_COUNTRY);
    setPhone("");
    setComment("");
    setConsent(false);
    setErrors({});
  }

  function validate() {
    const next: Record<string, string> = {};
    if (sorted.length === 0) next.sessions = t("noSessions");
    if (!name.trim()) next.name = t("required");
    if (!email.trim()) next.email = t("required");
    else if (!EMAIL_RE.test(email.trim())) next.email = t("invalidEmail");
    if (!phone.trim()) next.phone = t("required");
    if (!consent) next.consent = t("acceptTerms");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending" || !validate()) return;
    setStatus("sending");
    const outcome = await sendBookingRequest({
      locale,
      name: name.trim(),
      email: email.trim(),
      country: countryName(country, "en"),
      countryCode: country,
      dial: dialFor(phoneCountry),
      phone: phone.trim(),
      comment,
      classType: tct(`${classId}.name`),
      players,
      sessions: sorted.map((s) => ({
        date: s.date,
        time: s.time,
        label: dateFmt.format(dateFromKey(s.date)),
      })),
    });
    if (outcome.ok) {
      setSentVia(outcome.via);
      setStatus("sent");
    } else {
      setStatus("error");
    }
  }

  const frameBase = "border border-cream/15 bg-[#20241C] text-cream";

  if (!mounted) {
    return (
      <div>
        <WidgetTopBar t={t} />
        <div className={`${frameBase} min-h-[520px] animate-pulse`} />
      </div>
    );
  }

  return (
    <div>
      <WidgetTopBar t={t} />

      <form onSubmit={onSubmit} noValidate className={frameBase}>
        {/* Event header */}
        <div className="flex items-start justify-between gap-4 border-b border-cream/12 px-6 py-6 sm:px-8">
          <div className="min-w-0">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-cream/50">
              Darrod Tennis Academy
            </div>
            <div className="mt-2 text-[1.25rem] tracking-[-0.02em] sm:text-[1.375rem]">
              {tct(`${classId}.name`)} · {durationLabel}
            </div>
            <div className="mt-1 text-[13px] text-cream/55">
              {tct(`${classId}.note`)}
            </div>
          </div>
          <div className="shrink-0 pt-1 text-right font-mono text-[10.5px] uppercase tracking-[0.14em] text-cream/45">
            {playersLabel}
          </div>
        </div>

        {status === "sent" ? (
          <Confirmation
            className="px-6 py-14 sm:px-8"
            title={t("confirmedTitle")}
            body={t("confirmedBody")}
            summary={t("confirmedSummary", {
              classType: tct(`${classId}.name`),
              players: playersLabel,
              count: sorted.length,
              unit: sessionUnit,
            })}
            sessions={sorted.map(
              (s) => `${dateFmt.format(dateFromKey(s.date))} · ${s.time}`,
            )}
            contact={`${name} · ${email} · +${dialFor(phoneCountry)} ${phone}`}
            note={sentVia === "mailto" ? t("mailtoNote") : null}
            resetLabel={t("reset")}
            onReset={reset}
          />
        ) : (
          <>
            {/* Step 1 — class type */}
            <fieldset className="border-b border-cream/12 px-6 pb-6 sm:px-8">
              <legend className={`${legendCls} mb-3.5`}>
                {t("step1Title")}
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {CLASS_TYPES.map((ct) => (
                  <Chip
                    key={ct.id}
                    selected={ct.id === classId}
                    onClick={() => chooseClass(ct.id)}
                  >
                    {tct(`${ct.id}.name`)} · {ct.minutes}′
                  </Chip>
                ))}
              </div>
            </fieldset>

            {/* Step 2 — players */}
            <fieldset className="border-b border-cream/12 px-6 pb-6 sm:px-8">
              <legend className={`${legendCls} mb-3.5`}>
                {t("step2Title")}
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {Array.from(
                  { length: classType.maxPlayers - classType.minPlayers + 1 },
                  (_, i) => classType.minPlayers + i,
                ).map((n) => (
                  <Chip key={n} selected={n === players} onClick={() => setPlayersRaw(n)}>
                    {n} {n === 1 ? t("playersOne") : t("playersOther")}
                  </Chip>
                ))}
              </div>
            </fieldset>

            {/* Step 3 — days + times (several of each) */}
            <fieldset className="border-b border-cream/12 px-6 pb-6 sm:px-8">
              <legend className={legendCls}>
                {t("step3Title")}
              </legend>
              <p className="mb-5 mt-2 max-w-[52ch] text-[13px] leading-[1.6] text-cream/50">
                {t("multiHint")}
              </p>

              <div
                className={
                  compact
                    ? "flex flex-col gap-8"
                    : "grid gap-8 md:grid-cols-[1.35fr_1fr]"
                }
              >
                {/* Calendar */}
                <div className={compact ? "" : "md:border-r md:border-cream/12 md:pr-8"}>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[15px]">{monthLabelCap}</span>
                    <div className="flex gap-2">
                      <NavArrow
                        label={t("prevMonth")}
                        disabled={atCurrentMonth}
                        onClick={() => shiftMonth(-1)}
                      >
                        ‹
                      </NavArrow>
                      <NavArrow label={t("nextMonth")} onClick={() => shiftMonth(1)}>
                        ›
                      </NavArrow>
                    </div>
                  </div>

                  <div className="mb-2 grid grid-cols-7 gap-1.5">
                    {weekdays.map((d, i) => (
                      <span
                        key={i}
                        className="text-center font-mono text-[10px] tracking-[0.1em] text-cream/35"
                      >
                        {d}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1.5">
                    {grid.map((day, i) => {
                      if (!day) return <span key={i} className="h-9" />;
                      const past = day < today;
                      const closed = !isOpenDay(day);
                      const free = !past && !closed &&
                        slotsForDay(day, classId).some((s) => !s.taken);
                      const key = dateKey(day);
                      const picked = sessions.some((s) => s.date === key);
                      const isOpen = sameDay(day, selectedDay);
                      const disabled = past || closed || !free;

                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={disabled}
                          onClick={() => setOpenDay(key)}
                          aria-pressed={picked}
                          className={`h-9 rounded-[2px] border font-mono text-[12.5px] transition-colors ${
                            picked
                              ? "bg-clay text-cream"
                              : disabled
                                ? "cursor-default text-cream/20"
                                : "bg-cream/[0.06] text-cream/85"
                          } ${
                            isOpen
                              ? "border-cream"
                              : picked
                                ? "border-clay"
                                : disabled
                                  ? "border-transparent"
                                  : "border-transparent hover:border-cream/30"
                          }`}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Slots for the open day */}
                <div>
                  {!selectedDay ? (
                    <p className="text-[13.5px] leading-[1.6] text-cream/45">
                      {t("pickDay")}
                    </p>
                  ) : !isOpenDay(selectedDay) ? (
                    <p className="text-[13.5px] leading-[1.6] text-cream/45">
                      {t("closedDay")}
                    </p>
                  ) : daySlots.every((s) => s.taken) ? (
                    <p className="text-[13.5px] leading-[1.6] text-cream/45">
                      {t("noSlots")}
                    </p>
                  ) : (
                    <div className="flex flex-col gap-5">
                      <div className="text-[14px] text-cream/80">
                        {dateFmt.format(selectedDay)}
                      </div>
                      {[
                        { label: t("morning"), slots: morning },
                        { label: t("afternoon"), slots: afternoon },
                      ]
                        .filter((g) => g.slots.length > 0)
                        .map((group) => (
                          <div key={group.label}>
                            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/40">
                              {group.label}
                            </div>
                            <div
                              className={`grid gap-2 ${
                                compact ? "grid-cols-3" : "grid-cols-2"
                              }`}
                            >
                              {group.slots.map((slot) => {
                                const picked = sessions.some(
                                  (s) =>
                                    s.date === selectedKey && s.time === slot.time,
                                );
                                return (
                                  <button
                                    key={slot.time}
                                    type="button"
                                    disabled={slot.taken}
                                    aria-pressed={picked}
                                    onClick={() => toggleSlot(slot.time)}
                                    className={`w-full rounded-[2px] border py-3 text-center font-mono text-[13px] tracking-[0.04em] transition-colors ${
                                      picked
                                        ? "border-clay bg-clay text-cream"
                                        : slot.taken
                                          ? "cursor-default border-cream/10 text-cream/25 line-through"
                                          : "border-cream/20 text-cream/85 hover:border-cream/45"
                                    }`}
                                  >
                                    {slot.time}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Everything picked so far, across days */}
              <div className="mt-8 border-t border-cream/12 pt-6">
                <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-cream/45">
                  {t("selectedTitle")}
                  {sorted.length > 0 ? ` · ${sorted.length}` : ""}
                </div>
                {sorted.length === 0 ? (
                  <p className="mt-3 text-[13.5px] text-cream/45">
                    {t("selectedEmpty")}
                  </p>
                ) : (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {sorted.map((s) => {
                      const label = dateFmt.format(dateFromKey(s.date));
                      return (
                        <li key={`${s.date}-${s.time}`}>
                          <button
                            type="button"
                            onClick={() => removeSession(s)}
                            aria-label={t("removeSession", {
                              day: label,
                              time: s.time,
                            })}
                            className="group flex items-center gap-2.5 rounded-full border border-clay/60 bg-clay/10 py-2 pl-4 pr-3 text-[13px] text-cream transition-colors hover:border-clay"
                          >
                            <span>
                              {label} · <span className="font-mono">{s.time}</span>
                            </span>
                            <span className="text-cream/50 transition-colors group-hover:text-clay">
                              ✕
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {errors.sessions ? (
                  <p className="mt-3 text-[12.5px] text-clay">{errors.sessions}</p>
                ) : null}
              </div>
            </fieldset>

            {/* Step 4 — who is asking */}
            <fieldset className="px-6 pb-6 sm:px-8">
              <legend className={`${legendCls} mb-5`}>
                {t("step4Title")}
              </legend>

              <div className="flex flex-col gap-7">
                <div className="grid gap-7 sm:grid-cols-2">
                  <Field label={t("fieldName")} error={errors.name}>
                    {(id) => (
                      <input
                        id={id}
                        type="text"
                        autoComplete="name"
                        placeholder={t("namePlaceholder")}
                        className={inputCls}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    )}
                  </Field>

                  <Field label={t("fieldEmail")} error={errors.email}>
                    {(id) => (
                      <input
                        id={id}
                        type="email"
                        autoComplete="email"
                        placeholder={t("emailPlaceholder")}
                        className={inputCls}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    )}
                  </Field>
                </div>

                <Field label={t("fieldCountry")} error={errors.country}>
                  {(id) => (
                    <select
                      id={id}
                      autoComplete="country"
                      className={selectCls}
                      value={country}
                      onChange={(e) => chooseCountry(e.target.value)}
                    >
                      {countries.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>

                <div className="grid gap-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
                  <Field label={t("fieldPhoneCode")}>
                    {(id) => (
                      <select
                        id={id}
                        className={selectCls}
                        value={phoneCountry}
                        onChange={(e) => setPhoneCountry(e.target.value)}
                      >
                        {countries.map((c) => (
                          <option key={c.code} value={c.code}>
                            +{c.dial} · {c.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>

                  <Field label={t("fieldPhone")} error={errors.phone}>
                    {(id) => (
                      <input
                        id={id}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel-national"
                        placeholder={t("phonePlaceholder")}
                        className={inputCls}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    )}
                  </Field>
                </div>

                <Field label={`${t("fieldComment")} · ${t("optional")}`}>
                  {(id) => (
                    <textarea
                      id={id}
                      rows={3}
                      placeholder={t("commentPlaceholder")}
                      className={`${inputCls} resize-none placeholder:text-cream/30`}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  )}
                </Field>

                <label className="flex items-start gap-3 text-[13px] leading-[1.5] text-cream/70">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 accent-clay"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      setErrors((x) => ({ ...x, consent: "" }));
                    }}
                  />
                  <span>
                    {t("consent")}
                    {errors.consent ? (
                      <span className="mt-1 block text-clay">{errors.consent}</span>
                    ) : null}
                  </span>
                </label>
              </div>
            </fieldset>

            {status === "error" ? (
              <div
                role="alert"
                className="border-t border-clay/40 bg-clay/10 px-6 py-5 sm:px-8"
              >
                <div className="text-[14.5px] text-cream">{t("errorTitle")}</div>
                <p className="mt-1.5 text-[13.5px] leading-[1.6] text-cream/70">
                  {t("errorBody", { email: CONTACT.email })}
                </p>
              </div>
            ) : null}

            {/* Summary + submit */}
            <div className="flex flex-col gap-4 border-t border-cream/12 bg-ink-800 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <span className="text-[14px] text-cream/60">
                {sorted.length > 0
                  ? t("summaryPending", {
                      count: sorted.length,
                      unit: sessionUnit,
                    })
                  : t("summaryEmpty")}
              </span>
              <button
                type="submit"
                disabled={status === "sending"}
                className={`rounded-[2px] px-6 py-3.5 text-[13.5px] tracking-[0.02em] transition-colors ${
                  status === "sending"
                    ? "cursor-wait bg-cream/15 text-cream/40"
                    : "bg-clay text-cream hover:bg-clay-hover"
                }`}
              >
                {status === "sending"
                  ? t("sending")
                  : status === "error"
                    ? t("retry")
                    : t("submit")}
              </button>
            </div>
          </>
        )}
      </form>

      <p className="mt-4 font-mono text-[10.5px] leading-[1.9] tracking-[0.06em] text-cream/40">
        {t("disclaimer")}
      </p>
    </div>
  );
}

// A <legend> is laid out in the fieldset's top border area, so the fieldset's
// own padding-top never reaches it — the step label would sit flush against the
// divider above. A margin on the legend is ignored there too, so `pt-6` on the
// legend itself is what opens the gap — hence the fieldsets carry `pb-6` only.
const legendCls =
  "pt-6 font-mono text-[10.5px] uppercase tracking-[0.16em] text-cream/45";

const inputCls =
  "w-full border-0 border-b border-cream/25 bg-transparent py-3 text-[16px] text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-clay";

const selectCls = `${inputCls} truncate [&>option]:text-ink-800`;

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: (id: string) => ReactNode;
}) {
  const id = useId();
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="block font-mono text-[10.5px] uppercase tracking-[0.16em] text-cream/50"
      >
        {label}
      </label>
      <div className="mt-1">{children(id)}</div>
      {error ? <p className="mt-1.5 text-[12.5px] text-clay">{error}</p> : null}
    </div>
  );
}

function WidgetTopBar({ t }: { t: (key: string) => string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-1.5 pb-3.5">
      <span className="flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-cream/50">
        <span className="h-1.5 w-1.5 rounded-full bg-clay" />
        {t("label")}
      </span>
      <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-cream/50">
        {t("requiresConfirmation")}
      </span>
    </div>
  );
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full border px-4 py-2 text-[13px] transition-colors ${
        selected
          ? "border-clay bg-clay/10 text-cream"
          : "border-cream/20 text-cream/75 hover:border-cream/45 hover:text-cream"
      }`}
    >
      {children}
    </button>
  );
}

function NavArrow({
  label,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center border text-[13px] transition-colors ${
        disabled
          ? "border-cream/10 text-cream/20"
          : "border-cream/20 text-cream/70 hover:border-cream/45 hover:text-cream"
      }`}
    >
      {children}
    </button>
  );
}

function Confirmation({
  className = "",
  title,
  body,
  summary,
  sessions,
  contact,
  note,
  resetLabel,
  onReset,
}: {
  className?: string;
  title: string;
  body: string;
  summary: string;
  sessions: string[];
  contact: string;
  note: string | null;
  resetLabel: string;
  onReset: () => void;
}) {
  return (
    <div className={className}>
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-clay text-clay">
        ✓
      </span>
      <h3 className="text-h3 mt-5 text-cream">{title}</h3>
      <p className="mt-3 max-w-[40ch] text-[14.5px] leading-[1.65] text-cream/60">
        {body}
      </p>
      {note ? (
        <p className="mt-4 max-w-[46ch] border-l-2 border-clay pl-4 text-[13.5px] leading-[1.6] text-cream/75">
          {note}
        </p>
      ) : null}
      <div className="mt-6 border-t border-cream/12 pt-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-cream/70">
          {summary}
        </p>
        <ul className="mt-3 flex flex-col gap-1.5">
          {sessions.map((s) => (
            <li key={s} className="text-[13.5px] text-cream/60">
              · {s}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[13px] text-cream/45">{contact}</p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 border-b border-cream/30 pb-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-cream transition-colors hover:border-clay"
      >
        {resetLabel}
      </button>
    </div>
  );
}

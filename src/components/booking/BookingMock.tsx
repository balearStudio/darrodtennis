"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  CLASS_TYPES,
  classTypeById,
  firstAvailableDay,
  formatPrice,
  hasAvailability,
  isMorning,
  isOpenDay,
  monthGrid,
  sameDay,
  slotsForDay,
  startOfDay,
  type ClassTypeId,
} from "@/lib/booking";

type Props = {
  /** Compact single-column layout for narrow contexts. */
  compact?: boolean;
};

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
  const [pickedDay, setPickedDay] = useState<Date | null>(null);
  const [pickedTime, setPickedTime] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

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

  const pickedDayValid =
    pickedDay &&
    pickedDay >= today &&
    isOpenDay(pickedDay) &&
    hasAvailability(pickedDay, classId);
  const selectedDay = pickedDayValid ? pickedDay : autoDay;

  const daySlots = selectedDay ? slotsForDay(selectedDay, classId) : [];
  const selectedTime =
    pickedTime && daySlots.some((s) => s.time === pickedTime && !s.taken)
      ? pickedTime
      : null;

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

  const months = t.raw("months") as string[];
  const weekdays = t.raw("weekdays") as string[];
  const monthLabel = `${months[view.month] ?? ""} ${view.year}`;
  const monthLabelCap = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  const grid = monthGrid(view.year, view.month);
  const atCurrentMonth =
    view.year === today.getFullYear() && view.month === today.getMonth();

  const morning = daySlots.filter((s) => isMorning(s.time));
  const afternoon = daySlots.filter((s) => !isMorning(s.time));

  const price = formatPrice(classType.price(players), locale);
  const durationLabel = t("duration", { minutes: classType.minutes });
  const playersLabel = `${players} ${players === 1 ? t("playersOne") : t("playersOther")}`;
  const canSubmit = Boolean(selectedDay && selectedTime);

  function shiftMonth(dir: -1 | 1) {
    const d = new Date(view.year, view.month + dir, 1);
    setViewOverride({ year: d.getFullYear(), month: d.getMonth() });
  }

  function chooseClass(id: ClassTypeId) {
    setClassId(id);
    setViewOverride(null); // snap the calendar back to the new default day
    setPickedTime(null);
  }

  function pickDay(day: Date) {
    setPickedDay(day);
    setPickedTime(null);
  }

  function reset() {
    setSubmitted(false);
    setClassId("tennis-60");
    setPlayersRaw(1);
    setViewOverride(null);
    setPickedDay(null);
    setPickedTime(null);
  }

  const frameBase =
    "border border-cream/15 bg-[#20241C] text-cream";

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

      <div className={frameBase}>
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
          <div className="shrink-0 text-right">
            <div className="text-[1.25rem] tracking-[-0.01em]">{price}</div>
            <div className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-cream/45">
              {playersLabel}
            </div>
          </div>
        </div>

        {submitted ? (
          <Confirmation
            className="px-6 py-14 sm:px-8"
            title={t("confirmedTitle")}
            body={t("confirmedBody")}
            detail={t("confirmedDetail", {
              classType: tct(`${classId}.name`),
              players: playersLabel,
              day: selectedDay ? dateFmt.format(selectedDay) : "",
              time: selectedTime ?? "",
            })}
            resetLabel={t("reset")}
            onReset={reset}
          />
        ) : (
          <>
            {/* Step 1 — class type */}
            <fieldset className="border-b border-cream/12 px-6 py-6 sm:px-8">
              <legend className="mb-3.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-cream/45">
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
            <fieldset className="border-b border-cream/12 px-6 py-6 sm:px-8">
              <legend className="mb-3.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-cream/45">
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

            {/* Step 3 — day + time */}
            <fieldset className="px-6 py-6 sm:px-8">
              <legend className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-cream/45">
                {t("step3Title")}
              </legend>

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
                      const isSelected = sameDay(day, selectedDay);
                      const disabled = past || closed || !free;

                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={disabled}
                          onClick={() => pickDay(day)}
                          aria-pressed={isSelected}
                          className={`h-9 rounded-[2px] border font-mono text-[12.5px] transition-colors ${
                            isSelected
                              ? "border-clay bg-clay text-cream"
                              : disabled
                                ? "cursor-default border-transparent text-cream/20"
                                : "border-transparent bg-cream/[0.06] text-cream/85 hover:border-cream/30"
                          }`}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Slots */}
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
                              {group.slots.map((slot) => (
                                <button
                                  key={slot.time}
                                  type="button"
                                  disabled={slot.taken}
                                  onClick={() => setPickedTime(slot.time)}
                                  className={`w-full rounded-[2px] border py-3 text-center font-mono text-[13px] tracking-[0.04em] transition-colors ${
                                    slot.time === selectedTime
                                      ? "border-clay bg-clay text-cream"
                                      : slot.taken
                                        ? "cursor-default border-cream/10 text-cream/25 line-through"
                                        : "border-cream/20 text-cream/85 hover:border-cream/45"
                                  }`}
                                >
                                  {slot.time}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </fieldset>

            {/* Summary + submit */}
            <div className="flex flex-col gap-4 border-t border-cream/12 bg-ink-800 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <span className="text-[14px] text-cream/60">
                {canSubmit && selectedDay
                  ? t("summaryPending", {
                      day: dateFmt.format(selectedDay),
                      time: selectedTime ?? "",
                    })
                  : t("summaryEmpty")}
              </span>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={() => setSubmitted(true)}
                className={`rounded-[2px] px-6 py-3.5 text-[13.5px] tracking-[0.02em] transition-colors ${
                  canSubmit
                    ? "bg-clay text-cream hover:bg-clay-hover"
                    : "cursor-not-allowed bg-cream/15 text-cream/40"
                }`}
              >
                {t("submit")}
              </button>
            </div>
          </>
        )}
      </div>

      <p className="mt-4 font-mono text-[10.5px] leading-[1.9] tracking-[0.06em] text-cream/40">
        {t("disclaimer")}
      </p>
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
  detail,
  resetLabel,
  onReset,
}: {
  className?: string;
  title: string;
  body: string;
  detail: string;
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
      <p className="mt-5 border-t border-cream/12 pt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-cream/70">
        {detail}
      </p>
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

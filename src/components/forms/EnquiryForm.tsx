"use client";

import { useId, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

type Tone = "cream" | "dark";

const REQUIRED_FIELDS = ["name", "phone", "email", "cityCountry"] as const;

export function EnquiryForm({ tone = "cream" }: { tone?: Tone }) {
  const t = useTranslations("form");
  const [values, setValues] = useState<Record<string, string>>({});
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const dark = tone === "dark";
  const labelCls = `block font-mono text-[10.5px] uppercase tracking-[0.16em] ${
    dark ? "text-cream/50" : "text-muted"
  }`;
  const controlCls = `w-full border-0 border-b bg-transparent py-3.5 text-[16px] outline-none transition-colors ${
    dark
      ? "border-cream/25 text-cream focus:border-clay"
      : "border-ink-900/25 text-ink-800 focus:border-clay"
  }`;

  function set(name: string, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  function validate() {
    const next: Record<string, string> = {};
    for (const f of REQUIRED_FIELDS) {
      if (!values[f]?.trim()) next[f] = t("required");
    }
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = t("invalidEmail");
    }
    if (!accepted) next.terms = t("acceptTerms");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Static site (GitHub Pages): no server. Validate and show the success
    // state — wire a real handler (Formspree / API) here later.
    if (validate()) setDone(true);
  }

  if (done) {
    return (
      <div className={`max-w-[520px] ${dark ? "text-cream" : "text-ink-800"}`}>
        <h3 className="text-h3">{t("successTitle")}</h3>
        <p
          className={`mt-3 text-body ${dark ? "text-cream/65" : "text-slate"}`}
        >
          {t("successBody")}
        </p>
        <p
          className={`mt-6 font-mono text-[10.5px] uppercase tracking-[0.14em] ${
            dark ? "text-cream/40" : "text-muted"
          }`}
        >
          {t("demoNote")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-[520px]">
      <p className={`mb-10 text-body ${dark ? "text-cream/65" : "text-slate"}`}>
        {t("intro")}
      </p>

      <div className="flex flex-col gap-8">
        <Field label={t("name")} error={errors.name} labelCls={labelCls}>
          {(id) => (
            <input
              id={id}
              type="text"
              autoComplete="name"
              className={controlCls}
              value={values.name ?? ""}
              onChange={(e) => set("name", e.target.value)}
            />
          )}
        </Field>

        <Field label={t("phone")} error={errors.phone} labelCls={labelCls}>
          {(id) => (
            <input
              id={id}
              type="tel"
              autoComplete="tel"
              className={controlCls}
              value={values.phone ?? ""}
              onChange={(e) => set("phone", e.target.value)}
            />
          )}
        </Field>

        <Field label={t("email")} error={errors.email} labelCls={labelCls}>
          {(id) => (
            <input
              id={id}
              type="email"
              autoComplete="email"
              className={controlCls}
              value={values.email ?? ""}
              onChange={(e) => set("email", e.target.value)}
            />
          )}
        </Field>

        <Field
          label={t("cityCountry")}
          error={errors.cityCountry}
          labelCls={labelCls}
        >
          {(id) => (
            <input
              id={id}
              type="text"
              className={controlCls}
              value={values.cityCountry ?? ""}
              onChange={(e) => set("cityCountry", e.target.value)}
            />
          )}
        </Field>

        <div className="grid gap-8 sm:grid-cols-2">
          <Field label={t("age")} labelCls={labelCls}>
            {(id) => (
              <input
                id={id}
                type="number"
                min={4}
                max={99}
                className={controlCls}
                value={values.age ?? ""}
                onChange={(e) => set("age", e.target.value)}
              />
            )}
          </Field>

          <Field label={t("level")} labelCls={labelCls}>
            {(id) => (
              <select
                id={id}
                className={`${controlCls} ${dark ? "[&>option]:text-ink-800" : ""}`}
                value={values.level ?? ""}
                onChange={(e) => set("level", e.target.value)}
              >
                <option value="">{t("choose")}</option>
                <option value="low">{t("levelOptions.low")}</option>
                <option value="medium">{t("levelOptions.medium")}</option>
                <option value="high">{t("levelOptions.high")}</option>
              </select>
            )}
          </Field>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <Field label={t("start")} labelCls={labelCls}>
            {(id) => (
              <input
                id={id}
                type="date"
                className={controlCls}
                value={values.start ?? ""}
                onChange={(e) => set("start", e.target.value)}
              />
            )}
          </Field>

          <Field label={t("schedule")} labelCls={labelCls}>
            {(id) => (
              <select
                id={id}
                className={`${controlCls} ${dark ? "[&>option]:text-ink-800" : ""}`}
                value={values.schedule ?? ""}
                onChange={(e) => set("schedule", e.target.value)}
              >
                <option value="">{t("choose")}</option>
                <option value="morning">{t("scheduleOptions.morning")}</option>
                <option value="afternoon">{t("scheduleOptions.afternoon")}</option>
              </select>
            )}
          </Field>
        </div>

        <Field label={t("duration")} labelCls={labelCls}>
          {(id) => (
            <select
              id={id}
              className={`${controlCls} ${dark ? "[&>option]:text-ink-800" : ""}`}
              value={values.duration ?? ""}
              onChange={(e) => set("duration", e.target.value)}
            >
              <option value="">{t("choose")}</option>
              <option value="week">{t("durationOptions.week")}</option>
              <option value="fortnight">{t("durationOptions.fortnight")}</option>
              <option value="month">{t("durationOptions.month")}</option>
              <option value="quarter">{t("durationOptions.quarter")}</option>
              <option value="fullCourse">{t("durationOptions.fullCourse")}</option>
              <option value="openEnded">{t("durationOptions.openEnded")}</option>
            </select>
          )}
        </Field>

        <Field label={t("message")} labelCls={labelCls}>
          {(id) => (
            <textarea
              id={id}
              rows={3}
              placeholder={t("messagePlaceholder")}
              className={`${controlCls} resize-none ${
                dark ? "placeholder:text-cream/30" : "placeholder:text-muted/60"
              }`}
              value={values.message ?? ""}
              onChange={(e) => set("message", e.target.value)}
            />
          )}
        </Field>

        <label
          className={`flex items-start gap-3 text-[13px] leading-[1.5] ${
            dark ? "text-cream/70" : "text-slate"
          }`}
        >
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-clay"
            checked={accepted}
            onChange={(e) => {
              setAccepted(e.target.checked);
              setErrors((x) => ({ ...x, terms: "" }));
            }}
          />
          <span>
            {t("terms")}
            {errors.terms ? (
              <span className="mt-1 block text-clay">{errors.terms}</span>
            ) : null}
          </span>
        </label>

        <div>
          <button
            type="submit"
            className="rounded-[2px] bg-clay px-8 py-4 text-sm tracking-[0.02em] text-cream transition-colors hover:bg-clay-hover"
          >
            {t("submit")}
          </button>
          <p
            className={`mt-5 font-mono text-[10.5px] uppercase tracking-[0.14em] ${
              dark ? "text-cream/35" : "text-muted"
            }`}
          >
            {t("demoNote")}
          </p>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  labelCls,
  children,
}: {
  label: string;
  error?: string;
  labelCls: string;
  children: (id: string) => ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      <div className="mt-1">{children(id)}</div>
      {error ? <p className="mt-1.5 text-[12px] text-clay">{error}</p> : null}
    </div>
  );
}

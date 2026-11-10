import { CONTACT, LEGAL } from "@/lib/site";

type Section = { heading: string; body: string };

/** Company details live in LEGAL (site.ts); the copy refers to them by token. */
const fill = (text: string) =>
  text
    .replaceAll("{name}", LEGAL.name)
    .replaceAll("{nif}", LEGAL.nif)
    .replaceAll("{address}", LEGAL.address)
    .replaceAll("{email}", CONTACT.email);

export function LegalPage({
  title,
  sections,
  lastUpdated,
}: {
  title: string;
  sections: Section[];
  lastUpdated: string;
}) {
  return (
    <section className="px-side bg-cream pb-24 pt-32 text-ink-800 md:pt-44">
      <h1 className="text-h2 max-w-[20ch]">{title}</h1>
      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        {lastUpdated}
      </p>

      <div className="mt-12 max-w-[64ch] space-y-10">
        {sections.map((s) => (
          <div key={s.heading}>
            <h2 className="text-[1.25rem] tracking-[-0.01em]">{s.heading}</h2>
            <p className="mt-3 whitespace-pre-line text-body text-slate">{fill(s.body)}</p>
          </div>
        ))}
      </div>

    </section>
  );
}

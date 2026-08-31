type Section = { heading: string; body: string };

export function LegalPage({
  title,
  sections,
  disclaimer,
  lastUpdated,
}: {
  title: string;
  sections: Section[];
  disclaimer: string;
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
            <p className="mt-3 text-body text-slate">{s.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-16 max-w-[64ch] border-t border-ink-900/15 pt-6 font-mono text-[11px] leading-[1.8] tracking-[0.04em] text-muted">
        {disclaimer}
      </p>
    </section>
  );
}

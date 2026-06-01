export function EditionHead({
  kicker,
  title,
  note,
}: {
  kicker: string;
  title: string;
  note?: string;
}) {
  return (
    <div className="border-ink mb-9 flex items-end justify-between gap-4 border-b-[3px] border-double pb-3">
      <div>
        <p className="text-slop font-mono text-[10px] font-bold tracking-[0.28em] uppercase">
          {kicker}
        </p>
        <h2 className="font-display text-ink mt-1.5 text-3xl leading-[1.02] font-semibold tracking-tight sm:text-[2.6rem]">
          {title}
        </h2>
      </div>
      {note && (
        <span className="text-ink-faint hidden shrink-0 font-mono text-[10px] tracking-[0.2em] uppercase sm:block">
          {note}
        </span>
      )}
    </div>
  );
}

import { EditionHead } from './edition-head';

export function Reframe() {
  return (
    <section
      aria-label="The reframe"
      className="border-ink border-t-[3px] border-double py-14 sm:py-20"
    >
      <EditionHead kicker="Editorial" title="Provenance isn’t quality." note="vol. i · no. 1" />

      <div className="grid gap-8 lg:grid-cols-[1.55fr_1fr]">
        <div className="text-ink-dim font-sans text-[1.0625rem] leading-[1.8] sm:columns-2 sm:gap-10 [&>p]:mb-4">
          <p className="[&::first-letter]:font-display [&::first-letter]:text-slop [&::first-letter]:float-left [&::first-letter]:mt-1 [&::first-letter]:mr-2.5 [&::first-letter]:text-[3.6rem] [&::first-letter]:leading-[0.72] [&::first-letter]:font-semibold">
            The internet is flooded with copy that nobody actually checked. Most detectors ask the
            wrong question — <em>“was this written by AI?”</em> — as if a byline could certify a
            thought.
          </p>
          <p>
            But a human can churn out pure filler, and a model can draft a dense, verifiable brief.
            Authorship is a fact about the writer. It tells you nothing about whether a paragraph
            earns the minute it takes to read.
          </p>
          <p>
            So SlopShrink reads for substance instead. It scores every paragraph on information
            density, finds exactly where the quality breaks, and surfaces the hard facts a skim
            would miss — then strikes the padding from the page so the signal stands alone.
          </p>
        </div>

        <figure className="glass flex flex-col justify-center gap-4 p-7">
          <span className="font-display text-slop text-6xl leading-none">“</span>
          <blockquote className="font-display text-ink -mt-6 text-2xl leading-snug font-medium italic sm:text-[1.7rem]">
            Not “is this AI?” — but “is this actually useful?”
          </blockquote>
          <figcaption className="text-ink-faint mt-1 flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase">
            <span className="bg-slop h-px w-6" />
            the editor’s desk
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

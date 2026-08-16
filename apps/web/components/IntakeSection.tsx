const TALLY_EMBED_URL =
  "https://tally.so/embed/rj98Nl?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1";

export default function IntakeSection() {
  return (
    <section id="intake" className="relative px-4 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center sm:mb-10">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground sm:text-sm">
            Client Intake
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Start Your Project Brief
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Tell us about your project goals, features, and timeline to get an
            instant quote.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-card/60 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-sm sm:p-5 lg:p-6">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-background/40">
            <iframe
              src={TALLY_EMBED_URL}
              title="Project intake form"
              loading="lazy"
              style={{
                width: "100%",
                minHeight: "920px",
                border: "none",
                background: "transparent",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

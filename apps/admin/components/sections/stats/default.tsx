import { Section } from "../../ui/section";

interface Step {
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    title: "Share project details",
    description:
      "Fill the intake form with your goals, scope, and timeline so we can understand your needs.",
  },
  {
    title: "We review & propose",
    description:
      "We evaluate your brief, suggest scope adjustments, and provide a transparent estimate and timeline.",
  },
  {
    title: "Kickoff & deliver",
    description:
      "Approve the proposal and we begin work — regular check-ins until successful delivery.",
  },
];

export default function Stats({ className }: { className?: string }) {
  return (
    <Section className={className}>
      <div className="max-w-container mx-auto flex flex-col items-center gap-8 text-center">
        <h2 className="text-3xl font-semibold sm:text-4xl">How It Works</h2>
        <p className="text-muted-foreground max-w-[640px]">
          A simple, clear process to get your project started quickly.
        </p>
        <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map((step, idx) => (
            <div key={step.title} className="flex flex-col items-start gap-4 p-6 text-left">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white font-semibold">
                  {idx + 1}
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

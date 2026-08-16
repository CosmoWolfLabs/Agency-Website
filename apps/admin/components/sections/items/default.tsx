import { BlocksIcon, MonitorSmartphoneIcon, RocketIcon } from "lucide-react";
import { ReactNode } from "react";

import { Item, ItemDescription, ItemIcon, ItemTitle } from "../../ui/item";
import { Section } from "../../ui/section";

interface ItemProps {
  title: string;
  description: string;
  icon: ReactNode;
}

interface ItemsProps {
  title?: string;
  items?: ItemProps[] | false;
  className?: string;
}

const DEFAULT_ITEMS: ItemProps[] = [
  {
    title: "Modern Web Applications",
    description:
      "High-speed React & Next.js web applications, responsive UI/UX, fast Vercel hosting, and SEO optimization.",
    icon: <MonitorSmartphoneIcon className="size-5 stroke-1" />,
  },
  {
    title: "Discord & Telegram Bots",
    description:
      "Custom-built utility bots running 24/7 on Render, database-connected for notifications, moderation, and community automation.",
    icon: <BlocksIcon className="size-5 stroke-1" />,
  },
  {
    title: "Automated Lead Pipelines",
    description:
      "Custom intake workflows using Tally.so forms and cloud databases (Appwrite) to capture and manage leads with zero monthly tool fees.",
    icon: <RocketIcon className="size-5 stroke-1" />,
  },
];

export default function Items({
  title = "Services built to scale your operations.",
  items = DEFAULT_ITEMS,
  className,
}: ItemsProps) {
  return (
    <Section id="services" className={className}>
      <div className="max-w-container mx-auto flex flex-col items-center gap-6 sm:gap-12">
        <h2 className="max-w-[640px] text-center text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">
          {title}
        </h2>
        {items !== false && items.length > 0 && (
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <Item
                key={item.title}
                className="rounded-2xl border border-white/10 bg-card/50 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-sm transition-transform duration-200 hover:-translate-y-1"
              >
                <ItemTitle className="flex items-center gap-3 text-lg">
                  <ItemIcon className="rounded-lg border border-white/10 bg-muted/40 p-2 text-foreground">
                    {item.icon}
                  </ItemIcon>
                  {item.title}
                </ItemTitle>
                <ItemDescription className="mt-2 text-base leading-relaxed text-muted-foreground">
                  {item.description}
                </ItemDescription>
              </Item>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}

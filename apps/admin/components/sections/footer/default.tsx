import { ReactNode } from "react";

import { cn } from "@/lib/utils";

// Footer replaced with CosmoWolf Labs content
import {
  Footer,
  FooterBottom,
  FooterColumn,
  FooterContent,
} from "../../ui/footer";
import { Logo } from "../../ui/Logo";
import { ModeToggle } from "../../ui/mode-toggle";

interface FooterLink {
  text: string;
  href: string;
}

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  logo?: ReactNode;
  name?: string;
  columns?: FooterColumnProps[];
  copyright?: string;
  policies?: FooterLink[];
  showModeToggle?: boolean;
  className?: string;
}

export default function FooterSection({
  logo = null,
  name = "CosmoWolf Labs",
  columns = [],
  copyright = `© ${new Date().getFullYear()} CosmoWolf Labs. All rights reserved.`,
  policies = [],
  showModeToggle = true,
  className,
}: FooterProps) {
  return (
    <footer className={cn("bg-background w-full px-4", className)}>
      <div className="max-w-container mx-auto">
        <Footer>
          <FooterContent>
            <FooterColumn className="col-span-2 sm:col-span-3 md:col-span-1">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xl font-bold">
                  <Logo className="h-6 w-6 text-cyan-400" />
                  <h3 className="text-xl font-bold">{name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Custom Web Applications, Bot Automations & Digital Systems.
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <a
                    href="mailto:cosmowolflabs@zohomail.com"
                    className="text-sm text-zinc-400 hover:text-cyan-400"
                  >
                    cosmowolflabs@zohomail.com
                  </a>
                </div>

                <a
                  href="https://discord.gg/m3ECw29kf9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex w-max items-center gap-2 rounded-md bg-[#5865F2] px-3 py-2 text-sm font-medium text-white hover:brightness-110"
                >
                  Join our Discord
                </a>
              </div>
            </FooterColumn>

            <FooterColumn>
              <h3 className="text-md pt-1 font-semibold">Services</h3>
              <a href="/#services" className="text-muted-foreground text-sm">
                Web Applications
              </a>
              <a href="/#intake" className="mt-2 block text-muted-foreground text-sm">
                Start a Project
              </a>
            </FooterColumn>
          </FooterContent>
          <FooterBottom>
            <div>{copyright}</div>
            <div className="flex items-center gap-4">
              {showModeToggle && <ModeToggle />}
            </div>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  );
}

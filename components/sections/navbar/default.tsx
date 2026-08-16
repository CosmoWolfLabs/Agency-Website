"use client";

import { type VariantProps } from "class-variance-authority";
import { Menu, LogOut } from "lucide-react";
import { ReactNode, useCallback } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

// Branding: use agency name text instead of Launch UI logo
import { Button, buttonVariants } from "../../ui/button";
import {
  Navbar as NavbarComponent,
  NavbarLeft,
  NavbarRight,
} from "../../ui/navbar";
import Navigation from "../../ui/navigation";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../../ui/sheet";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";

async function handleLogout() {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
}

interface NavbarLink {
  text: string;
  href: string;
}

interface NavbarActionProps {
  text: string;
  href: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  icon?: ReactNode;
  iconRight?: ReactNode;
  isButton?: boolean;
}

interface NavbarProps {
  logo?: ReactNode;
  name?: string;
  homeUrl?: string;
  mobileLinks?: NavbarLink[];
  actions?: NavbarActionProps[];
  showNavigation?: boolean;
  customNavigation?: ReactNode;
  className?: string;
}

export default function Navbar({
  logo = null,
  name = "CosmoWolf Labs",
  homeUrl = "/",
  mobileLinks = [
    { text: "Services", href: "/#services" },
    { text: "Pricing", href: "/#pricing" },
    { text: "FAQ", href: "/#faq" },
    { text: "Contact", href: "/#intake" },
  ],
  actions = [
    { text: "Sign In", href: "/signin", isButton: false },
    { text: "Sign Up", href: "/signup", isButton: true, variant: "default" },
    {
      text: "Start a Project",
      href: "#intake",
      isButton: true,
      variant: "secondary",
    },
  ],
  showNavigation = true,
  customNavigation,
  className,
}: NavbarProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const scrollToIntake = (e?: React.MouseEvent, href?: string) => {
    if (e) e.preventDefault();
    try {
      const el = document.querySelector(href || "#intake");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else window.location.hash = href || "#intake";
    } catch (err) {
      // fallback
      window.location.href = href || "#intake";
    }
  };

  const onSignOut = useCallback(async () => {
    try {
      await handleLogout();
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  }, [router]);

  return (
    <header className={cn("sticky top-0 z-50 -mb-4 px-4 pb-4", className)}>
      <div className="fade-bottom bg-background/15 absolute left-0 h-24 w-full backdrop-blur-lg"></div>
      <div className="max-w-container relative mx-auto">
        <NavbarComponent>
          <NavbarLeft>
            <a
              href={homeUrl}
              className="flex items-center gap-2 text-xl font-bold"
            >
              {logo}
              {name}
            </a>
            {showNavigation && (customNavigation || <Navigation />)}
          </NavbarLeft>
          <NavbarRight>
            {!loading && user ? (
              <Button variant="ghost" onClick={onSignOut}>
                <LogOut className="size-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <>
                <a href="/signin" className="hidden text-sm md:block">
                  Sign In
                </a>
                <Button asChild className="hidden md:inline-block">
                  <a href="/signup">Sign Up</a>
                </Button>
                <Button variant={"default"} asChild className="hidden md:inline-block">
                  <a href="#intake" onClick={(e) => scrollToIntake(e, "#intake")}>Start a Project</a>
                </Button>
              </>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="size-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <nav className="grid gap-4 text-lg font-medium">
                  <a href="/" className="flex items-center gap-2 text-xl font-bold">
                    <span>{name}</span>
                  </a>
                  {mobileLinks.map((link) => (
                    <a
                      key={`${link.href}-${link.text}`}
                      href={link.href}
                      onClick={(e) => link.href === "#intake" && scrollToIntake(e, "#intake")}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {link.text}
                    </a>
                  ))}

                  <div className="mt-4 border-t border-white/5 pt-4">
                    <a href="/signin" className="block rounded-lg px-4 py-3 text-center text-sm text-foreground hover:bg-white/5">
                      Sign In
                    </a>
                    <a href="/signup" className="mt-2 block rounded-lg bg-cyan-500 px-4 py-3 text-center text-sm font-medium text-white hover:brightness-105">
                      Create Account
                    </a>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </NavbarRight>
        </NavbarComponent>
      </div>
    </header>
  );
}

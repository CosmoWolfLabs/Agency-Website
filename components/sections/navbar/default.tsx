"use client";

import { type VariantProps } from "class-variance-authority";
import { Menu } from "lucide-react";
import { ReactNode, useCallback } from "react";

import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "../../ui/button";
import { Navbar as NavbarComponent, NavbarLeft, NavbarRight } from "../../ui/navbar";
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
    { text: "Services", href: "#services" },
    { text: "How It Works", href: "#workflow" },
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
  showNavigation = false,
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
            <a href={homeUrl} className="flex items-center gap-2 text-xl font-bold">
              <span className="font-bold">{name}</span>
            </a>
            <div className="hidden md:flex items-center gap-4 ml-6">
              <a href="#services" className="text-sm text-muted-foreground hover:text-foreground">Services</a>
              <a href="#workflow" className="text-sm text-muted-foreground hover:text-foreground">How It Works</a>
            </div>
          </NavbarLeft>
          <NavbarRight>
            {!loading && user ? (
              <div className="flex items-center gap-2">
                <span className="hidden md:inline-flex rounded-full bg-slate-800 px-3 py-1 text-sm">{user.email || user.name}</span>
                <Button variant="ghost" onClick={onSignOut}>Sign Out</Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <a href="/signin" className="text-sm hidden md:inline-block">Sign In</a>
                <Button asChild className="hidden md:inline-block">
                  <a href="/signup">Get Started</a>
                </Button>
              </div>
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

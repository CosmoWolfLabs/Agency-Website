"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

import { useAppwriteInit } from "@/lib/useAppwriteInit";

export function RootLayoutClient({ children }: { children: ReactNode }) {
  useAppwriteInit();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

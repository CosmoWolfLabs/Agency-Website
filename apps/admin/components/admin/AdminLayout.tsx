"use client";

import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-amber-200">
      <div className="mx-auto max-w-7xl p-4">
        <div className="flex">
          <aside className="w-64 shrink-0 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="mb-6 text-center">
              <div className="text-2xl font-semibold text-amber-300">Admin</div>
              <div className="text-xs text-zinc-400">Control Panel</div>
            </div>
            <nav className="flex flex-col gap-2 text-sm">
              <button data-admin-nav="overview" className="w-full text-left rounded px-3 py-2 hover:bg-zinc-800">Overview & Metrics</button>
              <button data-admin-nav="projects" className="w-full text-left rounded px-3 py-2 hover:bg-zinc-800">Client Projects</button>
              <button data-admin-nav="briefs" className="w-full text-left rounded px-3 py-2 hover:bg-zinc-800">Brief Submissions</button>
              <button data-admin-nav="system" className="w-full text-left rounded px-3 py-2 hover:bg-zinc-800">System Controls</button>
            </nav>
          </aside>

          <main className="ml-6 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

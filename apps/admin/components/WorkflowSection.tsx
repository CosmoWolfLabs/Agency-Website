"use client";

import React from "react";

export default function WorkflowSection() {
  return (
    <section id="workflow" className="py-16 bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-3xl font-bold">Our Workflow & Delivery Process</h2>
        <p className="mt-2 text-muted-foreground">A predictable five-step process to take your idea from brief to live.</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl border border-white/6 bg-slate-900/60 p-4">
            <div className="text-sm font-semibold text-cyan-300">Step 1</div>
            <h3 className="mt-2 font-medium">Create Account & Sign In</h3>
            <p className="mt-2 text-sm text-muted-foreground">Register on the client portal to access your private project workspace.</p>
          </div>

          <div className="rounded-xl border border-white/6 bg-slate-900/60 p-4">
            <div className="text-sm font-semibold text-cyan-300">Step 2</div>
            <h3 className="mt-2 font-medium">Fill Project Intake Brief</h3>
            <p className="mt-2 text-sm text-muted-foreground">Complete the embedded project form inside your dashboard with your specifications, features, and timeline.</p>
          </div>

          <div className="rounded-xl border border-white/6 bg-slate-900/60 p-4">
            <div className="text-sm font-semibold text-cyan-300">Step 3</div>
            <h3 className="mt-2 font-medium">Scope Review & Quote</h3>
            <p className="mt-2 text-sm text-muted-foreground">We analyze metrics, prepare a technical roadmap, and issue a proposal directly in your dashboard for confirmation.</p>
          </div>

          <div className="rounded-xl border border-white/6 bg-slate-900/60 p-4">
            <div className="text-sm font-semibold text-cyan-300">Step 4</div>
            <h3 className="mt-2 font-medium">Rapid Build & Staging</h3>
            <p className="mt-2 text-sm text-muted-foreground">We develop the solution and provide an active Vercel staging preview link for your testing and review.</p>
          </div>

          <div className="rounded-xl border border-white/6 bg-slate-900/60 p-4">
            <div className="text-sm font-semibold text-cyan-300">Step 5</div>
            <h3 className="mt-2 font-medium">Checkout & Delivery</h3>
            <p className="mt-2 text-sm text-muted-foreground">Approve the demo, complete secure payment via Stripe, and receive full repository source code and credentials.</p>
          </div>
        </div>

        <div className="mt-8">
          <a href="/signup" className="inline-flex items-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 font-medium text-white">Create Account to Start</a>
        </div>
      </div>
    </section>
  );
}

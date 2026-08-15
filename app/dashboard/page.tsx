import Link from "next/link";

const projects = [
  {
    name: "Northstar SaaS",
    type: "Website",
    preview: "https://client-preview.vercel.app",
    repo: "github.com/acme/northstar",
    status: "Build Passing",
  },
  {
    name: "Discord Ops Bot",
    type: "Automation",
    preview: "https://client-preview.vercel.app/bot",
    repo: "github.com/acme/ops-bot",
    status: "Live",
  },
];

const activity = [
  {
    label: "Build passed",
    time: "2 hours ago",
    detail: "Production deploy finished successfully",
  },
  {
    label: "Design review",
    time: "Yesterday",
    detail: "Client approved homepage v2",
  },
  {
    label: "Bot restarted",
    time: "2 days ago",
    detail: "Discord moderation bot resumed after ping",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-7xl">
        <aside className="hidden w-72 border-r border-white/10 bg-slate-900/70 p-6 lg:block">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
              AgencyFlow
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Client Portal</h2>
          </div>

          <nav className="space-y-2">
            {[
              "Overview",
              "My Projects",
              "Support / Bot Controls",
              "Invoices / Quotes",
              "Settings",
              "Log Out",
            ].map((item, index) => (
              <button
                key={item}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                  index === 0
                    ? "bg-cyan-500/10 text-cyan-300"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Client Portal</p>
              <h1 className="mt-1 text-3xl font-semibold">Welcome back, Alex</h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                In Progress
              </span>

              <button className="relative rounded-full border border-white/10 bg-slate-900 p-2 text-slate-200">
                🔔
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-cyan-400" />
              </button>
            </div>
          </header>

          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Active Projects</h3>
                <Link
                  href="/dashboard/new-project"
                  className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
                >
                  New project
                </Link>
              </div>

              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.name}
                    className="rounded-xl border border-white/10 bg-slate-950/60 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{project.name}</p>
                        <p className="text-xs text-slate-400">{project.type}</p>
                      </div>
                      <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-cyan-300">
                        {project.status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-slate-300">
                      <p>
                        Preview:{" "}
                        <a
                          href={project.preview}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          {project.preview}
                        </a>
                      </p>
                      <p>
                        Repo:{" "}
                        <a
                          href={`https://${project.repo}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          {project.repo}
                        </a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
              <h3 className="mb-5 text-lg font-semibold text-white">
                Bot Status Tracker
              </h3>

              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Operational uptime</span>
                    <span className="text-sm font-medium text-emerald-300">99.98%</span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Connected channels</span>
                    <span className="text-sm font-medium text-white">4 / 5</span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Last ping</span>
                    <span className="text-sm font-medium text-cyan-300">8 sec ago</span>
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <button className="flex-1 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-500/20">
                    Restart Bot
                  </button>
                  <button className="flex-1 rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
                    Ping Status
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
              <h3 className="mb-5 text-lg font-semibold text-white">
                Submit New Request
              </h3>

              <p className="mb-5 text-sm text-slate-400">
                Need a new feature, content update, or workflow improvement?
              </p>

              <Link
                href="/#intake"
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-medium text-white transition hover:brightness-110"
              >
                Submit a New Request
              </Link>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
              <h3 className="mb-5 text-lg font-semibold text-white">Recent Activity</h3>

              <div className="space-y-4">
                {activity.map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400" />
                    <div>
                      <p className="font-medium text-white">{item.label}</p>
                      <p className="text-xs text-slate-400">{item.time}</p>
                      <p className="mt-1 text-sm text-slate-300">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

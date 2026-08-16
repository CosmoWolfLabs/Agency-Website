"use client";

import { Bell, CreditCard, FileText, Layers, LifeBuoy, PlusSquare, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getAppwriteDatabases, getUser, logout } from "@/lib/appwrite";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "invoices" | "support" | "settings">("overview");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  async function fetchProjects() {
    const databases: any = getAppwriteDatabases();
    if (!databases) return [];
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "";
    const coll = process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID ?? "projects";
    try {
      const res: any = await databases.listDocuments(dbId, coll);
      const docs = res.documents || res;
      const mine = (docs || []).filter((d: any) => d.userId === user.$id || d.ownerId === user.$id);
      return mine;
    } catch (err) {
      console.error("Failed to load projects", err);
      return [];
    }
  }

  useEffect(() => {
    (async () => {
      const u = await getUser();
      if (!u) {
        router.push("/signin");
        return;
      }
      setUser(u);
    })();
  }, [router]);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      const mine = await fetchProjects();
      if (!mounted) return;
      setProjects(mine);
      if (mine.length) setActiveProjectId(mine[0].$id || null);
    })();
    return () => {
      mounted = false;
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      "In Intake": "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
      "In Development": "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
      Review: "bg-orange-500/10 text-orange-300 border-orange-500/30",
      Live: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    };
    return map[status] || "bg-white/5 text-white/80";
  };

  const tallyBase = "https://tally.so/embed/rj98Nl?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1";
  const tallyUrl = user?.email ? `${tallyBase}&prefill[email]=${encodeURIComponent(user.email)}` : tallyBase;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl p-4">
        {/* Top header bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">CosmoWolf Labs</div>
            <div className="text-xs text-muted-foreground">/</div>
            <div className="text-sm font-semibold">Client Portal</div>
            <div className="ml-4">
              <select value={activeProjectId || ""} onChange={(e) => setActiveProjectId(e.target.value)} className="rounded-md bg-slate-900 border border-white/6 px-3 py-1 text-sm">
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.$id} value={p.$id}>{p.name || p.title}</option>
                ))}
              </select>
            </div>
          </div>

            <div className="flex items-center gap-3">
            <button title="Create New Site" onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-md bg-slate-900/60 px-3 py-2 text-sm">
              <PlusSquare className="h-4 w-4" /> Create New Site
            </button>
            <button title="Notifications" className="rounded-md bg-slate-900/60 p-2"><Bell className="h-4 w-4" /></button>
            <div className="rounded-full bg-slate-900/60 px-3 py-1 text-sm">{user?.email}</div>
            <button onClick={handleLogout} className="rounded-md border border-white/10 px-3 py-2 text-sm">Log Out</button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="rounded-xl border border-white/6 bg-slate-900/60 p-4">
              <nav className="flex flex-col gap-2">
                <button onClick={() => setActiveTab("overview")} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${activeTab === "overview" ? "bg-white/5" : "hover:bg-white/5"}`}><Layers className="h-4 w-4" /> Overview</button>
                <button onClick={() => setActiveTab("projects")} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${activeTab === "projects" ? "bg-white/5" : "hover:bg-white/5"}`}><FileText className="h-4 w-4" /> Active Projects</button>
                <button onClick={() => setActiveTab("invoices")} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${activeTab === "invoices" ? "bg-white/5" : "hover:bg-white/5"}`}><CreditCard className="h-4 w-4" /> Invoices / Quotes</button>
                <button onClick={() => setActiveTab("support")} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${activeTab === "support" ? "bg-white/5" : "hover:bg-white/5"}`}><LifeBuoy className="h-4 w-4" /> Support</button>
                <button onClick={() => setActiveTab("settings")} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${activeTab === "settings" ? "bg-white/5" : "hover:bg-white/5"}`}><Settings className="h-4 w-4" /> Settings</button>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Metric cards row */}
            {projects.length > 0 && (
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-white/6 bg-slate-900/60 p-4">
                  <div className="text-sm text-muted-foreground">Project Status</div>
                  <div className="mt-2 text-lg font-semibold">{projects[0]?.status || projects[0]?.state || "Unknown"}</div>
                </div>
                <div className="rounded-xl border border-white/6 bg-slate-900/60 p-4">
                  <div className="text-sm text-muted-foreground">Active Milestones</div>
                  <div className="mt-2 text-lg font-semibold">{`${projects[0]?.milestonesCompleted || 0} / ${projects[0]?.milestonesTotal || 4}`}</div>
                </div>
                <div className="rounded-xl border border-white/6 bg-slate-900/60 p-4">
                  <div className="text-sm text-muted-foreground">Live Staging</div>
                  <div className="mt-2 text-lg font-semibold">{projects[0]?.preview ? <a className="text-cyan-400" href={projects[0].preview} target="_blank" rel="noreferrer">Open Preview</a> : "Awaiting Build"}</div>
                </div>
                <div className="rounded-xl border border-white/6 bg-slate-900/60 p-4">
                  <div className="text-sm text-muted-foreground">Delivery & Payment</div>
                  <div className="mt-2 text-lg font-semibold">{projects[0]?.paymentStatus || "Pending Approval"}</div>
                </div>
              </div>
            )}

            {/* Empty state when no projects */}
            {!projects.length && (
              <div className="mb-6 rounded-xl border border-white/6 bg-slate-900/60 p-6 text-center">
                <h3 className="text-xl font-semibold">No active projects yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">Ready to build your website or bot?</p>
                <div className="mt-4 flex justify-center">
                  <button onClick={() => setShowModal(true)} className="rounded-md bg-cyan-600 px-4 py-2 text-white">Create New Site</button>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <span className="inline-block rounded bg-white/5 px-3 py-1">—</span>
                  <span className="inline-block rounded bg-white/5 px-3 py-1">—</span>
                  <span className="inline-block rounded bg-white/5 px-3 py-1">—</span>
                </div>
              </div>
            )}

            {/* Projects table */}
            <div className="rounded-xl border border-white/6 bg-slate-900/60 p-4">
              {activeTab === "overview" && (
                <>
                  <h3 className="text-lg font-semibold mb-4">Overview</h3>
                  <div className="text-sm text-muted-foreground">Project summary and recent activity will appear here.</div>
                  {projects.length > 0 && (
                    <div className="mt-4">
                      <div className="font-medium">Current Project: {projects[0].name || projects[0].title}</div>
                      <div className="text-sm text-muted-foreground">Status: {projects[0].status || projects[0].state || "Unknown"}</div>
                    </div>
                  )}
                </>
              )}

              {activeTab === "projects" && (
                <>
                  <h3 className="text-lg font-semibold mb-4">Active Projects & Timeline</h3>
                  {projects.length ? (
                    <div className="space-y-3">
                      <table className="w-full table-auto text-left">
                        <thead>
                          <tr className="text-sm text-muted-foreground">
                            <th className="pb-2">Project</th>
                            <th className="pb-2">Status</th>
                            <th className="pb-2">Staging</th>
                            <th className="pb-2">Proposal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects.map((p) => (
                            <tr key={p.$id} className="border-t border-white/6">
                              <td className="py-3">
                                <div className="font-medium">{p.name || p.title}</div>
                                <div className="text-xs text-muted-foreground">{p.type || p.category}</div>
                              </td>
                              <td className="py-3">
                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${statusBadge(p.status || p.state)}`}>{p.status || p.state || "Unknown"}</span>
                              </td>
                              <td className="py-3">
                                {p.preview ? <a href={p.preview} target="_blank" rel="noreferrer" className="text-cyan-400">Open</a> : <span className="text-sm text-muted-foreground">Awaiting Build</span>}
                              </td>
                              <td className="py-3">
                                {p.proposalUrl ? <a href={p.proposalUrl} target="_blank" rel="noreferrer" className="text-cyan-400">View</a> : <span className="text-sm text-muted-foreground">—</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No active projects. Use Create New Site to start your first project.</div>
                  )}
                </>
              )}

              {activeTab === "invoices" && (
                <>
                  <h3 className="text-lg font-semibold mb-4">Invoices / Quotes</h3>
                  <div className="text-sm text-muted-foreground">No pending invoices.</div>
                </>
              )}

              {activeTab === "support" && (
                <>
                  <h3 className="text-lg font-semibold mb-4">Support</h3>
                  <div className="text-sm text-muted-foreground">Join our Discord or contact cosmowolflabs@zohomail.com</div>
                </>
              )}

              {activeTab === "settings" && (
                <>
                  <h3 className="text-lg font-semibold mb-4">Settings</h3>
                  <div className="text-sm text-muted-foreground">Name: {user?.name || "—"}</div>
                  <div className="text-sm text-muted-foreground">Email: {user?.email || "—"}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-3xl rounded-2xl bg-slate-900/90 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Create New Site</h3>
              <button onClick={() => setShowModal(false)} aria-label="Close" className="rounded-md px-3 py-1 hover:bg-white/5">✕</button>
            </div>
            <div className="mt-4">
              <div className="overflow-hidden rounded-xl border border-white/6 bg-slate-950/40">
                <iframe src={tallyUrl} title="Project Intake" className="w-full" style={{ minHeight: 640, border: 0 }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

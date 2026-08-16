"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser, logout, getAppwriteDatabases } from "@/lib/appwrite";
import { ID } from "appwrite";
import { Bell, PlusSquare, Layers, CreditCard, LifeBuoy, Settings, FileText } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

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
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    const databases: any = getAppwriteDatabases();
    if (!databases) return;
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "";
    const coll = process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID ?? "projects";
    try {
      const res: any = await databases.listDocuments(dbId, coll);
      const docs = res.documents || res;
      const mine = (docs || []).filter((d: any) => d.userId === user.$id || d.ownerId === user.$id);
      setProjects(mine);
      if (mine.length) setActiveProjectId(mine[0].$id || null);
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  const submitTicket = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const databases: any = getAppwriteDatabases();
      if (!databases) throw new Error("Appwrite databases not initialized");
      const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "";
      const tickets = process.env.NEXT_PUBLIC_APPWRITE_TICKETS_COLLECTION_ID ?? "tickets";
      await databases.createDocument(dbId, tickets, ID.unique(), {
        title,
        description,
        userId: user.$id,
        status: "In Review",
        createdAt: new Date().toISOString(),
      });
      setTitle("");
      setDescription("");
      setShowModal(false);
      loadProjects();
    } catch (err) {
      console.error("Failed to submit ticket", err);
    } finally {
      setLoading(false);
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
            <button title="Quick Create" onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-md bg-slate-900/60 px-3 py-2 text-sm">
              <PlusSquare className="h-4 w-4" /> Quick Create
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
                <a className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-white/5"><Layers className="h-4 w-4" /> Overview</a>
                <a className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-white/5"><FileText className="h-4 w-4" /> Active Projects</a>
                <a className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-white/5"><CreditCard className="h-4 w-4" /> Invoices / Quotes</a>
                <a className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-white/5"><LifeBuoy className="h-4 w-4" /> Support</a>
                <a className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-white/5"><Settings className="h-4 w-4" /> Settings</a>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Metric cards row */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-white/6 bg-slate-900/60 p-4">
                <div className="text-sm text-muted-foreground">Project Status</div>
                <div className="mt-2 text-lg font-semibold">{projects[0]?.status || "In Intake"}</div>
              </div>
              <div className="rounded-xl border border-white/6 bg-slate-900/60 p-4">
                <div className="text-sm text-muted-foreground">Active Milestones</div>
                <div className="mt-2 text-lg font-semibold">{projects[0]?.milestonesCompleted || "0"} / {projects[0]?.milestonesTotal || "4"}</div>
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

            {/* Intake / Tally embed */}
            <div className="mb-6 rounded-xl border border-white/6 bg-slate-900/60 p-4">
              <h3 className="text-lg font-semibold">Project Intake</h3>
              <p className="text-sm text-muted-foreground">Submit your project brief directly from here.</p>

              <div id="intake-form" className="mt-4">
                {/* If no active project show Tally embed prominently */}
                {!projects.length ? (
                  <div className="overflow-hidden rounded-xl border border-white/6 bg-slate-950/40">
                    <iframe src={tallyUrl} title="Project Intake" className="w-full" style={{ minHeight: 600, border: 0 }} />
                  </div>
                ) : (
                  <div className="rounded-md border border-white/6 bg-slate-950/30 p-4">
                    <p className="text-sm">You have active projects. Use the table below to view details or submit a new brief.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Projects table */}
            <div className="rounded-xl border border-white/6 bg-slate-900/60 p-4">
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
                <div className="text-sm text-muted-foreground">No active projects. Submit your first brief above.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900/90 p-6">
            <h3 className="text-lg font-semibold">Quick Create — New Brief</h3>
            <form onSubmit={submitTicket} className="mt-4 space-y-3">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title" className="w-full rounded-md border border-white/10 bg-slate-950 px-3 py-2" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief / requirements" className="w-full rounded-md border border-white/10 bg-slate-950 px-3 py-2" />
              <div className="flex gap-3">
                <button type="submit" disabled={loading} className="rounded-md bg-cyan-600 px-4 py-2 text-white">Submit</button>
                <button type="button" onClick={() => setShowModal(false)} className="rounded-md border border-white/10 px-4 py-2">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

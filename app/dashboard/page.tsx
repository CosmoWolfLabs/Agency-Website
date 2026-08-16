"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser, logout, getAppwriteDatabases } from "@/lib/appwrite";
import { ID } from "appwrite";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      "In Review": "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
      "In Development": "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
      Live: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    };
    return map[status] || "bg-white/5 text-white/80";
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-7xl">
        <aside className="hidden w-72 border-r border-white/10 bg-slate-900/70 p-6 lg:block">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">CosmoWolf Labs</p>
            <h2 className="mt-2 text-2xl font-semibold">Client Portal</h2>
          </div>

          <nav className="space-y-2">
            {["Overview", "My Projects", "Support", "Invoices", "Settings"].map((item, index) => (
              <button key={item} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${index === 0 ? "bg-cyan-500/10 text-cyan-300" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}>
                {item}
              </button>
            ))}

            <button onClick={handleLogout} className="mt-6 w-full rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-200">Log Out</button>
          </nav>
        </aside>

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Client Portal</p>
              <h1 className="mt-1 text-3xl font-semibold">Welcome back{user?.name ? `, ${user.name}` : user?.email ? `, ${user.email}` : ""}</h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">Dashboard</span>
              <button onClick={() => setShowModal(true)} className="rounded-md bg-cyan-500/10 px-3 py-2 text-sm text-cyan-300">New Request</button>
            </div>
          </header>

          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Active Projects</h3>
                <button onClick={() => setShowModal(true)} className="text-sm font-medium text-cyan-400 hover:text-cyan-300">New project</button>
              </div>

              <div className="space-y-4">
                {projects.length ? (
                  projects.map((project) => (
                    <div key={project.$id || project.name} className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-white">{project.name || project.title}</p>
                          <p className="text-xs text-slate-400">{project.type || project.category}</p>
                        </div>
                        <span className={`rounded-full border px-2 py-1 text-[10px] font-medium uppercase tracking-wide ${statusBadge(project.status || project.state)}`}>
                          {project.status || project.state || "Unknown"}
                        </span>
                      </div>

                      <div className="mt-4 space-y-2 text-sm text-slate-300">
                        {project.preview && (
                          <p>
                            Preview: {" "}
                            <a href={project.preview} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300">{project.preview}</a>
                          </p>
                        )}
                        {project.repo && (
                          <p>
                            Repo: {" "}
                            <a href={project.repo.startsWith("http") ? project.repo : `https://${project.repo}`} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300">{project.repo}</a>
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-white/10 bg-slate-950/60 p-6 text-center">
                    <p className="mb-4 text-slate-300">You don’t have any projects yet.</p>
                    <button onClick={() => setShowModal(true)} className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-medium text-white">Submit Your First Project</button>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
              <h3 className="mb-5 text-lg font-semibold text-white">Recent Activity</h3>
              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">No recent system activity</span>
                    <span className="text-sm font-medium text-emerald-300">—</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900/90 p-6">
            <h3 className="text-lg font-semibold">Submit New Project / Brief</h3>
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

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAppwriteAccount, getAppwriteDatabases, logout } from "@/lib/appwrite";
import { Logo } from "@/components/ui/Logo";
import { Loader2, Search, Mail, ExternalLink, Activity, LogOut, Check, X } from "lucide-react";

type Project = {
  $id: string;
  clientEmail: string;
  projectName: string;
  status: string;
  budgetTier?: string;
  timeline?: string;
  previewUrl?: string;
  invoiceUrl?: string;
  invoiceValue?: number;
  specifications?: string;
};

export default function MasterConsole() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const account = getAppwriteAccount();
        if (!account) throw new Error("Appwrite not initialized");
        const user = await account.get();
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'cosmowolflabs@zohomail.com';
        
        if (user.email !== adminEmail) {
          await logout();
          router.push("/");
          return;
        }

        const db = getAppwriteDatabases();
        if (!db) throw new Error("Appwrite not initialized");
        if (process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID && process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID) {
          const res = await db.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID
          );
          // Map Appwrite documents to our type (fallback if fields are missing)
          setProjects(res.documents.map(d => ({
            $id: d.$id,
            clientEmail: d.clientEmail || d.email || "unknown@client.com",
            projectName: d.projectName || d.name || "Untitled Project",
            status: d.status || d.state || "In Intake",
            budgetTier: d.budgetTier || "$0 - $0",
            timeline: d.timeline || "Unknown",
            previewUrl: d.previewUrl || d.preview || "",
            invoiceUrl: d.invoiceUrl || d.paymentLink || "",
            invoiceValue: d.invoiceValue || 0,
            specifications: d.specifications || d.brief || "No brief provided."
          })));
        } else {
          console.warn("Appwrite environment variables missing. Showing mock data.");
          // Fallback mock data if not connected properly so UI works
          setProjects([
            {
              $id: "p1",
              clientEmail: "john@example.com",
              projectName: "E-Commerce Rebuild",
              status: "In Development",
              budgetTier: "$5k - $10k",
              timeline: "4 Weeks",
              invoiceValue: 5000,
            },
            {
              $id: "p2",
              clientEmail: "sarah@startup.io",
              projectName: "Discord Bot Automation",
              status: "In Intake",
              budgetTier: "$1k - $3k",
              timeline: "2 Weeks",
              invoiceValue: 1500,
            }
          ]);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  const updateProject = async (id: string, updates: Partial<Project>) => {
    setSavingId(id);
    try {
      const db = getAppwriteDatabases();
      if (!db) throw new Error("Appwrite not initialized");
      if (process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID && process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID) {
        await db.updateDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
          id,
          updates
        );
      }
      setProjects(prev => prev.map(p => p.$id === id ? { ...p, ...updates } : p));
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update project. See console.");
    } finally {
      setSavingId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.projectName.toLowerCase().includes(search.toLowerCase()) || p.clientEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const kpis = {
    intake: projects.filter(p => p.status === "In Intake").length,
    active: projects.filter(p => p.status === "In Development" || p.status === "Review Staging").length,
    delivered: projects.filter(p => p.status === "Delivered & Live").length,
    value: projects.reduce((acc, p) => acc + (p.invoiceValue || 0), 0)
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-black"><Loader2 className="h-8 w-8 animate-spin text-cyan-400" /></div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8 text-cyan-400" />
          <div>
            <h1 className="text-2xl font-bold">Master Console</h1>
            <p className="text-sm text-zinc-400">CosmoWolf Labs Global Administration</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 rounded-md bg-white/5 px-4 py-2 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </header>

      {/* Global KPI Cards */}
      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={64} /></div>
          <p className="text-sm font-medium text-zinc-400">Total Incoming Briefs</p>
          <p className="mt-2 text-3xl font-bold text-white">{kpis.intake}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-cyan-400"><Activity size={64} /></div>
          <p className="text-sm font-medium text-zinc-400">Active Builds</p>
          <p className="mt-2 text-3xl font-bold text-cyan-400">{kpis.active}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-400"><Activity size={64} /></div>
          <p className="text-sm font-medium text-zinc-400">Pending/Active Invoices</p>
          <p className="mt-2 text-3xl font-bold text-emerald-400">${kpis.value.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Check size={64} /></div>
          <p className="text-sm font-medium text-zinc-400">Total Delivered</p>
          <p className="mt-2 text-3xl font-bold text-white">{kpis.delivered}</p>
        </div>
      </div>

      {/* Project Matrix */}
      <div className="rounded-xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Client Project Matrix</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Search clients..." 
                className="w-full sm:w-64 rounded-md border border-white/10 bg-black/50 py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select 
              className="rounded-md border border-white/10 bg-black/50 py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="In Intake">In Intake</option>
              <option value="Scope Proposal Sent">Scope Proposal Sent</option>
              <option value="In Development">In Development</option>
              <option value="Review Staging">Review Staging</option>
              <option value="Delivered & Live">Delivered & Live</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="border-b border-white/10 text-xs uppercase bg-white/5 text-zinc-400">
              <tr>
                <th className="px-4 py-4">Client / Project</th>
                <th className="px-4 py-4">Lifecycle Status</th>
                <th className="px-4 py-4">URLs (Staging / Invoice)</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-zinc-500">No projects found.</td></tr>
              ) : filteredProjects.map(project => (
                <tr key={project.$id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-white">{project.projectName}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                      <Mail size={12} /> {project.clientEmail}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <select
                      className={`rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs font-medium focus:outline-none ${savingId === project.$id ? 'opacity-50' : ''}`}
                      value={project.status}
                      disabled={savingId === project.$id}
                      onChange={(e) => updateProject(project.$id, { status: e.target.value })}
                    >
                      <option value="In Intake">In Intake</option>
                      <option value="Scope Proposal Sent">Scope Proposal Sent</option>
                      <option value="In Development">In Development</option>
                      <option value="Review Staging">Review Staging</option>
                      <option value="Delivered & Live">Delivered & Live</option>
                    </select>
                  </td>
                  <td className="px-4 py-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500 w-12">Preview:</span>
                      <input 
                        type="url" 
                        placeholder="https://staging..." 
                        className="w-full rounded border border-white/10 bg-black/50 px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
                        defaultValue={project.previewUrl}
                        onBlur={(e) => e.target.value !== project.previewUrl && updateProject(project.$id, { previewUrl: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500 w-12">Invoice:</span>
                      <input 
                        type="url" 
                        placeholder="https://buy.stripe.com/..." 
                        className="w-full rounded border border-white/10 bg-black/50 px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
                        defaultValue={project.invoiceUrl}
                        onBlur={(e) => e.target.value !== project.invoiceUrl && updateProject(project.$id, { invoiceUrl: e.target.value })}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <a 
                      href={`mailto:${project.clientEmail}?subject=Project Update: CosmoWolf Labs - ${project.projectName}`}
                      className="inline-flex items-center gap-1 rounded bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-colors"
                    >
                      <Mail size={14} /> Email
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

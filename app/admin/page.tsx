"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAppwriteAccount, getAppwriteDatabases } from "@/lib/appwrite";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [briefs, setBriefs] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const account = getAppwriteAccount();
      if (!account) return router.push('/admin/login');
      try {
        const u = await account.get();
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'harsh2412pro@gmail.com';
        if (!u) return router.push('/signin');
        // check admin email or preference flag
        const isAdmin = (u.email === adminEmail) || ((u as any)?.preferences?.admin === true) || (u?.$id && u.$id === process.env.NEXT_PUBLIC_ADMIN_ID);
        if (!isAdmin) return router.push('/dashboard');
        setUser(u);

        // load briefs and projects
        const databases = getAppwriteDatabases();
        if (databases) {
          const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? '';
          const intakeCollection = process.env.NEXT_PUBLIC_APPWRITE_INTAKE_COLLECTION_ID ?? process.env.NEXT_PUBLIC_APPWRITE_TICKETS_COLLECTION_ID ?? 'intake';
          const projectsCollection = process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID ?? 'projects';
          try {
            const bRes: any = await databases.listDocuments(dbId, intakeCollection);
            setBriefs(bRes.documents || bRes || []);
          } catch (e) {
            // ignore
          }
          try {
            const pRes: any = await databases.listDocuments(dbId, projectsCollection);
            setProjects(pRes.documents || pRes || []);
          } catch (e) {
            // ignore
          }
        }
      } catch (err) {
        return router.push('/signin');
      }
    })();
  }, [router]);

  const totalRevenuePending = projects.reduce((acc, p) => acc + (p?.amountDue || 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <h2 className="text-lg font-semibold text-amber-300">Overview & Metrics</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded p-3 bg-zinc-950/50">
              <div className="text-sm text-zinc-400">Total Briefs</div>
              <div className="text-2xl font-semibold">{briefs.length}</div>
            </div>
            <div className="rounded p-3 bg-zinc-950/50">
              <div className="text-sm text-zinc-400">Active Builds</div>
              <div className="text-2xl font-semibold">{projects.filter(p=> p.status === 'In Development').length}</div>
            </div>
            <div className="rounded p-3 bg-zinc-950/50">
              <div className="text-sm text-zinc-400">Revenue Pending</div>
              <div className="text-2xl font-semibold">${totalRevenuePending}</div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <h2 className="text-lg font-semibold text-amber-300">Client Projects</h2>
          <div className="mt-3 overflow-auto">
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="text-sm text-zinc-400">
                  <th className="pb-2">Client</th>
                  <th className="pb-2">Project</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Staging</th>
                  <th className="pb-2">Payment</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.$id} className="border-t border-zinc-800">
                    <td className="py-3">{p.userEmail || p.ownerEmail || p.owner || '—'}</td>
                    <td className="py-3">{p.name || p.title || 'Untitled'}</td>
                    <td className="py-3">
                      <select defaultValue={p.status || 'In Intake'} onChange={async (e)=>{
                        const newStatus = e.target.value;
                        const databases = getAppwriteDatabases();
                        if (!databases) return;
                        const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? '';
                        const coll = process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID ?? 'projects';
                        try {
                          await databases.updateDocument(dbId, coll, p.$id, { ...p, status: newStatus });
                        } catch (err) {
                          console.error(err);
                        }
                      }} className="rounded bg-zinc-900 px-2 py-1 text-amber-100">
                        <option>In Intake</option>
                        <option>Scope Proposal Issued</option>
                        <option>In Development</option>
                        <option>Staging Live</option>
                        <option>Delivered & Completed</option>
                      </select>
                    </td>
                    <td className="py-3">
                      <input defaultValue={p.preview || ''} placeholder="Staging URL" onBlur={async (e)=>{
                        const val = e.currentTarget.value;
                        const databases = getAppwriteDatabases();
                        if (!databases) return;
                        const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? '';
                        const coll = process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID ?? 'projects';
                        try { await databases.updateDocument(dbId, coll, p.$id, { ...p, preview: val }); } catch (err) { console.error(err); }
                      }} className="w-full rounded bg-zinc-900 px-2 py-1 text-amber-100" />
                    </td>
                    <td className="py-3">
                      <input defaultValue={p.paymentLink || ''} placeholder="Payment / Invoice URL" onBlur={async (e)=>{
                        const val = e.currentTarget.value;
                        const databases = getAppwriteDatabases();
                        if (!databases) return;
                        const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? '';
                        const coll = process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID ?? 'projects';
                        try { await databases.updateDocument(dbId, coll, p.$id, { ...p, paymentLink: val }); } catch (err) { console.error(err); }
                      }} className="w-full rounded bg-zinc-900 px-2 py-1 text-amber-100" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <h2 className="text-lg font-semibold text-amber-300">Brief Submissions</h2>
          <div className="mt-3 space-y-2">
            {briefs.map((b) => (
              <div key={b.$id} className="rounded border border-zinc-800 p-3 bg-zinc-950/40">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{b.prefill?.name || b.email || b.respondent_email || '—'}</div>
                    <div className="text-sm text-zinc-400">{b.submittedAt || b.receivedAt || '—'}</div>
                  </div>
                  <details>
                    <summary className="cursor-pointer text-sm text-amber-200">Inspect</summary>
                    <pre className="mt-2 max-h-60 overflow-auto text-xs text-zinc-200">{JSON.stringify(b.raw || b, null, 2)}</pre>
                  </details>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

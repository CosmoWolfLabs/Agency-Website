"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAppwriteAccount } from "@/lib/appwrite";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const account = getAppwriteAccount();
      if (!account) throw new Error("Appwrite not configured");
      // Use email/password session creation
      // @ts-ignore
      await account.createEmailPasswordSession(email, password);
      router.push("/admin");
    } catch (err: any) {
      setError(err?.message || String(err));
    }
  };

  return (
    <main className="min-h-screen bg-zinc-900 text-amber-200 flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl bg-zinc-950/80 p-6">
        <h2 className="text-xl font-semibold mb-2">Admin Login</h2>
        {error && <div className="mb-2 text-sm text-red-400">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-md bg-zinc-900 px-3 py-2 text-amber-100" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full rounded-md bg-zinc-900 px-3 py-2 text-amber-100" />
          <div className="flex justify-end">
            <button type="submit" className="rounded-md bg-amber-500 px-4 py-2 text-zinc-900">Sign in</button>
          </div>
        </form>
      </div>
    </main>
  );
}

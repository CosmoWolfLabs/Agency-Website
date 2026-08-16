"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { login, getUser, logout } from "@/lib/appwrite";
import { Logo } from "@/components/ui/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      const u = await getUser();
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'cosmowolflabs@zohomail.com';
      
      if (!u || u.email !== adminEmail) {
        await logout();
        setError("Unauthorized: Invalid Admin Credentials.");
        return;
      }
      
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError(err?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 p-8 shadow-2xl">
        <div className="mb-8 flex flex-col items-center">
          <Logo className="h-12 w-12 text-cyan-400 mb-4" />
          <h1 className="text-2xl font-bold tracking-tight">Master Console</h1>
          <p className="text-sm text-zinc-400 mt-1">CosmoWolf Labs Secure Access</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">Admin Email</label>
            <input
              type="email"
              required
              className="w-full rounded-md border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              placeholder="admin@cosmowolflabs.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full rounded-md border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 pr-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex items-center justify-center rounded-md bg-cyan-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-cyan-500 disabled:opacity-50"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Authenticate"}
          </button>
        </form>
      </div>
    </div>
  );
}

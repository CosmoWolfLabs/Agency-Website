"use client";

import { ID } from "appwrite";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createPhoneSession, loginWithGoogle, register, verifyPhoneOTP, getUser } from "@/lib/appwrite";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [phoneUserId, setPhoneUserId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(email, password, name || email);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      setError("Google sign-up failed");
    }
  };

  const requestPhoneOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const uid = ID.unique();
      setPhoneUserId(uid);
      await createPhoneSession(uid, phone);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to request OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!phoneUserId) throw new Error("Missing phone session id");
      await verifyPhoneOTP(phoneUserId, otp);
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/50">
        <div className="mb-4 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-400">
            Create account
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Sign Up</h1>
        </div>
        <div className="mb-4 flex items-center gap-2">
          <button
            onClick={() => setMethod("email")}
            className={`rounded-full px-3 py-1 text-sm ${method === "email" ? "bg-white/5" : "text-slate-400"}`}
          >
            Email
          </button>
          <button
            onClick={() => setMethod("phone")}
            className={`rounded-full px-3 py-1 text-sm ${method === "phone" ? "bg-white/5" : "text-slate-400"}`}
          >
            Phone / SMS
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="mb-2 block text-sm text-slate-300">
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm text-slate-300">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 pr-10 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}

          {method === "email" ? (
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-medium text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+15551234567"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              {!phoneUserId ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    requestPhoneOtp();
                  }}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-medium text-white"
                >
                  {loading ? "Requesting..." : "Send OTP"}
                </button>
              ) : (
                <div className="space-y-2">
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
                  />
                  <button onClick={(e) => { e.preventDefault(); verifyOtp(); }} className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-white">Verify OTP</button>
                </div>
              )}
            </div>
          )}
        </form>

        <div className="mt-6 space-y-3 text-center">
          <button onClick={handleGoogle} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-white">
            <img src="/icons/google.svg" alt="Google" className="h-4 w-4" />
            Continue with Google
          </button>

          <p className="text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/signin" className="font-medium text-cyan-400 hover:text-cyan-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

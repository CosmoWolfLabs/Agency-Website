"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then((r) => {
  if (!r.ok) throw new Error("Not authenticated");
  return r.json();
});

export function useAuth() {
  const { data, error, isLoading } = useSWR("/api/auth/user", fetcher);
  return {
    user: data ?? null,
    loading: isLoading,
    error,
  };
}

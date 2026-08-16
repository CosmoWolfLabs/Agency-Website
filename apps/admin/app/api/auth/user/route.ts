import { NextResponse } from "next/server";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "";

export async function GET(req: Request) {
  if (!endpoint) {
    return NextResponse.json({ error: "Appwrite endpoint not configured" }, { status: 500 });
  }

  try {
    const cookie = req.headers.get("cookie") || "";

    const res = await fetch(`${endpoint.replace(/\/+$/, "")}/v1/account`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      // forward credentials
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to contact Appwrite" }, { status: 500 });
  }
}

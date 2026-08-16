import { NextResponse } from "next/server";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "";

export async function POST(req: Request) {
  if (!endpoint) {
    return NextResponse.json({ error: "Appwrite endpoint not configured" }, { status: 500 });
  }

  try {
    const cookie = req.headers.get("cookie") || "";

    const res = await fetch(`${endpoint.replace(/\/+$/, "")}/v1/account/sessions/current`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to delete session" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to contact Appwrite" }, { status: 500 });
  }
}

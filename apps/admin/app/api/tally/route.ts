import { ID } from 'appwrite';
import { NextResponse } from 'next/server';

import { getAppwriteDatabases } from '@/lib/appwrite';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Tally sends form data under `form_response` or similar keys depending on settings.
    // We'll try to extract commonly used fields and store them as-is.
    const payload: any = {
      receivedAt: new Date().toISOString(),
      raw: body,
    };

    // If Tally includes an email prefill or answers, normalize them
    try {
      const fr = body.form_response || body;
      // Extract answers array if present
      if (fr.answers) payload.answers = fr.answers;
      if (fr.submitted_at) payload.submittedAt = fr.submitted_at;
      if (fr.hidden) payload.hidden = fr.hidden;
      if (fr.respondent_email) payload.email = fr.respondent_email;
      if (fr.email) payload.email = fr.email;
      if (fr.prefill && fr.prefill.email) payload.email = fr.prefill.email;
    } catch {
      // ignore parsing errors
    }

    const databases = getAppwriteDatabases();
    if (!databases) {
      return NextResponse.json({ ok: false, error: 'Appwrite not configured' }, { status: 500 });
    }

    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? '';
    const intakeCollection = process.env.NEXT_PUBLIC_APPWRITE_INTAKE_COLLECTION_ID ?? process.env.NEXT_PUBLIC_APPWRITE_TICKETS_COLLECTION_ID ?? 'intake';

    const doc = await databases.createDocument(dbId, intakeCollection, ID.unique(), payload);

    return NextResponse.json({ ok: true, doc });
  } catch (err: any) {
    console.error('Tally webhook handler error', err);
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}

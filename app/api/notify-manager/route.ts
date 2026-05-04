import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const gasUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!gasUrl) {
      console.warn("GOOGLE_APPS_SCRIPT_URL not configured. Notification skipped.");
      return NextResponse.json({ status: 'skipped', message: 'GAS URL not set' });
    }

    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error notifying manager:", error);
    return NextResponse.json({ status: 'error', message: 'Failed to notify' }, { status: 500 });
  }
}

// ==========================================================
// NEW FILE
// LOCATION: app/api/checkout/sslcommerz/fail/route.ts
// ==========================================================
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const appUrl = process.env.APP_URL ?? new URL(req.url).origin;
  return NextResponse.redirect(`${appUrl}/dashboard/orders?payment=failed`, { status: 303 });
}

export async function GET(req: Request) {
  const appUrl = process.env.APP_URL ?? new URL(req.url).origin;
  return NextResponse.redirect(`${appUrl}/dashboard/orders?payment=failed`);
}

import { NextResponse } from 'next/server';

import { buildAndScoreData } from '~/scripts/build-and-score-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          process.env.CRON_SECRET == null
            ? 'CRON_SECRET is not configured.'
            : 'Unauthorized cron request.',
      },
      { status: process.env.CRON_SECRET == null ? 500 : 401 }
    );
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        ok: false,
        error: 'BLOB_READ_WRITE_TOKEN is not configured.',
      },
      { status: 500 }
    );
  }

  try {
    await buildAndScoreData();

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error('[cron] refresh failed', error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown cron failure.',
      },
      { status: 500 }
    );
  }
}

function isAuthorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return process.env.VERCEL !== '1';
  }

  return request.headers.get('authorization') === `Bearer ${cronSecret}`;
}

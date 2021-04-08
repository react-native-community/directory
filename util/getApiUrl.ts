import { NextPageContext } from 'next';

export default function getApiUrl(path: string, ctx: NextPageContext) {
  const { req } = ctx;
  if (!req && typeof window !== 'undefined') return `/api${path}`;

  const host = req ? req.headers['x-forwarded-host'] || req.headers.host : window.location.host;
  const proto = req
    ? req.headers['x-forwarded-proto'] || 'http'
    : window.location.protocol.slice(0, -1);
  return `${proto}://${host}/api${path}`;
}

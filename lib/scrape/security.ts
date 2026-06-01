import { ScrapeError } from '../errors';

const BLOCKED_HOST_PATTERNS: readonly RegExp[] = [
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^f[cd][0-9a-f]{2}:/,
  /^fe[89ab][0-9a-f]:/,
];

const BLOCKED_HOSTS: ReadonlySet<string> = new Set(['localhost', '0.0.0.0', '::', '::1']);

function unwrapIpv6(host: string): string {
  let h = host.toLowerCase();
  if (h.startsWith('[') && h.endsWith(']')) h = h.slice(1, -1);
  const mapped = h.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  return mapped ? mapped[1]! : h;
}

export function assertPublicHost(hostname: string): void {
  const host = unwrapIpv6(hostname);
  if (BLOCKED_HOSTS.has(host) || host.endsWith('.localhost')) {
    throwBlockedHost();
  }
  for (const pattern of BLOCKED_HOST_PATTERNS) {
    if (pattern.test(host)) throwBlockedHost();
  }
}

export function assertHttpProtocol(target: URL): void {
  if (target.protocol !== 'http:' && target.protocol !== 'https:') {
    throw new ScrapeError('fetch_failed', 'Only http(s) URLs are supported.', 422);
  }
}

function throwBlockedHost(): never {
  throw new ScrapeError('fetch_failed', 'Refusing to fetch a private or local address.', 422);
}

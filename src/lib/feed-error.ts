/**
 * Translate a raw feed-fetch / parse error into a short, actionable message
 * for the user. Pure helper, no logging or side effects.
 */
export function explainFeedError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  const code = (err as { code?: string } | null)?.code;
  const status = (err as { status?: number } | null)?.status;

  const statusMatch = raw.match(/Status code (\d{3})/i);
  const httpStatus = status ?? (statusMatch ? Number(statusMatch[1]) : null);

  if (httpStatus === 401 || httpStatus === 403) {
    return "This site blocks automated requests (HTTP " + httpStatus + "). Try finding the feed URL directly — common paths are /feed, /rss, /atom.xml, or /index.xml.";
  }
  if (httpStatus === 404) {
    return "Feed not found at this URL (HTTP 404). Double-check the address.";
  }
  if (httpStatus === 429) {
    return "The site is rate-limiting requests (HTTP 429). Wait a moment and try again.";
  }
  if (httpStatus && httpStatus >= 500 && httpStatus < 600) {
    return `The server returned an error (HTTP ${httpStatus}). Try again later.`;
  }

  if (code === "ENOTFOUND" || /ENOTFOUND/i.test(raw)) {
    return "Couldn't resolve that domain. Check the URL and your connection.";
  }
  if (code === "ECONNREFUSED" || /ECONNREFUSED/i.test(raw)) {
    return "The server refused the connection. The site may be down.";
  }
  if (
    code === "ETIMEDOUT" ||
    code === "UND_ERR_CONNECT_TIMEOUT" ||
    /timeout|timed out/i.test(raw)
  ) {
    return "The server took too long to respond. Try again or use a different feed URL.";
  }
  if (code === "ECONNRESET" || /ECONNRESET/i.test(raw)) {
    return "The connection was reset by the server. Try again in a moment.";
  }
  if (/certificate|self[- ]signed|SSL|TLS/i.test(raw)) {
    return "The site has an invalid SSL certificate.";
  }

  // XML parser errors from rss-parser / sax
  if (
    /Non-whitespace before first tag/i.test(raw) ||
    /Unexpected end/i.test(raw) ||
    /Invalid character/i.test(raw) ||
    /Feed not recognized/i.test(raw)
  ) {
    return "This URL doesn't return a valid feed. It may be a website — try the site's RSS/Atom URL instead (often /feed, /rss, or /atom.xml).";
  }

  if (/no <link rel="alternate"/i.test(raw)) {
    // Already a clean message from discoverFeedUrl — pass it through.
    return raw;
  }

  // Fallback: use the raw message but prefix it so users know it's the
  // underlying error.
  return `Couldn't add this feed: ${raw}`;
}

const BROWSER_UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const FEED_TYPES = [
  "application/rss+xml",
  "application/atom+xml",
  "application/feed+json",
  "application/json",
];

/**
 * Parse an HTML document and return the first feed URL advertised by a
 * <link rel="alternate" type="..."> tag, resolved against `baseUrl`. Returns
 * null if none is found. Pure helper, no network.
 */
export function findFeedLinkInHtml(html: string, baseUrl: string): string | null {
  // Look at <link ...> tags only — cheap regex is fine for this.
  const linkRegex = /<link\b[^>]*>/gi;
  for (const match of html.matchAll(linkRegex)) {
    const tag = match[0];
    const rel = attr(tag, "rel");
    if (!rel || !/\balternate\b/i.test(rel)) continue;
    const type = attr(tag, "type");
    if (!type || !FEED_TYPES.includes(type.toLowerCase())) continue;
    const href = attr(tag, "href");
    if (!href) continue;
    try {
      return new URL(href, baseUrl).href;
    } catch {
      continue;
    }
  }
  return null;
}

function attr(tag: string, name: string): string | null {
  const re = new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i");
  const m = tag.match(re);
  if (!m) return null;
  return m[2] ?? m[3] ?? m[4] ?? null;
}

/**
 * Given a URL the user pasted, return the actual feed URL to parse. If the
 * URL already points at a feed (returns XML/JSON content type), it's used
 * as-is. Otherwise, fetches the HTML and looks for <link rel="alternate">.
 * Throws with a clear message if discovery fails.
 */
export async function discoverFeedUrl(input: string): Promise<string> {
  const res = await fetch(input, {
    redirect: "follow",
    headers: {
      "User-Agent": BROWSER_UA,
      Accept:
        "application/rss+xml, application/atom+xml, application/xml, text/xml, text/html;q=0.9, */*;q=0.5",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    const err = new Error(`Status code ${res.status}`);
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }

  const contentType = (res.headers.get("content-type") || "").toLowerCase();

  // Already a feed: return the (possibly redirected) final URL.
  if (
    contentType.includes("xml") ||
    contentType.includes("rss") ||
    contentType.includes("atom") ||
    contentType.includes("application/json")
  ) {
    return res.url || input;
  }

  // HTML: scan for a feed link.
  if (contentType.includes("html")) {
    const html = await res.text();
    const found = findFeedLinkInHtml(html, res.url || input);
    if (found) return found;
    throw new Error(
      "This URL doesn't return a feed and no <link rel=\"alternate\"> was found on the page. Try the site's RSS/Atom URL directly.",
    );
  }

  // Unknown content type — let the parser try the URL itself.
  return res.url || input;
}

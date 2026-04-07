import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

const { window } = new JSDOM("");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const purify = DOMPurify(window as any);

const ALLOWED_TAGS = [
  "a", "abbr", "b", "blockquote", "br", "code", "del", "em",
  "figcaption", "figure", "h1", "h2", "h3", "h4", "h5", "h6",
  "hr", "i", "img", "li", "ol", "p", "pre", "s", "strong",
  "sub", "sup", "table", "tbody", "td", "th", "thead", "tr", "ul",
];

const ALLOWED_ATTR = [
  "href", "src", "alt", "title", "width", "height", "class",
  "target", "rel",
];

export function sanitizeHtml(dirty: string): string {
  const clean = purify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ADD_ATTR: ["target"],
    ALLOW_DATA_ATTR: false,
  });
  return rewriteImagesToProxy(clean);
}

/**
 * Rewrites <img src="http(s)://..."> to route through our local image proxy,
 * sidestepping mixed-content / hotlink-blocking issues. Relative and data: URLs
 * are left untouched.
 */
function rewriteImagesToProxy(html: string): string {
  return html.replace(
    /<img\b([^>]*?)\bsrc=("|')(https?:\/\/[^"']+)\2/gi,
    (_match, attrs, quote, url) =>
      `<img${attrs}src=${quote}/api/image-proxy?url=${encodeURIComponent(url)}${quote}`,
  );
}

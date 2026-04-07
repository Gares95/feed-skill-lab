import { NextRequest } from "next/server";

const FETCH_TIMEOUT_MS = 10_000;
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get("url");
  if (!target) {
    return new Response("Missing url", { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return new Response("Invalid url", { status: 400 });
  }
  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    return new Response("Disallowed protocol", { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const upstream = await fetch(parsed.toString(), {
      headers: {
        "User-Agent": "Feed/1.0 (Local RSS Reader)",
        Accept: "image/*",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    if (!upstream.ok || !upstream.body) {
      return new Response("Upstream failed", { status: 502 });
    }

    const contentType = upstream.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      return new Response("Not an image", { status: 415 });
    }

    const contentLength = Number(upstream.headers.get("content-length") ?? 0);
    if (contentLength && contentLength > MAX_BYTES) {
      return new Response("Image too large", { status: 413 });
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return new Response("Fetch error", { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}

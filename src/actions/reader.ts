"use server";

import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { prisma } from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/sanitize";

const FETCH_TIMEOUT_MS = 15_000;

export async function extractArticle(
  articleId: string,
): Promise<{ content: string; title: string | null; byline: string | null }> {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { link: true },
  });
  if (!article?.link) throw new Error("Article has no link to extract from");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let html: string;
  try {
    const res = await fetch(article.link, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Feed/1.0; Local RSS Reader)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`Upstream returned ${res.status}`);
    html = await res.text();
  } finally {
    clearTimeout(timeout);
  }

  const dom = new JSDOM(html, { url: article.link });
  const reader = new Readability(dom.window.document);
  const parsed = reader.parse();
  if (!parsed?.content) throw new Error("Could not extract article content");

  return {
    content: sanitizeHtml(parsed.content),
    title: parsed.title ?? null,
    byline: parsed.byline ?? null,
  };
}

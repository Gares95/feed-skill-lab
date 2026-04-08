import { describe, expect, it } from "vitest";
import { findFeedLinkInHtml } from "./discover-feed";

describe("findFeedLinkInHtml", () => {
  it("finds an RSS link and resolves relative URL", () => {
    const html = `<html><head><link rel="alternate" type="application/rss+xml" href="/feed.xml"></head></html>`;
    expect(findFeedLinkInHtml(html, "https://site.test/")).toBe("https://site.test/feed.xml");
  });

  it("finds an Atom link with absolute URL", () => {
    const html = `<link rel="alternate" type="application/atom+xml" href="https://other.test/atom">`;
    expect(findFeedLinkInHtml(html, "https://site.test/")).toBe("https://other.test/atom");
  });

  it("finds JSON feed", () => {
    const html = `<link rel="alternate" type="application/feed+json" href="/feed.json">`;
    expect(findFeedLinkInHtml(html, "https://site.test/")).toBe("https://site.test/feed.json");
  });

  it("returns null when no alternate link is present", () => {
    expect(findFeedLinkInHtml("<html></html>", "https://site.test/")).toBeNull();
  });

  it("ignores alternate links with non-feed type", () => {
    const html = `<link rel="alternate" type="text/html" href="/other">`;
    expect(findFeedLinkInHtml(html, "https://site.test/")).toBeNull();
  });

  it("ignores rel values that aren't alternate", () => {
    const html = `<link rel="stylesheet" type="application/rss+xml" href="/feed.xml">`;
    expect(findFeedLinkInHtml(html, "https://site.test/")).toBeNull();
  });
});

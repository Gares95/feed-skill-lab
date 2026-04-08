import { describe, expect, it } from "vitest";
import { explainFeedError } from "./feed-error";

describe("explainFeedError", () => {
  it("handles 403 with status property", () => {
    const err = Object.assign(new Error("boom"), { status: 403 });
    expect(explainFeedError(err)).toMatch(/blocks automated requests/);
  });

  it("handles 404", () => {
    expect(explainFeedError(Object.assign(new Error("x"), { status: 404 }))).toMatch(/not found/);
  });

  it("handles 429", () => {
    expect(explainFeedError(Object.assign(new Error("x"), { status: 429 }))).toMatch(/rate-limiting/);
  });

  it("handles 5xx", () => {
    expect(explainFeedError(Object.assign(new Error("x"), { status: 503 }))).toMatch(/server returned an error/i);
  });

  it("parses 'Status code 403' from message", () => {
    expect(explainFeedError(new Error("Status code 403"))).toMatch(/blocks automated requests/);
  });

  it("handles ENOTFOUND", () => {
    expect(explainFeedError(Object.assign(new Error("getaddrinfo ENOTFOUND foo"), { code: "ENOTFOUND" }))).toMatch(/resolve/);
  });

  it("handles timeout", () => {
    expect(explainFeedError(new Error("request timed out"))).toMatch(/too long/);
  });

  it("handles XML parse error", () => {
    expect(explainFeedError(new Error("Non-whitespace before first tag."))).toMatch(/valid feed/);
  });

  it("falls back with prefix", () => {
    expect(explainFeedError(new Error("weird thing"))).toMatch(/Couldn't add this feed: weird thing/);
  });
});

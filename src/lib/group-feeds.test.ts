import { describe, it, expect } from "vitest";
import { groupFeedsByFolder } from "./group-feeds";

const folders = [
  { id: "f1", name: "News" },
  { id: "f2", name: "Tech" },
];

describe("groupFeedsByFolder", () => {
  it("groups feeds by their folder, preserving folder order", () => {
    const feeds = [
      { id: "a", folderId: "f2" },
      { id: "b", folderId: "f1" },
      { id: "c", folderId: "f2" },
    ];
    const result = groupFeedsByFolder(feeds, folders);
    expect(result).toHaveLength(2);
    expect(result[0].folder?.id).toBe("f1");
    expect(result[0].feeds.map((f) => f.id)).toEqual(["b"]);
    expect(result[1].folder?.id).toBe("f2");
    expect(result[1].feeds.map((f) => f.id)).toEqual(["a", "c"]);
  });

  it("appends an Uncategorized group when feeds have no folder", () => {
    const feeds = [
      { id: "a", folderId: null },
      { id: "b", folderId: "f1" },
    ];
    const result = groupFeedsByFolder(feeds, folders);
    expect(result).toHaveLength(3);
    expect(result[2].folder).toBeNull();
    expect(result[2].feeds.map((f) => f.id)).toEqual(["a"]);
  });

  it("omits Uncategorized when all feeds are in folders", () => {
    const feeds = [{ id: "a", folderId: "f1" }];
    const result = groupFeedsByFolder(feeds, folders);
    expect(result.find((g) => g.folder === null)).toBeUndefined();
  });

  it("returns empty folder groups when no feeds match", () => {
    const result = groupFeedsByFolder([], folders);
    expect(result).toHaveLength(2);
    expect(result.every((g) => g.feeds.length === 0)).toBe(true);
  });

  it("treats feeds with unknown folderId as uncategorized? (no — they are dropped)", () => {
    // Current contract: unknown folderIds are silently grouped under that id,
    // but since no folder matches, they are NOT rendered. This documents that.
    const feeds = [{ id: "a", folderId: "ghost" }];
    const result = groupFeedsByFolder(feeds, folders);
    expect(result.find((g) => g.folder === null)).toBeUndefined();
  });
});

export interface FolderRef {
  id: string;
  name: string;
}

export interface FeedRef {
  id: string;
  folderId: string | null;
}

export interface FeedGroup<F extends FeedRef> {
  folder: FolderRef | null; // null = uncategorized
  feeds: F[];
}

/**
 * Groups feeds by folder, preserving folder order from `folders` and
 * appending an "Uncategorized" group at the end (only when non-empty).
 */
export function groupFeedsByFolder<F extends FeedRef>(
  feeds: F[],
  folders: FolderRef[],
): FeedGroup<F>[] {
  const byFolder = new Map<string, F[]>();
  const uncategorized: F[] = [];

  for (const feed of feeds) {
    if (feed.folderId == null) {
      uncategorized.push(feed);
      continue;
    }
    const list = byFolder.get(feed.folderId) ?? [];
    list.push(feed);
    byFolder.set(feed.folderId, list);
  }

  const groups: FeedGroup<F>[] = folders.map((folder) => ({
    folder,
    feeds: byFolder.get(folder.id) ?? [],
  }));

  if (uncategorized.length > 0) {
    groups.push({ folder: null, feeds: uncategorized });
  }

  return groups;
}

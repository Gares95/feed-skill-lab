export const DEFAULT_REFRESH_MINUTES = 60;

export interface ScheduledFeed {
  lastFetched: Date | null;
  refreshInterval: number | null;
}

/**
 * Decide whether a feed is due for refresh based on its last-fetched time
 * and its per-feed refresh interval (falling back to the default).
 */
export function isFeedDue(
  feed: ScheduledFeed,
  now: number,
  defaultMinutes: number = DEFAULT_REFRESH_MINUTES,
): boolean {
  if (!feed.lastFetched) return true;
  const intervalMin = feed.refreshInterval ?? defaultMinutes;
  const elapsedMin = (now - feed.lastFetched.getTime()) / 60_000;
  return elapsedMin >= intervalMin;
}

"use client";

import { useEffect } from "react";
import { refreshDueFeeds } from "@/actions/feeds";

const POLL_INTERVAL_MS = 60_000;

/**
 * Polls `refreshDueFeeds` every minute. The server decides which feeds
 * are actually due based on per-feed refresh intervals.
 */
export function useAutoRefresh(onRefreshed: () => void) {
  useEffect(() => {
    const interval = window.setInterval(async () => {
      try {
        const result = await refreshDueFeeds();
        if (result.refreshed > 0) onRefreshed();
      } catch (error) {
        console.error("Auto-refresh failed:", error);
      }
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [onRefreshed]);
}

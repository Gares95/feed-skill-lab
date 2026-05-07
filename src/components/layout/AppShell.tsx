"use client";

import { useState, useCallback, useEffect, useMemo, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Sidebar, type FeedWithCount, type FolderRef } from "@/components/sidebar/Sidebar";
import {
  ArticleList,
  type ArticleWithFeed,
} from "@/components/articles/ArticleList";
import {
  ReadingPane,
  type ArticleFull,
} from "@/components/reader/ReadingPane";
import {
  deleteFeed,
  refreshAllFeeds,
  refreshFeed,
} from "@/actions/feeds";
import {
  loadMoreArticles,
  markAllRead,
  markRead,
  markUnread,
  toggleStar,
} from "@/actions/articles";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useArticleSearch } from "@/hooks/use-article-search";
import { useAutoRefresh } from "@/hooks/use-auto-refresh";
import { useCommandPalette } from "@/hooks/use-command-palette";
import { useSwipe } from "@/hooks/use-swipe";
import { formatCustomRangeParam, type DateRange } from "@/lib/date-range";
import { CommandPalette } from "@/components/CommandPalette";
import { ContextBar } from "@/components/command/ContextBar";
import { NavRail } from "@/components/command/NavRail";
import { StatusBar } from "@/components/command/StatusBar";
import { MobileCommandBar } from "@/components/command/MobileCommandBar";

interface AppShellProps {
  feeds: FeedWithCount[];
  folders: FolderRef[];
  totalUnread: number;
  starredCount: number;
  initialArticles: ArticleWithFeed[];
  initialNextCursor: string | null;
  initialFeedId: string | null;
  initialStarred: boolean;
  initialArticle: ArticleFull | null;
  initialDateRange: DateRange;
  initialFrom: Date | null;
  initialTo: Date | null;
}

export interface DateRangeSelection {
  range: DateRange;
  from?: Date;
  to?: Date;
}

export function AppShell({
  feeds,
  folders,
  totalUnread,
  starredCount,
  initialArticles,
  initialNextCursor,
  initialFeedId,
  initialStarred,
  initialArticle,
  initialDateRange,
  initialFrom,
  initialTo,
}: AppShellProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(
    initialFeedId,
  );
  const [isStarredView, setIsStarredView] = useState(initialStarred);
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);
  const [customFrom, setCustomFrom] = useState<Date | undefined>(
    initialFrom ?? undefined,
  );
  const [customTo, setCustomTo] = useState<Date | undefined>(
    initialTo ?? undefined,
  );
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    initialArticle?.id ?? null
  );
  const [articles, setArticles] = useState<ArticleWithFeed[]>(initialArticles);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Reset the accumulated list whenever the server renders a new filter view
  // (feed change, starred toggle, date range, or mutation revalidation).
  useEffect(() => {
    setArticles(initialArticles);
    setNextCursor(initialNextCursor);
    setIsLoadingMore(false);
  }, [initialArticles, initialNextCursor]);

  // Drop selections that no longer exist in the visible queue (e.g. after a
  // feed/starred/date change re-renders a different article set).
  useEffect(() => {
    setCheckedIds((prev) => {
      if (prev.size === 0) return prev;
      const visible = new Set(initialArticles.map((a) => a.id));
      const next = new Set<string>();
      let changed = false;
      for (const id of prev) {
        if (visible.has(id)) next.add(id);
        else changed = true;
      }
      return changed ? next : prev;
    });
  }, [initialArticles]);
  const [currentArticle, setCurrentArticle] = useState<ArticleFull | null>(
    initialArticle
  );
  const [isArticleLoading, setIsArticleLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mobileView, setMobileView] = useState<"sidebar" | "list" | "reader">(
    "list",
  );

  // Phase 5: UI-only multi-select state. Bulk actions loop existing
  // single-id server actions client-side — no new endpoints, no schema
  // changes. The set is reset whenever the visible filter view changes.
  const [checkedIds, setCheckedIds] = useState<Set<string>>(() => new Set());
  const [isBulkPending, setIsBulkPending] = useState(false);
  const lastCheckedIdRef = useRef<string | null>(null);

  const search = useArticleSearch();
  const { open: paletteOpen, setOpen: setPaletteOpen } = useCommandPalette();

  const refresh = useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
  }, [router, startTransition]);

  useAutoRefresh(refresh);

  function buildUrl(opts: {
    feedId?: string | null;
    starred?: boolean;
    range?: DateRange;
    from?: Date;
    to?: Date;
  }) {
    const params = new URLSearchParams();
    if (opts.feedId) params.set("feedId", opts.feedId);
    if (opts.starred) params.set("starred", "true");
    const r = opts.range ?? dateRange;
    if (r !== "all") params.set("range", r);
    if (r === "custom") {
      const f = opts.from ?? customFrom;
      const t = opts.to ?? customTo;
      if (f) params.set("from", formatCustomRangeParam(f));
      if (t) params.set("to", formatCustomRangeParam(t));
    }
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  }

  function handleSelectFeed(feedId: string | null) {
    setSelectedFeedId(feedId);
    setIsStarredView(false);
    setSelectedArticleId(null);
    setCurrentArticle(null);
    setMobileView("list");

    startTransition(() => {
      router.push(buildUrl({ feedId }));
    });
  }

  function handleSelectStarred() {
    setSelectedFeedId(null);
    setIsStarredView(true);
    setSelectedArticleId(null);
    setCurrentArticle(null);
    setMobileView("list");

    startTransition(() => {
      router.push(buildUrl({ starred: true }));
    });
  }

  function handleDateRangeChange(next: DateRangeSelection) {
    setDateRange(next.range);
    setCustomFrom(next.from);
    setCustomTo(next.to);
    startTransition(() => {
      router.push(
        buildUrl({
          feedId: selectedFeedId,
          starred: isStarredView,
          range: next.range,
          from: next.from,
          to: next.to,
        }),
      );
    });
  }

  async function handleSelectArticle(articleId: string) {
    setSelectedArticleId(articleId);
    setMobileView("reader");

    // Clear previous article so the reader doesn't show stale content while
    // the next article fetches.
    if (currentArticle?.id !== articleId) {
      setCurrentArticle(null);
    }
    setIsArticleLoading(true);

    // Mark as read optimistically
    setArticles((prev) =>
      prev.map((a) => (a.id === articleId && !a.isRead ? { ...a, isRead: true } : a)),
    );

    // Fetch full article content
    try {
      const res = await fetch(`/api/articles/${articleId}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentArticle(data.article);
      }
    } catch (error) {
      console.error("Failed to fetch article:", error);
    } finally {
      setIsArticleLoading(false);
    }

    // Persist read state
    await markRead(articleId);
  }

  async function handleToggleStar(articleId: string) {
    // Optimistic update
    if (currentArticle && currentArticle.id === articleId) {
      setCurrentArticle({
        ...currentArticle,
        isStarred: !currentArticle.isStarred,
      });
    }

    await toggleStar(articleId);
    refresh();
  }

  async function handleDeleteFeed(feedId: string) {
    await deleteFeed(feedId);
    if (selectedFeedId === feedId) {
      setSelectedFeedId(null);
      setSelectedArticleId(null);
      setCurrentArticle(null);
    }
    refresh();
  }

  async function handleMarkAllRead() {
    await markAllRead(selectedFeedId ?? undefined);
    refresh();
  }

  async function handleRefreshFeed(feedId: string) {
    try {
      await refreshFeed(feedId);
    } catch (error) {
      console.error("Failed to refresh feed:", error);
    }
    refresh();
  }

  async function handleRefreshAll() {
    setIsRefreshing(true);
    try {
      await refreshAllFeeds();
      refresh();
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleLoadMore() {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const page = await loadMoreArticles({
        feedId: selectedFeedId,
        starred: isStarredView,
        range: dateRange,
        from: customFrom ? formatCustomRangeParam(customFrom) : undefined,
        to: customTo ? formatCustomRangeParam(customTo) : undefined,
        cursor: nextCursor,
      });
      setArticles((prev) => [...prev, ...page.articles]);
      setNextCursor(page.nextCursor);
    } catch (err) {
      console.error("Failed to load more articles:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }

  const displayedArticles = search.results ?? articles;

  // ---- Phase 5: bulk selection model (UI-only) -----------------------------

  const handleToggleCheck = useCallback(
    (id: string, event: React.MouseEvent) => {
      setCheckedIds((prev) => {
        const next = new Set(prev);
        // Shift-click: range-select between last toggled and this one.
        if (event.shiftKey && lastCheckedIdRef.current) {
          const ids = displayedArticles.map((a) => a.id);
          const a = ids.indexOf(lastCheckedIdRef.current);
          const b = ids.indexOf(id);
          if (a !== -1 && b !== -1) {
            const [lo, hi] = a < b ? [a, b] : [b, a];
            for (let i = lo; i <= hi; i++) next.add(ids[i]);
            lastCheckedIdRef.current = id;
            return next;
          }
        }
        if (next.has(id)) next.delete(id);
        else next.add(id);
        lastCheckedIdRef.current = id;
        return next;
      });
    },
    [displayedArticles],
  );

  const handleClearSelection = useCallback(() => {
    setCheckedIds(new Set());
    lastCheckedIdRef.current = null;
  }, []);

  const handleSelectAllVisible = useCallback(() => {
    setCheckedIds(new Set(displayedArticles.map((a) => a.id)));
  }, [displayedArticles]);

  // Bulk actions loop existing single-id server actions. Optimistic UI
  // first, then the actual mutations in parallel, then refresh().
  const handleBulkMarkRead = useCallback(async () => {
    if (checkedIds.size === 0) return;
    setIsBulkPending(true);
    const ids = Array.from(checkedIds);
    setArticles((prev) =>
      prev.map((a) => (checkedIds.has(a.id) && !a.isRead ? { ...a, isRead: true } : a)),
    );
    try {
      await Promise.all(
        ids
          .filter((id) => !displayedArticles.find((a) => a.id === id)?.isRead)
          .map((id) => markRead(id)),
      );
    } finally {
      setIsBulkPending(false);
      handleClearSelection();
      refresh();
    }
  }, [checkedIds, displayedArticles, handleClearSelection, refresh]);

  const handleBulkMarkUnread = useCallback(async () => {
    if (checkedIds.size === 0) return;
    setIsBulkPending(true);
    const ids = Array.from(checkedIds);
    setArticles((prev) =>
      prev.map((a) => (checkedIds.has(a.id) && a.isRead ? { ...a, isRead: false } : a)),
    );
    try {
      await Promise.all(
        ids
          .filter((id) => displayedArticles.find((a) => a.id === id)?.isRead)
          .map((id) => markUnread(id)),
      );
    } finally {
      setIsBulkPending(false);
      handleClearSelection();
      refresh();
    }
  }, [checkedIds, displayedArticles, handleClearSelection, refresh]);

  const handleBulkToggleStar = useCallback(async () => {
    if (checkedIds.size === 0) return;
    const items = displayedArticles.filter((a) => checkedIds.has(a.id));
    if (items.length === 0) return;
    // Coherent target state: if every checked is already starred, unstar
    // them; otherwise star the unstarred ones. Uses `toggleStar(id)` which
    // flips state — we only call it for items whose state needs to change.
    const target = items.every((a) => a.isStarred) ? false : true;
    const ids = items.filter((a) => a.isStarred !== target).map((a) => a.id);
    if (ids.length === 0) return;
    setIsBulkPending(true);
    setArticles((prev) =>
      prev.map((a) => (ids.includes(a.id) ? { ...a, isStarred: target } : a)),
    );
    try {
      await Promise.all(ids.map((id) => toggleStar(id)));
    } finally {
      setIsBulkPending(false);
      handleClearSelection();
      refresh();
    }
  }, [checkedIds, displayedArticles, handleClearSelection, refresh]);

  const readerSwipe = useSwipe({
    onSwipeLeft: () => {
      const i = displayedArticles.findIndex((a) => a.id === selectedArticleId);
      if (i >= 0 && i + 1 < displayedArticles.length) {
        handleSelectArticle(displayedArticles[i + 1].id);
      }
    },
    onSwipeRight: () => setMobileView("list"),
  });

  useKeyboardShortcuts({
    onNextArticle: () => {
      const currentIndex = displayedArticles.findIndex(
        (a) => a.id === selectedArticleId,
      );
      const nextIndex = currentIndex + 1;
      if (nextIndex < displayedArticles.length) {
        handleSelectArticle(displayedArticles[nextIndex].id);
      }
    },
    onPrevArticle: () => {
      const currentIndex = displayedArticles.findIndex(
        (a) => a.id === selectedArticleId,
      );
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        handleSelectArticle(displayedArticles[prevIndex].id);
      }
    },
    onToggleStar: () => {
      if (selectedArticleId) handleToggleStar(selectedArticleId);
    },
    onToggleRead: async () => {
      if (!selectedArticleId) return;
      const article = displayedArticles.find(
        (a) => a.id === selectedArticleId,
      );
      if (article) {
        if (article.isRead) {
          await markUnread(selectedArticleId);
        } else {
          await markRead(selectedArticleId);
        }
        refresh();
      }
    },
    onRefresh: () => refresh(),
    onRefreshAll: () => handleRefreshAll(),
    onOpenOriginal: () => {
      if (currentArticle?.link) {
        window.open(currentArticle.link, "_blank", "noopener,noreferrer");
      }
    },
    onToggleSelectCurrent: () => {
      if (!selectedArticleId) return;
      setCheckedIds((prev) => {
        const next = new Set(prev);
        if (next.has(selectedArticleId)) next.delete(selectedArticleId);
        else next.add(selectedArticleId);
        lastCheckedIdRef.current = selectedArticleId;
        return next;
      });
    },
  });

  const heading = isStarredView
    ? "Starred"
    : selectedFeedId
      ? feeds.find((f) => f.id === selectedFeedId)?.title ?? "Articles"
      : "All Articles";

  const railActiveMode = isStarredView
    ? "starred"
    : selectedFeedId
      ? null
      : "inbox";

  const modeLabel = isStarredView
    ? "Starred"
    : selectedFeedId
      ? "Feed"
      : "Inbox";

  const crumbs = useMemo(() => {
    const parts: { label: string; className?: string }[] = [
      { label: "Feed", className: "text-muted-foreground/80" },
      { label: modeLabel },
    ];
    if (selectedFeedId && !isStarredView) {
      parts.push({
        label: feeds.find((f) => f.id === selectedFeedId)?.title ?? "Feed",
      });
    }
    return parts;
  }, [feeds, isStarredView, modeLabel, selectedFeedId]);

  const visibleArticleCount = displayedArticles.length;
  const visibleUnreadCount = useMemo(
    () => displayedArticles.filter((a) => !a.isRead).length,
    [displayedArticles],
  );

  const openPalette = () => setPaletteOpen(true);

  return (
    <div className="h-dvh w-screen overflow-hidden">
      <a
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-3 focus-visible:top-3 focus-visible:z-[60] focus-visible:rounded-md focus-visible:border focus-visible:bg-popover focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-popover-foreground focus-visible:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Skip to main content
      </a>
      <main id="main-content" tabIndex={-1} className="h-full outline-none">
      {/* Mobile: cockpit-styled stacked layout. Top mode badge + heading,
          a bottom command bar with primary mode buttons and a centered
          ⌘K trigger. The mobileView state machine ("sidebar" | "list" |
          "reader") is preserved verbatim. */}
      <div className="flex h-full flex-col md:hidden pt-[env(safe-area-inset-top)]">
        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border/60 bg-[var(--cockpit-bg)] px-3">
          {mobileView === "reader" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -ml-1"
              onClick={() => setMobileView("list")}
              aria-label="Back to queue"
              title="Back to queue"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </Button>
          )}
          <span
            className="cockpit-mono inline-flex shrink-0 items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
            aria-hidden="true"
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full bg-[var(--cockpit-accent)]",
                (isRefreshing || isPending) && "animate-pulse",
              )}
            />
            <span className="text-foreground/85">
              {mobileView === "reader"
                ? "Reader"
                : mobileView === "sidebar"
                  ? "Feeds"
                  : isStarredView
                    ? "Starred"
                    : "Queue"}
            </span>
          </span>
          <span aria-hidden="true" className="text-muted-foreground/40">·</span>
          <h1 className="flex-1 truncate text-[13px] font-semibold tracking-tight">
            {heading}
          </h1>
          {mobileView !== "reader" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={handleRefreshAll}
              disabled={isRefreshing || isPending}
              aria-label="Refresh all feeds"
              title="Refresh all feeds"
            >
              <RefreshCw
                className={cn(
                  "h-4 w-4",
                  (isRefreshing || isPending) && "animate-spin",
                )}
                aria-hidden="true"
              />
            </Button>
          )}
        </div>
        <div className="min-h-0 flex-1">
          {mobileView === "sidebar" && (
            <Sidebar
              feeds={feeds}
              folders={folders}
              selectedFeedId={selectedFeedId}
              onSelectFeed={handleSelectFeed}
              onDeleteFeed={handleDeleteFeed}
              onRefreshFeed={handleRefreshFeed}
              onUpdateFeed={refresh}
              onFeedAdded={refresh}
              isStarredView={isStarredView}
            />
          )}
          {mobileView === "list" && (
            <ArticleList
              articles={displayedArticles}
              selectedArticleId={selectedArticleId}
              onSelectArticle={handleSelectArticle}
              heading={heading}
              searchQuery={search.query}
              onSearchChange={search.onChange}
              isSearching={search.isSearching}
              dateRange={dateRange}
              customFrom={customFrom}
              customTo={customTo}
              onDateRangeChange={handleDateRangeChange}
              onMarkAllRead={handleMarkAllRead}
              searchError={search.error}
              hasFeeds={feeds.length > 0}
              onRefreshAll={handleRefreshAll}
              hasMore={!search.results && nextCursor !== null}
              isLoadingMore={isLoadingMore}
              onLoadMore={handleLoadMore}
              checkedIds={checkedIds}
              onToggleCheck={handleToggleCheck}
              onClearSelection={handleClearSelection}
              onSelectAllVisible={handleSelectAllVisible}
              onBulkMarkRead={handleBulkMarkRead}
              onBulkMarkUnread={handleBulkMarkUnread}
              onBulkToggleStar={handleBulkToggleStar}
              isBulkPending={isBulkPending}
            />
          )}
          {mobileView === "reader" && (
            <div className="h-full" {...readerSwipe}>
              <ReadingPane
                article={currentArticle}
                isLoading={isArticleLoading}
                onToggleStar={handleToggleStar}
              />
            </div>
          )}
        </div>
        <MobileCommandBar
          mobileView={mobileView}
          isStarredView={isStarredView}
          hasReader={Boolean(selectedArticleId)}
          totalUnread={totalUnread}
          starredCount={starredCount}
          onSelectFeeds={() => setMobileView("sidebar")}
          onSelectQueue={() => {
            if (isStarredView) {
              handleSelectFeed(null);
            } else {
              setMobileView("list");
            }
          }}
          onSelectStarred={handleSelectStarred}
          onSelectReader={() => {
            if (selectedArticleId) setMobileView("reader");
          }}
          onOpenPalette={openPalette}
        />
      </div>

      {/* Desktop: cockpit shell — context bar + nav rail + (sidebar | list |
          reader) + status bar. The middle band keeps the existing
          ResizablePanelGroup so resize/scroll behavior is preserved. */}
      <div className="hidden md:flex h-full flex-col">
        <ContextBar
          crumbs={crumbs}
          onOpenPalette={openPalette}
          onRefreshAll={handleRefreshAll}
          isRefreshing={isRefreshing || isPending}
        />

        <div className="flex min-h-0 flex-1">
          <NavRail
            activeMode={railActiveMode}
            totalUnread={totalUnread}
            starredCount={starredCount}
            onSelectInbox={() => handleSelectFeed(null)}
            onSelectStarred={handleSelectStarred}
            onFeedAdded={refresh}
          />

          <ResizablePanelGroup
            orientation="horizontal"
            id="app-layout"
            className="flex-1"
          >
            <ResizablePanel
              id="sidebar"
              defaultSize="22%"
              minSize="180px"
              maxSize="32%"
              className="bg-card"
            >
              <Sidebar
                feeds={feeds}
                folders={folders}
                selectedFeedId={selectedFeedId}
                onSelectFeed={handleSelectFeed}
                onDeleteFeed={handleDeleteFeed}
                onRefreshFeed={handleRefreshFeed}
                onUpdateFeed={refresh}
                onFeedAdded={refresh}
                isStarredView={isStarredView}
              />
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel
              id="article-list"
              defaultSize="32%"
              minSize="250px"
              className="bg-background"
            >
              <ArticleList
                articles={displayedArticles}
                selectedArticleId={selectedArticleId}
                onSelectArticle={handleSelectArticle}
                heading={heading}
                searchQuery={search.query}
                onSearchChange={search.onChange}
                isSearching={search.isSearching}
                dateRange={dateRange}
                customFrom={customFrom}
                customTo={customTo}
                onDateRangeChange={handleDateRangeChange}
                onMarkAllRead={handleMarkAllRead}
                searchError={search.error}
                hasFeeds={feeds.length > 0}
                onRefreshAll={handleRefreshAll}
                hasMore={!search.results && nextCursor !== null}
                isLoadingMore={isLoadingMore}
                onLoadMore={handleLoadMore}
                checkedIds={checkedIds}
                onToggleCheck={handleToggleCheck}
                onClearSelection={handleClearSelection}
                onSelectAllVisible={handleSelectAllVisible}
                onBulkMarkRead={handleBulkMarkRead}
                onBulkMarkUnread={handleBulkMarkUnread}
                onBulkToggleStar={handleBulkToggleStar}
                isBulkPending={isBulkPending}
              />
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel
              id="reading-pane"
              defaultSize="46%"
              minSize="380px"
              className="bg-[var(--cockpit-inspector-bg)]"
            >
              <ReadingPane
                article={currentArticle}
                isLoading={isArticleLoading}
                onToggleStar={handleToggleStar}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        <StatusBar
          modeLabel={modeLabel}
          itemCount={visibleArticleCount}
          unreadCount={visibleUnreadCount}
          selectedCount={checkedIds.size}
          isRefreshing={isRefreshing || isPending}
        />
      </div>
      </main>
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        feeds={feeds}
        folders={folders}
        articles={displayedArticles}
        selectedArticleId={selectedArticleId}
        currentArticleLink={currentArticle?.link ?? null}
        currentArticleStarred={Boolean(currentArticle?.isStarred)}
        currentArticleRead={
          displayedArticles.find((a) => a.id === selectedArticleId)?.isRead ?? false
        }
        onSelectAll={() => handleSelectFeed(null)}
        onSelectStarred={handleSelectStarred}
        onSelectFeed={(id) => handleSelectFeed(id)}
        onSelectArticle={(id) => handleSelectArticle(id)}
        onRefreshAll={handleRefreshAll}
        onMarkAllRead={handleMarkAllRead}
        onToggleStar={handleToggleStar}
        onToggleRead={async (id) => {
          const article = displayedArticles.find((a) => a.id === id);
          if (!article) return;
          if (article.isRead) {
            await markUnread(id);
          } else {
            await markRead(id);
          }
          refresh();
        }}
        onOpenOriginal={() => {
          if (currentArticle?.link) {
            window.open(currentArticle.link, "_blank", "noopener,noreferrer");
          }
        }}
      />
    </div>
  );
}

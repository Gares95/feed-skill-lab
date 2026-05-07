"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  AlertCircle,
  CheckCheck,
  CircleDot,
  FileText,
  Inbox,
  Loader2,
  RefreshCw,
  Search,
  Square,
  SquareCheck,
  Star,
  StarOff,
  X,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { ArticleRow } from "./ArticleRow";
import { type DateRange } from "@/lib/date-range";
import { DateRangePicker } from "./DateRangePicker";
import type { DateRangeSelection } from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";

interface QueueEmptyStateProps {
  eyebrow: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  description: string;
  tone?: "default" | "error";
  action?: React.ReactNode;
  hints?: React.ReactNode;
}

function QueueEmptyState({
  eyebrow,
  icon: Icon,
  title,
  description,
  tone = "default",
  action,
  hints,
}: QueueEmptyStateProps) {
  const isError = tone === "error";
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center"
    >
      <div
        aria-hidden="true"
        className={cn(
          "relative inline-flex h-12 w-12 items-center justify-center rounded-md border",
          isError
            ? "border-destructive/40 bg-[color-mix(in_oklch,var(--destructive)_14%,transparent)]"
            : "border-[color-mix(in_oklch,var(--cockpit-accent)_38%,transparent)] bg-[color-mix(in_oklch,var(--cockpit-accent)_14%,transparent)]",
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5",
            isError ? "text-destructive" : "text-[var(--cockpit-accent)]",
          )}
          aria-hidden={true}
        />
      </div>
      <div className="space-y-1.5">
        <p
          className={cn(
            "cockpit-mono text-[10px] uppercase tracking-[0.22em]",
            isError
              ? "text-destructive/85"
              : "text-[var(--cockpit-accent)]/85",
          )}
        >
          {eyebrow}
        </p>
        <p
          className={cn(
            "text-balance text-[14px] font-medium tracking-[-0.01em]",
            isError ? "text-destructive" : "text-foreground",
          )}
        >
          {title}
        </p>
        <p className="text-[12px] text-muted-foreground">{description}</p>
      </div>
      {action}
      {hints && <div className="pt-1">{hints}</div>}
    </div>
  );
}

export interface ArticleWithFeed {
  id: string;
  title: string;
  feedTitle: string;
  publishedAt: Date;
  isRead: boolean;
  isStarred: boolean;
}

interface ArticleListProps {
  articles: ArticleWithFeed[];
  selectedArticleId: string | null;
  onSelectArticle: (articleId: string) => void;
  heading: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSearching: boolean;
  dateRange: DateRange;
  customFrom?: Date;
  customTo?: Date;
  onDateRangeChange: (next: DateRangeSelection) => void;
  onMarkAllRead: () => void;
  searchError: string | null;
  hasFeeds: boolean;
  onRefreshAll: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  // Phase 5: selection model (UI-only multi-select)
  checkedIds: Set<string>;
  onToggleCheck: (id: string, event: React.MouseEvent) => void;
  onClearSelection: () => void;
  onSelectAllVisible: () => void;
  onBulkMarkRead: () => void;
  onBulkMarkUnread: () => void;
  onBulkToggleStar: () => void;
  isBulkPending: boolean;
}

export function ArticleList({
  articles,
  selectedArticleId,
  onSelectArticle,
  heading,
  searchQuery,
  onSearchChange,
  isSearching,
  dateRange,
  customFrom,
  customTo,
  onDateRangeChange,
  onMarkAllRead,
  searchError,
  hasFeeds,
  onRefreshAll,
  hasMore,
  isLoadingMore,
  onLoadMore,
  checkedIds,
  onToggleCheck,
  onClearSelection,
  onSelectAllVisible,
  onBulkMarkRead,
  onBulkMarkUnread,
  onBulkToggleStar,
  isBulkPending,
}: ArticleListProps) {
  const hasUnread = articles.some((a) => !a.isRead);
  const sectionRef = useRef<HTMLElement>(null);
  const checkedCount = checkedIds.size;
  const selectionActive = checkedCount > 0;

  // Derived flags for the bulk toolbar
  const checkedSummary = useMemo(() => {
    let allRead = true;
    let allStarred = true;
    let allUnread = true;
    let allUnstarred = true;
    for (const a of articles) {
      if (!checkedIds.has(a.id)) continue;
      if (a.isRead) allUnread = false;
      else allRead = false;
      if (a.isStarred) allUnstarred = false;
      else allStarred = false;
    }
    return { allRead, allStarred, allUnread, allUnstarred };
  }, [articles, checkedIds]);

  const allVisibleChecked =
    articles.length > 0 && articles.every((a) => checkedIds.has(a.id));

  // Local Escape handler — clears selection when active. Scoped to this
  // section so we don't fight dialog/menu Escape handling elsewhere.
  useEffect(() => {
    if (!selectionActive) return;
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)
      ) {
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onClearSelection();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selectionActive, onClearSelection]);

  return (
    <section
      ref={sectionRef}
      aria-label="Article queue"
      className="flex h-full flex-col"
    >
      <div className="flex h-11 items-center gap-2 px-4">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <Input
          type="text"
          placeholder="Search articles…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-7 border-none bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 shrink-0"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            title="Clear search"
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </Button>
        )}
      </div>

      {/* Header / queue toolbar — flips into bulk mode when items are checked */}
      {selectionActive ? (
        <div
          role="toolbar"
          aria-label="Bulk actions"
          className={cn(
            "flex h-9 items-center gap-1 border-b border-[color-mix(in_oklch,var(--cockpit-accent)_30%,var(--border))] px-2",
            "bg-[color-mix(in_oklch,var(--cockpit-accent)_10%,transparent)]",
          )}
        >
          <button
            type="button"
            onClick={() =>
              allVisibleChecked ? onClearSelection() : onSelectAllVisible()
            }
            className="inline-flex h-6 items-center gap-1.5 rounded-sm px-1.5 text-[11px] text-foreground hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            aria-label={
              allVisibleChecked ? "Deselect all visible" : "Select all visible"
            }
            title={allVisibleChecked ? "Deselect all visible" : "Select all visible"}
          >
            {allVisibleChecked ? (
              <SquareCheck
                className="h-3.5 w-3.5 text-[var(--cockpit-accent)]"
                aria-hidden="true"
              />
            ) : (
              <Square
                className="h-3.5 w-3.5 text-muted-foreground"
                aria-hidden="true"
              />
            )}
          </button>
          <span className="cockpit-mono text-[11px] text-foreground/90">
            {checkedCount}{" "}
            <span className="text-muted-foreground">selected</span>
          </span>

          <span aria-hidden="true" className="mx-1 h-4 w-px bg-border/60" />

          <Button
            variant="ghost"
            size="sm"
            className="h-6 gap-1 px-1.5 text-[11px]"
            onClick={onBulkMarkRead}
            disabled={isBulkPending || checkedSummary.allRead}
            title="Mark selected as read"
          >
            <CheckCheck className="h-3 w-3" aria-hidden="true" />
            Read
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 gap-1 px-1.5 text-[11px]"
            onClick={onBulkMarkUnread}
            disabled={isBulkPending || checkedSummary.allUnread}
            title="Mark selected as unread"
          >
            <CircleDot className="h-3 w-3" aria-hidden="true" />
            Unread
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 gap-1 px-1.5 text-[11px]"
            onClick={onBulkToggleStar}
            disabled={isBulkPending}
            title={
              checkedSummary.allStarred
                ? "Unstar selected"
                : "Star selected"
            }
          >
            {checkedSummary.allStarred ? (
              <StarOff className="h-3 w-3" aria-hidden="true" />
            ) : (
              <Star className="h-3 w-3" aria-hidden="true" />
            )}
            {checkedSummary.allStarred ? "Unstar" : "Star"}
          </Button>

          <span className="ml-auto inline-flex items-center gap-2">
            {isBulkPending && (
              <Loader2
                className="h-3 w-3 animate-spin text-muted-foreground"
                aria-label="Working"
              />
            )}
            <button
              type="button"
              onClick={onClearSelection}
              className="inline-flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-accent/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
              aria-label="Clear selection"
              title="Clear selection"
            >
              <Kbd>esc</Kbd>
              clear
            </button>
          </span>
        </div>
      ) : (
        <div className="flex h-9 items-center gap-2 border-b border-border/60 px-4">
          <h2 className="truncate text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {searchQuery ? "Search Results" : heading}
          </h2>
          {!searchQuery && (
            <DateRangePicker
              range={dateRange}
              from={customFrom}
              to={customTo}
              onChange={onDateRangeChange}
            />
          )}
          <span className="cockpit-mono ml-auto text-[11px] text-muted-foreground/80">
            {isSearching ? "…" : articles.length}
          </span>
          {!searchQuery && hasUnread && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onMarkAllRead}
              aria-label="Mark all as read"
              title="Mark all as read"
            >
              <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          )}
        </div>
      )}

      {searchError ? (
        <QueueEmptyState
          tone="error"
          eyebrow="Search failed"
          icon={AlertCircle}
          title={searchError}
          description="Try a different query or clear the search."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSearchChange("")}
              className="h-7"
            >
              Clear search
            </Button>
          }
        />
      ) : articles.length === 0 ? (
        searchQuery ? (
          <QueueEmptyState
            eyebrow="No matches"
            icon={Search}
            title={`No results for “${searchQuery}”`}
            description="Try different keywords, or clear the search."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSearchChange("")}
                className="h-7"
              >
                Clear search
              </Button>
            }
          />
        ) : !hasFeeds ? (
          <QueueEmptyState
            eyebrow="Queue empty"
            icon={Inbox}
            title="No feeds yet"
            description="Add your first feed from the rail or run “Add feed” from the palette."
            hints={
              <>
                <span className="cockpit-mono inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  <KbdGroup>
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                  </KbdGroup>
                  open palette
                </span>
              </>
            }
          />
        ) : (
          <QueueEmptyState
            eyebrow="All clear"
            icon={FileText}
            title="All caught up"
            description="No articles in this view. Refresh to check for new items."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={onRefreshAll}
                className="h-7"
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Refresh feeds
              </Button>
            }
            hints={
              <span className="cockpit-mono inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <KbdGroup>
                  <Kbd>⇧</Kbd>
                  <Kbd>R</Kbd>
                </KbdGroup>
                refresh all
              </span>
            }
          />
        )
      ) : (
        <ScrollArea className="flex-1">
          {articles.map((article) => (
            <ArticleRow
              key={article.id}
              id={article.id}
              title={article.title}
              feedTitle={article.feedTitle}
              publishedAt={article.publishedAt}
              isRead={article.isRead}
              isStarred={article.isStarred}
              isCurrent={selectedArticleId === article.id}
              isChecked={checkedIds.has(article.id)}
              selectionActive={selectionActive}
              onSelect={onSelectArticle}
              onToggleCheck={onToggleCheck}
            />
          ))}
          {hasMore && (
            <div className="flex justify-center border-t border-border/40 p-3">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5"
                onClick={onLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Loading…
                  </>
                ) : (
                  "Load more articles"
                )}
              </Button>
            </div>
          )}
          {/* Footer hint — surface the keyboard model */}
          <div className="flex items-center justify-end gap-3 border-t border-border/40 px-4 py-2 text-[10.5px] text-muted-foreground/80">
            <span className="inline-flex items-center gap-1">
              <KbdGroup>
                <Kbd>J</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
              navigate
            </span>
            <span className="inline-flex items-center gap-1">
              <Kbd>X</Kbd>
              select
            </span>
            <span className="inline-flex items-center gap-1">
              <Kbd>S</Kbd>
              star
            </span>
            <span className="inline-flex items-center gap-1">
              <Kbd>M</Kbd>
              mark
            </span>
          </div>
        </ScrollArea>
      )}
    </section>
  );
}

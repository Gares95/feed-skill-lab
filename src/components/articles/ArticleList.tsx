"use client";

import {
  AlertCircle,
  CheckCheck,
  FileText,
  Inbox,
  Loader2,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArticleRow } from "./ArticleRow";
import { type DateRange } from "@/lib/date-range";
import { DateRangePicker } from "./DateRangePicker";
import type { DateRangeSelection } from "@/components/layout/AppShell";

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
}: ArticleListProps) {
  const hasUnread = articles.some((a) => !a.isRead);
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-11 items-center gap-2 px-4">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <Input
          type="text"
          placeholder="Search articles..."
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

      <div className="flex h-9 items-center gap-2 border-b px-4">
        <h2 className="truncate text-xs font-medium text-muted-foreground">
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
        <span className="ml-auto text-[11px] text-muted-foreground/80 tabular-nums">
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

      {searchError ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center text-muted-foreground">
          <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-destructive">{searchError}</p>
            <p className="text-xs">Try a different query or clear the search.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSearchChange("")}
            className="h-7"
          >
            Clear search
          </Button>
        </div>
      ) : articles.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center text-muted-foreground">
          {searchQuery ? (
            <>
              <Search className="h-8 w-8" aria-hidden="true" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  No results for &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-xs">Try different keywords, or clear the search.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSearchChange("")}
                className="h-7"
              >
                Clear search
              </Button>
            </>
          ) : !hasFeeds ? (
            <>
              <Inbox className="h-8 w-8" aria-hidden="true" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">No feeds yet</p>
                <p className="text-xs">
                  Add your first feed from the sidebar to start reading.
                </p>
              </div>
            </>
          ) : (
            <>
              <FileText className="h-8 w-8" aria-hidden="true" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">All caught up</p>
                <p className="text-xs">
                  No articles in this view. Refresh to check for new items.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onRefreshAll}
                className="h-7"
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Refresh feeds
              </Button>
            </>
          )}
        </div>
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
              isSelected={selectedArticleId === article.id}
              onSelect={onSelectArticle}
            />
          ))}
          {hasMore && (
            <div className="flex justify-center border-t p-3">
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
        </ScrollArea>
      )}
    </div>
  );
}

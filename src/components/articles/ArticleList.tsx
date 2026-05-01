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
import { format, isThisYear, isToday, isYesterday } from "date-fns";
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

interface DayGroup {
  key: string;
  label: string;
  articles: ArticleWithFeed[];
}

function dayLabel(d: Date): string {
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  if (isThisYear(d)) return format(d, "EEE, MMM d");
  return format(d, "MMM d, yyyy");
}

// Sequential grouping. The article list arrives sorted by publishedAt
// desc; same-day articles cluster naturally. If the list ever ships out
// of order we just produce extra adjacent groups, which is harmless.
function groupByDay(articles: ArticleWithFeed[]): DayGroup[] {
  const groups: DayGroup[] = [];
  let current: DayGroup | null = null;
  for (const a of articles) {
    const d = new Date(a.publishedAt);
    const key = format(d, "yyyy-MM-dd");
    if (!current || current.key !== key) {
      current = { key, label: dayLabel(d), articles: [] };
      groups.push(current);
    }
    current.articles.push(a);
  }
  return groups;
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
  // Search results are not date-sorted in a useful way for day groups;
  // render flat under a single "Search results" heading.
  const useDayGroups = !searchQuery;
  const groups = useDayGroups ? groupByDay(articles) : null;

  return (
    <section aria-label="Article list" className="flex h-full flex-col">
      <div className="flex h-11 items-center gap-2 px-5">
        <Search
          className="h-4 w-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
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

      <div className="flex h-10 items-center gap-3 px-5 pb-1">
        <h2 className="truncate text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
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
        <span className="ml-auto flex items-center gap-2">
          <span className="text-[11px] tabular-nums text-muted-foreground/70">
            {isSearching ? "…" : articles.length}
          </span>
          {!searchQuery && hasUnread && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-60 transition-opacity duration-[var(--motion-fast)] ease-[var(--ease-out-quint)] hover:opacity-100 focus-visible:opacity-100"
              onClick={onMarkAllRead}
              aria-label="Mark all as read"
              title="Mark all as read"
            >
              <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          )}
        </span>
      </div>

      {searchError ? (
        <EmptyState
          icon={<AlertCircle className="h-6 w-6 text-destructive/80" aria-hidden="true" />}
          eyebrow="Search error"
          title={searchError}
          body="Try a different query or clear the search."
          action={{ label: "Clear search", onClick: () => onSearchChange("") }}
          tone="destructive"
        />
      ) : articles.length === 0 ? (
        <>
          {searchQuery ? (
            <EmptyState
              icon={<Search className="h-6 w-6 text-muted-foreground/70" aria-hidden="true" />}
              eyebrow="No results"
              title={`Nothing for “${searchQuery}”`}
              body="Try different keywords, or clear the search."
              action={{ label: "Clear search", onClick: () => onSearchChange("") }}
            />
          ) : !hasFeeds ? (
            <EmptyState
              icon={<Inbox className="h-6 w-6 text-muted-foreground/70" aria-hidden="true" />}
              eyebrow="Empty queue"
              title="No feeds yet"
              body="Add your first feed from the sidebar to start reading."
            />
          ) : (
            <EmptyState
              icon={<FileText className="h-6 w-6 text-muted-foreground/70" aria-hidden="true" />}
              eyebrow="All caught up"
              title="Nothing left to read"
              body="No articles in this view. Refresh to check for new items."
              action={{
                label: "Refresh feeds",
                onClick: onRefreshAll,
                icon: <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />,
              }}
            />
          )}
        </>
      ) : (
        <ScrollArea className="flex-1">
          {groups
            ? groups.map((group, idx) => (
                <div key={group.key} className={idx > 0 ? "mt-5" : ""}>
                  <div className="flex items-center gap-3 px-5 pb-1.5 pt-2">
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/80">
                      {group.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-border/60"
                    />
                  </div>
                  {group.articles.map((article) => (
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
                </div>
              ))
            : articles.map((article) => (
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
            <div className="flex justify-center px-5 py-6">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
                onClick={onLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Loading…
                  </>
                ) : (
                  "Load more"
                )}
              </Button>
            </div>
          )}
        </ScrollArea>
      )}
    </section>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  body: string;
  action?: { label: string; onClick: () => void; icon?: React.ReactNode };
  tone?: "default" | "destructive";
}

function EmptyState({ icon, eyebrow, title, body, action, tone = "default" }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/80">
        {eyebrow}
      </span>
      {icon}
      <div className="space-y-1.5 max-w-[28ch]">
        <p
          className={
            tone === "destructive"
              ? "text-[15px] font-semibold tracking-tight text-destructive"
              : "text-[15px] font-semibold tracking-tight text-foreground"
          }
        >
          {title}
        </p>
        <p className="text-[13px] leading-relaxed text-muted-foreground">{body}</p>
      </div>
      {action && (
        <Button
          variant="ghost"
          size="sm"
          onClick={action.onClick}
          className="h-8 gap-1.5 rounded-full border border-border/60 bg-transparent px-3 text-[12px] font-medium text-muted-foreground hover:border-border hover:text-foreground"
        >
          {action.icon}
          {action.label}
        </Button>
      )}
    </div>
  );
}

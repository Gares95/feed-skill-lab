"use client";

import { CheckCheck, FileText, Search, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArticleRow } from "./ArticleRow";
import { cn } from "@/lib/utils";
import { DATE_RANGE_LABELS, type DateRange } from "@/lib/date-range";

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
  onDateRangeChange: (range: DateRange) => void;
  onMarkAllRead: () => void;
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
  onDateRangeChange,
  onMarkAllRead,
}: ArticleListProps) {
  const hasUnread = articles.some((a) => !a.isRead);
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-12 items-center gap-2 border-b px-4">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
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
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="flex h-8 items-center gap-2 border-b px-4">
        <h2 className="text-xs font-medium text-muted-foreground">
          {searchQuery ? "Search Results" : heading}
        </h2>
        {!searchQuery && (
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value as DateRange)}
            className="ml-auto h-6 rounded border-none bg-transparent text-xs text-muted-foreground hover:text-foreground focus:outline-none focus:ring-0"
            aria-label="Filter by date"
          >
            {(Object.keys(DATE_RANGE_LABELS) as DateRange[]).map((r) => (
              <option key={r} value={r} className="bg-background">
                {DATE_RANGE_LABELS[r]}
              </option>
            ))}
          </select>
        )}
        <span
          className={cn(
            "text-xs text-muted-foreground tabular-nums",
            searchQuery && "ml-auto",
          )}
        >
          {isSearching ? "..." : articles.length}
        </span>
        {!searchQuery && hasUnread && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onMarkAllRead}
            title="Mark all as read"
          >
            <CheckCheck className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {articles.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
          <FileText className="h-8 w-8" />
          <p className="text-sm">
            {searchQuery ? "No results found" : "No articles"}
          </p>
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
        </ScrollArea>
      )}
    </div>
  );
}

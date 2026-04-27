"use client";

import { format } from "date-fns";
import { Clock, ExternalLink, Loader2, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { estimateReadingTime } from "@/lib/reading-time";
import { cn } from "@/lib/utils";

interface ArticleHeaderProps {
  title: string;
  author: string | null;
  publishedAt: Date;
  feedTitle: string;
  link: string;
  content: string;
  isStarred: boolean;
  onToggleStar: () => void;
  readerMode: boolean;
  readerLoading: boolean;
  onToggleReader: () => void;
}

export function ArticleHeader({
  title,
  author,
  publishedAt,
  feedTitle,
  link,
  content,
  isStarred,
  onToggleStar,
  readerMode,
  readerLoading,
  onToggleReader,
}: ArticleHeaderProps) {
  const readingTime = estimateReadingTime(content);
  return (
    <header className="space-y-4 border-b pb-6">
      <div className="space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {feedTitle}
        </p>
        <h1 className="text-balance text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] sm:text-[32px]">
          {title}
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {author && <span>{author}</span>}
        {author && <span aria-hidden="true">·</span>}
        <time dateTime={new Date(publishedAt).toISOString()}>
          {format(new Date(publishedAt), "MMM d, yyyy")}
        </time>
        {readingTime !== null && (
          <>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {readingTime} min read
            </span>
          </>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={readerMode ? "secondary" : "outline"}
          size="sm"
          className="h-8 gap-1.5"
          onClick={onToggleReader}
          disabled={readerLoading}
          title={
            readerMode
              ? "Show the original feed content"
              : "Extract the full article in reader mode"
          }
        >
          {readerLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles
              className={cn(
                "h-4 w-4",
                readerMode ? "text-foreground" : "text-muted-foreground",
              )}
            />
          )}
          {readerMode ? "Exit reader mode" : "Reader mode"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 active:scale-95"
          onClick={onToggleStar}
        >
          <Star
            key={isStarred ? "on" : "off"}
            className={cn(
              "h-3.5 w-3.5 transition-[transform,color,fill] duration-[var(--motion-fast)] ease-[var(--ease-spring)] animate-in zoom-in-95",
              isStarred ? "fill-star text-star" : "text-muted-foreground",
            )}
          />
          {isStarred ? "Starred" : "Star"}
        </Button>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          Open original
        </a>
      </div>
    </header>
  );
}

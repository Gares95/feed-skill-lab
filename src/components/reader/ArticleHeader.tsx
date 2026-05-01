"use client";

import { format } from "date-fns";
import { ExternalLink, Loader2, Sparkles, Star } from "lucide-react";
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
    <header className="space-y-7 pb-8">
      <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        <span className="truncate">{feedTitle}</span>
        <span aria-hidden="true" className="h-px w-4 shrink-0 bg-muted-foreground/40" />
        <time
          dateTime={new Date(publishedAt).toISOString()}
          className="shrink-0 normal-case tracking-normal tabular-nums text-muted-foreground/80"
        >
          {format(new Date(publishedAt), "MMM d, yyyy")}
        </time>
        {readingTime !== null && (
          <>
            <span aria-hidden="true" className="text-muted-foreground/40">·</span>
            <span className="shrink-0 normal-case tracking-normal tabular-nums text-muted-foreground/80">
              {readingTime} min read
            </span>
          </>
        )}
      </div>

      <h1 className="text-balance text-[30px] font-semibold leading-[1.15] tracking-[-0.022em] text-foreground sm:text-[36px]">
        {title}
      </h1>

      {author && (
        <p className="text-sm text-muted-foreground">
          By <span className="text-foreground/85">{author}</span>
        </p>
      )}

      <div className="flex flex-wrap items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleReader}
          disabled={readerLoading}
          aria-pressed={readerMode}
          className={cn(
            "h-8 gap-1.5 rounded-full px-3 text-[12px] font-medium",
            "transition-colors duration-[var(--motion-fast)] ease-[var(--ease-out-quint)]",
            readerMode
              ? "bg-primary/15 text-foreground hover:bg-primary/20"
              : "border border-border/60 bg-transparent text-muted-foreground hover:border-border hover:text-foreground",
          )}
          title={
            readerMode
              ? "Show the original feed content"
              : "Extract the full article in reader mode"
          }
        >
          {readerLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {readerMode ? "Exit reader mode" : "Reader mode"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleStar}
          aria-pressed={isStarred}
          aria-label={isStarred ? "Unstar article" : "Star article"}
          className={cn(
            "h-8 gap-1.5 rounded-full px-3 text-[12px] font-medium active:scale-95",
            isStarred ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Star
            key={isStarred ? "on" : "off"}
            className={cn(
              "h-3.5 w-3.5 transition-[transform,color,fill] duration-[var(--motion-fast)] ease-[var(--ease-spring)] animate-in zoom-in-95",
              isStarred ? "fill-star text-star" : "",
            )}
            aria-hidden="true"
          />
          {isStarred ? "Starred" : "Star"}
        </Button>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium text-muted-foreground transition-colors duration-[var(--motion-fast)] ease-[var(--ease-out-quint)] hover:text-foreground"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          Open original
        </a>
      </div>
    </header>
  );
}

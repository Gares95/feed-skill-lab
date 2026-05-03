"use client";

import { format } from "date-fns";
import { Clock, ExternalLink, Loader2, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
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
  density?: "inspect" | "focus";
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
  density = "inspect",
}: ArticleHeaderProps) {
  const readingTime = estimateReadingTime(content);
  const isFocus = density === "focus";

  return (
    <header
      className={cn(
        "border-b border-border/50",
        isFocus ? "space-y-5 pb-7" : "space-y-3 pb-4",
      )}
    >
      <div className={cn(isFocus ? "space-y-3" : "space-y-1.5")}>
        <p
          className={cn(
            "cockpit-mono uppercase tracking-[0.18em] text-muted-foreground",
            isFocus ? "text-[11px]" : "text-[10px]",
          )}
        >
          {feedTitle}
        </p>
        <h1
          className={cn(
            "text-balance font-semibold tracking-[-0.02em]",
            isFocus
              ? "text-[28px] leading-[1.18] sm:text-[32px]"
              : "text-[20px] leading-[1.25] sm:text-[22px]",
          )}
        >
          {title}
        </h1>
      </div>

      <div
        className={cn(
          "cockpit-mono flex flex-wrap items-center gap-x-2.5 gap-y-1 text-muted-foreground",
          isFocus ? "text-[12px]" : "text-[11px]",
        )}
      >
        {author && <span className="truncate text-foreground/75">{author}</span>}
        {author && <span aria-hidden="true" className="text-muted-foreground/40">·</span>}
        <time
          dateTime={new Date(publishedAt).toISOString()}
          className="tabular-nums"
        >
          {format(new Date(publishedAt), "MMM d, yyyy")}
        </time>
        {readingTime !== null && (
          <>
            <span aria-hidden="true" className="text-muted-foreground/40">·</span>
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {readingTime} min
            </span>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Button
          variant={readerMode ? "secondary" : "outline"}
          size="sm"
          className={cn(
            "h-7 gap-1.5 px-2.5 text-[11px]",
            readerMode &&
              "bg-[color-mix(in_oklch,var(--cockpit-accent)_18%,transparent)] text-[var(--cockpit-accent)] border-[color-mix(in_oklch,var(--cockpit-accent)_28%,transparent)] hover:bg-[color-mix(in_oklch,var(--cockpit-accent)_24%,transparent)]",
          )}
          onClick={onToggleReader}
          disabled={readerLoading}
          title={
            readerMode
              ? "Show the original feed content"
              : "Extract the full article in reader mode"
          }
        >
          {readerLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles
              className={cn(
                "h-3.5 w-3.5",
                readerMode ? "text-[var(--cockpit-accent)]" : "text-muted-foreground",
              )}
            />
          )}
          {readerMode ? "Reader on" : "Reader"}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 px-2 text-[11px] active:scale-95"
          onClick={onToggleStar}
          aria-pressed={isStarred}
          aria-label={isStarred ? "Unstar article" : "Star article"}
        >
          <Star
            key={isStarred ? "on" : "off"}
            className={cn(
              "h-3.5 w-3.5 transition-[transform,color,fill] duration-[var(--motion-fast)] ease-[var(--ease-spring)] animate-in zoom-in-95",
              isStarred ? "fill-star text-star" : "text-muted-foreground",
            )}
          />
          {isStarred ? "Starred" : "Star"}
          <Kbd className="ml-0.5 hidden sm:inline-flex" aria-hidden="true">
            S
          </Kbd>
        </Button>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          Open original
          <Kbd className="ml-0.5 hidden sm:inline-flex" aria-hidden="true">
            O
          </Kbd>
        </a>
      </div>
    </header>
  );
}

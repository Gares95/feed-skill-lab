"use client";

import { formatDistanceToNow } from "date-fns";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleRowProps {
  id: string;
  title: string;
  feedTitle: string;
  publishedAt: Date;
  isRead: boolean;
  isStarred: boolean;
  isSelected: boolean;
  onSelect: (articleId: string) => void;
}

export function ArticleRow({
  id,
  title,
  feedTitle,
  publishedAt,
  isRead,
  isStarred,
  isSelected,
  onSelect,
}: ArticleRowProps) {
  const timeAgo = formatDistanceToNow(new Date(publishedAt), {
    addSuffix: true,
  });

  return (
    <button
      onClick={() => onSelect(id)}
      className={cn(
        "group/row relative flex w-full gap-3 px-5 py-3.5 text-left outline-none",
        "transition-colors duration-[var(--motion-fast)] ease-[var(--ease-out-quint)]",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        isSelected
          ? "bg-accent/40"
          : "hover:bg-accent/25",
      )}
    >
      <span
        aria-hidden="true"
        className="mt-[7px] flex h-3 w-3 shrink-0 items-center justify-center"
      >
        {isStarred ? (
          <Star
            className="h-3 w-3 fill-star text-star transition-[transform,color,fill] duration-[var(--motion-fast)] ease-[var(--ease-spring)]"
          />
        ) : !isRead ? (
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        ) : null}
      </span>
      <div className="min-w-0 flex-1 space-y-1.5">
        <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          <span className="truncate">{feedTitle}</span>
          <span
            aria-hidden="true"
            className="h-px w-3 shrink-0 bg-muted-foreground/30"
          />
          <time
            dateTime={new Date(publishedAt).toISOString()}
            suppressHydrationWarning
            className="shrink-0 normal-case tracking-normal tabular-nums text-muted-foreground/80"
          >
            {timeAgo}
          </time>
        </span>
        <span
          className={cn(
            "block text-[15px] leading-[1.4] text-balance",
            "transition-[color,font-weight] duration-[var(--motion-fast)] ease-[var(--ease-out-quint)]",
            isSelected
              ? "font-medium text-foreground"
              : isRead
                ? "text-muted-foreground"
                : "text-foreground",
          )}
        >
          {title}
        </span>
      </div>
    </button>
  );
}

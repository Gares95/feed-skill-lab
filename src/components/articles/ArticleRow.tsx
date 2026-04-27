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
        "group/row relative isolate flex w-full flex-col gap-1 border-b px-4 py-3 text-left outline-none",
        "transition-[background-color,color] duration-[var(--motion-fast)] ease-[var(--ease-out-quint)]",
        "before:pointer-events-none before:absolute before:inset-y-1 before:left-0 before:w-[2px] before:rounded-r before:bg-primary before:opacity-0 before:transition-opacity before:duration-[var(--motion-fast)]",
        "hover:before:opacity-40",
        "focus-visible:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        "active:bg-accent",
        isSelected
          ? "bg-accent before:opacity-100"
          : "hover:bg-accent/50",
      )}
    >
      <span
        className={cn(
          "line-clamp-2 text-[15px] leading-[1.35] tracking-[-0.005em]",
          isRead ? "font-normal text-muted-foreground" : "font-medium text-foreground",
        )}
      >
        {isStarred ? (
          <Star className="mr-1.5 inline-block h-3 w-3 fill-star text-star align-middle" />
        ) : !isRead ? (
          <span
            aria-hidden="true"
            className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle"
          />
        ) : null}
        {title}
      </span>
      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <span className="max-w-[60%] truncate font-medium uppercase tracking-[0.04em]">
          {feedTitle}
        </span>
        <span aria-hidden="true" className="text-muted-foreground/60">
          ·
        </span>
        <time
          dateTime={new Date(publishedAt).toISOString()}
          suppressHydrationWarning
          className="font-mono tabular-nums"
        >
          {timeAgo}
        </time>
      </span>
    </button>
  );
}

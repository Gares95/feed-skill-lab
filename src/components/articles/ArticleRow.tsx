"use client";

import { formatDistanceToNow } from "date-fns";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleRowProps {
  id: string;
  title: string;
  feedTitle: string;
  publishedAt: Date;
  isRead: boolean;
  isStarred: boolean;
  isCurrent: boolean;
  isChecked: boolean;
  selectionActive: boolean;
  onSelect: (articleId: string) => void;
  onToggleCheck: (articleId: string, event: React.MouseEvent) => void;
}

export function ArticleRow({
  id,
  title,
  feedTitle,
  publishedAt,
  isRead,
  isStarred,
  isCurrent,
  isChecked,
  selectionActive,
  onSelect,
  onToggleCheck,
}: ArticleRowProps) {
  const timeAgo = formatDistanceToNow(new Date(publishedAt), {
    addSuffix: false,
  });

  return (
    <div
      data-current={isCurrent ? "true" : undefined}
      data-checked={isChecked ? "true" : undefined}
      className={cn(
        "group/row relative isolate flex w-full items-stretch border-b border-border/40 outline-none",
        "transition-[background-color,color] duration-[var(--motion-fast)] ease-[var(--ease-out-quint)]",
        "before:pointer-events-none before:absolute before:inset-y-1 before:left-0 before:w-[2px] before:rounded-r before:bg-[var(--cockpit-accent)] before:opacity-0 before:transition-opacity before:duration-[var(--motion-fast)]",
        "hover:before:opacity-40",
        isCurrent && "bg-accent before:opacity-100",
        isChecked &&
          "bg-[color-mix(in_oklch,var(--cockpit-accent)_10%,transparent)] before:opacity-100",
        !isCurrent && !isChecked && "hover:bg-accent/40",
      )}
    >
      {/* Leading gutter: checkbox (hover/checked) over read-state dot (default) */}
      <span
        className="relative flex w-7 shrink-0 items-center justify-center"
        aria-hidden={!isChecked && !selectionActive}
      >
        {/* Read-state dot — visible when no selection on this row */}
        {!isRead && !isChecked && (
          <span
            aria-hidden="true"
            className={cn(
              "h-1.5 w-1.5 rounded-full bg-[var(--cockpit-accent)] transition-opacity",
              "group-hover/row:opacity-0",
            )}
          />
        )}
        {/* Checkbox — appears on hover, persistent when checked */}
        <button
          type="button"
          role="checkbox"
          aria-checked={isChecked}
          aria-label={isChecked ? "Deselect article" : "Select article"}
          tabIndex={isChecked || selectionActive ? 0 : -1}
          onClick={(e) => {
            e.stopPropagation();
            onToggleCheck(id, e);
          }}
          className={cn(
            "absolute inline-flex h-4 w-4 items-center justify-center rounded-[3px] border outline-none",
            "transition-[opacity,background-color,border-color] duration-[var(--motion-fast)]",
            "focus-visible:ring-2 focus-visible:ring-ring/60",
            isChecked
              ? "border-[var(--cockpit-accent)] bg-[var(--cockpit-accent)] opacity-100"
              : selectionActive
                ? "border-border/70 bg-transparent opacity-100 hover:border-foreground/50"
                : "border-border/70 bg-transparent opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100",
          )}
        >
          {isChecked && (
            <Check
              className="h-3 w-3 text-[var(--primary-foreground)]"
              aria-hidden="true"
              strokeWidth={3}
            />
          )}
        </button>
      </span>

      {/* Body — clicking selects (opens) the article */}
      <button
        type="button"
        onClick={() => onSelect(id)}
        className={cn(
          "flex flex-1 flex-col gap-0.5 py-2 pr-3 text-left outline-none",
          "focus-visible:bg-accent/40 focus-visible:ring-1 focus-visible:ring-ring/60 focus-visible:ring-inset",
        )}
      >
        <span
          className={cn(
            "line-clamp-2 text-[14px] leading-[1.35] tracking-[-0.005em]",
            isRead
              ? "font-normal text-muted-foreground"
              : "font-medium text-foreground",
          )}
        >
          {title}
        </span>
        <span className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground/90">
          <span className="max-w-[55%] truncate font-medium uppercase tracking-[0.06em]">
            {feedTitle}
          </span>
          <span aria-hidden="true" className="text-muted-foreground/40">
            ·
          </span>
          <time
            dateTime={new Date(publishedAt).toISOString()}
            suppressHydrationWarning
            className="cockpit-mono text-[10.5px]"
          >
            {timeAgo}
          </time>
          {isStarred && (
            <>
              <span aria-hidden="true" className="text-muted-foreground/40">
                ·
              </span>
              <Star
                className="h-2.5 w-2.5 fill-star text-star"
                aria-label="Starred"
              />
            </>
          )}
        </span>
      </button>
    </div>
  );
}

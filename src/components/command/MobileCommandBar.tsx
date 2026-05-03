"use client";

import { BookOpen, Command, Inbox, Rss, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type MobileMode = "sidebar" | "list" | "reader";

interface MobileCommandBarProps {
  mobileView: MobileMode;
  isStarredView: boolean;
  hasReader: boolean;
  totalUnread: number;
  starredCount: number;
  onSelectFeeds: () => void;
  onSelectQueue: () => void;
  onSelectStarred: () => void;
  onSelectReader: () => void;
  onOpenPalette: () => void;
}

interface BarButtonProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  count?: number;
  disabled?: boolean;
  onClick: () => void;
}

function BarButton({
  icon: Icon,
  label,
  active,
  count,
  disabled,
  onClick,
}: BarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-current={active ? "page" : undefined}
      aria-label={label}
      className={cn(
        "relative flex h-12 w-12 flex-col items-center justify-center gap-0.5 rounded-md text-[10px] font-medium uppercase tracking-[0.14em] outline-none transition-colors",
        "text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60",
        active && "text-[var(--cockpit-accent)]",
        disabled && "opacity-40 hover:text-muted-foreground",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute -top-px left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-[var(--cockpit-accent)] opacity-0 transition-opacity",
          active && "opacity-100",
        )}
      />
      <span className="relative">
        <Icon
          className={cn("h-5 w-5", active && "stroke-[2.25]")}
          aria-hidden="true"
        />
        {typeof count === "number" && count > 0 && (
          <span
            aria-hidden="true"
            className={cn(
              "absolute -right-2 -top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full border border-[var(--cockpit-bg)] bg-card px-1 text-[9px] font-medium leading-none text-muted-foreground tabular-nums",
              active && "text-foreground",
            )}
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </span>
      <span className="cockpit-mono leading-none">{label}</span>
    </button>
  );
}

export function MobileCommandBar({
  mobileView,
  isStarredView,
  hasReader,
  totalUnread,
  starredCount,
  onSelectFeeds,
  onSelectQueue,
  onSelectStarred,
  onSelectReader,
  onOpenPalette,
}: MobileCommandBarProps) {
  const queueActive = mobileView === "list" && !isStarredView;
  const starredActive = mobileView === "list" && isStarredView;
  const feedsActive = mobileView === "sidebar";
  const readerActive = mobileView === "reader";

  return (
    <nav
      aria-label="Mobile command bar"
      className="relative flex shrink-0 items-stretch justify-between gap-1 border-t border-border/60 bg-[var(--cockpit-status-bg)] px-2 pt-1 pb-[max(env(safe-area-inset-bottom),6px)]"
    >
      <BarButton
        icon={Rss}
        label="Feeds"
        active={feedsActive}
        onClick={onSelectFeeds}
      />
      <BarButton
        icon={Inbox}
        label="Queue"
        active={queueActive}
        count={totalUnread}
        onClick={onSelectQueue}
      />

      {/* Centered, elevated ⌘K trigger */}
      <button
        type="button"
        onClick={onOpenPalette}
        aria-label="Open command palette"
        className={cn(
          "relative -mt-4 flex h-14 w-14 shrink-0 items-center justify-center self-center rounded-full outline-none transition-transform active:scale-95",
          "border border-[color-mix(in_oklch,var(--cockpit-accent)_55%,transparent)]",
          "bg-[color-mix(in_oklch,var(--cockpit-accent)_22%,var(--cockpit-bg))]",
          "shadow-[0_8px_24px_-12px_color-mix(in_oklch,var(--cockpit-accent)_60%,transparent)]",
          "focus-visible:ring-2 focus-visible:ring-ring/60",
        )}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_oklch,var(--cockpit-accent)_38%,transparent),transparent_70%)] opacity-80"
        />
        <Command
          className="relative h-6 w-6 text-[var(--cockpit-accent)]"
          strokeWidth={2.25}
          aria-hidden="true"
        />
        <span className="sr-only">Command palette</span>
      </button>

      <BarButton
        icon={Star}
        label="Starred"
        active={starredActive}
        count={starredCount}
        onClick={onSelectStarred}
      />
      <BarButton
        icon={BookOpen}
        label="Reader"
        active={readerActive}
        disabled={!hasReader}
        onClick={onSelectReader}
      />
    </nav>
  );
}

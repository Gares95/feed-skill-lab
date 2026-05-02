"use client";

import Link from "next/link";
import { Activity, BarChart3, Inbox, Settings, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddFeedDialog } from "@/components/sidebar/AddFeedDialog";

type RailMode = "inbox" | "starred";

interface NavRailProps {
  activeMode: RailMode | null;
  totalUnread: number;
  starredCount: number;
  onSelectInbox: () => void;
  onSelectStarred: () => void;
  onFeedAdded: () => void;
}

interface RailButtonProps {
  icon: LucideIcon;
  label: string;
  hint?: string;
  active?: boolean;
  count?: number;
  onClick?: () => void;
  href?: string;
  external?: boolean;
}

function RailButton({
  icon: Icon,
  label,
  hint,
  active,
  count,
  onClick,
  href,
}: RailButtonProps) {
  const inner = (
    <span
      className={cn(
        "group/rail relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-accent/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60",
        active && "bg-accent/60 text-foreground",
      )}
      aria-current={active ? "page" : undefined}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute -left-2 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-[var(--cockpit-rail-active-edge)] opacity-0 transition-opacity",
          active && "opacity-100",
        )}
      />
      <Icon className="h-4 w-4" aria-hidden="true" />
      {typeof count === "number" && count > 0 && (
        <span
          className={cn(
            "absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full border border-[var(--cockpit-rail-bg)] bg-card px-1 text-[9px] font-medium leading-none text-muted-foreground tabular-nums",
            active && "text-foreground",
          )}
          aria-hidden="true"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
      <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md border border-border/60 bg-popover px-2 py-1 text-[11px] font-medium text-popover-foreground opacity-0 shadow-sm transition-opacity duration-100 group-hover/rail:opacity-100 group-focus-visible/rail:opacity-100">
        {label}
        {hint && (
          <span className="ml-2 text-[10px] text-muted-foreground">{hint}</span>
        )}
      </span>
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={label}
        title={label}
        className="contents"
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="contents"
    >
      {inner}
    </button>
  );
}

export function NavRail({
  activeMode,
  totalUnread,
  starredCount,
  onSelectInbox,
  onSelectStarred,
  onFeedAdded,
}: NavRailProps) {
  return (
    <aside
      aria-label="Primary navigation"
      className="flex h-full shrink-0 flex-col items-center gap-2 border-r border-border/60 bg-[var(--cockpit-rail-bg)] py-3"
      style={{ width: "var(--cockpit-rail-w)" }}
    >
      <div className="flex flex-col items-center gap-1">
        <RailButton
          icon={Inbox}
          label="Inbox"
          hint="all articles"
          active={activeMode === "inbox"}
          count={totalUnread}
          onClick={onSelectInbox}
        />
        <RailButton
          icon={Star}
          label="Starred"
          active={activeMode === "starred"}
          count={starredCount}
          onClick={onSelectStarred}
        />
      </div>

      <div
        aria-hidden="true"
        className="my-1 h-px w-6 bg-border/60"
      />

      <div className="flex flex-col items-center gap-1">
        <RailButton icon={Activity} label="Health" href="/health" />
        <RailButton icon={BarChart3} label="Stats" href="/stats" />
      </div>

      <div className="flex-1" aria-hidden="true" />

      <div className="flex flex-col items-center gap-1">
        <AddFeedDialog onFeedAdded={onFeedAdded} />
        <RailButton icon={Settings} label="Settings" href="/settings" />
      </div>
    </aside>
  );
}

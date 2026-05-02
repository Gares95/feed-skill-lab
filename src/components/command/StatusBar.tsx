"use client";

import { cn } from "@/lib/utils";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

interface StatusBarProps {
  modeLabel: string;
  itemCount: number;
  unreadCount: number;
  isRefreshing?: boolean;
  className?: string;
}

export function StatusBar({
  modeLabel,
  itemCount,
  unreadCount,
  isRefreshing,
  className,
}: StatusBarProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex shrink-0 items-center gap-3 border-t border-border/60 bg-[var(--cockpit-status-bg)] px-3 text-[11px] text-[var(--cockpit-status-fg)]",
        className,
      )}
      style={{ height: "var(--cockpit-status-bar-h)" }}
    >
      <span className="cockpit-mono inline-flex items-center gap-1.5 uppercase tracking-[0.18em]">
        <span
          aria-hidden="true"
          className={cn(
            "h-1.5 w-1.5 rounded-full bg-[var(--cockpit-buffer-fg)]",
            isRefreshing && "animate-pulse",
          )}
        />
        <span className="text-foreground/85">{modeLabel}</span>
      </span>

      <span className="cockpit-mono flex-1 truncate text-muted-foreground">
        <span>{itemCount.toLocaleString()} articles</span>
        {unreadCount > 0 && (
          <>
            <span className="mx-1.5 text-muted-foreground/50">·</span>
            <span>{unreadCount.toLocaleString()} unread</span>
          </>
        )}
      </span>

      <span className="hidden items-center gap-1.5 text-muted-foreground sm:inline-flex">
        <span className="text-[10px] uppercase tracking-[0.18em]">Palette</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </span>
    </div>
  );
}

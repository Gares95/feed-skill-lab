"use client";

import { ChevronRight, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CommandLauncher } from "./CommandLauncher";

type Crumb = {
  label: string;
  className?: string;
};

interface ContextBarProps {
  crumbs: Crumb[];
  onOpenPalette: () => void;
  onRefreshAll: () => void;
  isRefreshing: boolean;
  rightSlot?: React.ReactNode;
}

export function ContextBar({
  crumbs,
  onOpenPalette,
  onRefreshAll,
  isRefreshing,
  rightSlot,
}: ContextBarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Workspace context"
      className="flex h-[var(--cockpit-context-bar-h)] shrink-0 items-center gap-3 border-b border-border/60 bg-[var(--cockpit-bg)] px-3"
      style={{ height: "var(--cockpit-context-bar-h)" }}
    >
      <nav
        aria-label="Breadcrumb"
        className="flex min-w-0 flex-1 items-center gap-1.5 text-[12px] text-muted-foreground"
      >
        {crumbs.map((c, i) => (
          <span key={`${c.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
            {i > 0 && (
              <ChevronRight
                className="h-3 w-3 shrink-0 text-muted-foreground/50"
                aria-hidden="true"
              />
            )}
            <span
              className={cn(
                "truncate",
                i === crumbs.length - 1 && "font-medium text-foreground",
                c.className,
              )}
            >
              {c.label}
            </span>
          </span>
        ))}
      </nav>

      <CommandLauncher onClick={onOpenPalette} className="hidden md:inline-flex" />

      <div className="flex shrink-0 items-center gap-1">
        {rightSlot}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={onRefreshAll}
          disabled={isRefreshing}
          aria-label="Refresh all feeds"
          title="Refresh all feeds"
        >
          <RefreshCw
            className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")}
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  );
}

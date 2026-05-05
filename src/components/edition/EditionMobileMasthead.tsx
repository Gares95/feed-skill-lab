"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Command, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DateRange } from "@/lib/date-range";
import type { DateRangeSelection } from "@/components/layout/AppShell";
import { EditionDateControl } from "./EditionDateControl";

interface EditionMobileMastheadProps {
  isRefreshing: boolean;
  onRefreshAll: () => void;
  onOpenPalette: () => void;
  dateRange: DateRange;
  onDateRangeChange: (next: DateRangeSelection) => void;
}

interface EditionStamp {
  weekday: string;
  date: string;
  edition: string;
}

const EDITION_LOCALE = "en-US";

function computeStamp(d: Date): EditionStamp {
  const weekday = d.toLocaleDateString(EDITION_LOCALE, { weekday: "short" });
  const date = d.toLocaleDateString(EDITION_LOCALE, {
    month: "short",
    day: "numeric",
  });
  const start = new Date(d.getFullYear(), 0, 0);
  const day = Math.floor((d.getTime() - start.getTime()) / 86_400_000);
  const edition = `№${String(day).padStart(3, "0")}`;
  return { weekday, date, edition };
}

export function EditionMobileMasthead({
  isRefreshing,
  onRefreshAll,
  onOpenPalette,
  dateRange,
  onDateRangeChange,
}: EditionMobileMastheadProps) {
  const [stamp, setStamp] = useState<EditionStamp | null>(null);

  useEffect(() => {
    const update = () => setStamp(computeStamp(new Date()));
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header
      role="banner"
      aria-label="Today edition masthead"
      className={cn(
        "edition-masthead-mobile md:hidden sticky top-0 z-20 shrink-0",
        "border-b border-[color:var(--edition-rule-strong)]",
        "bg-[color:var(--edition-paper)]/92 backdrop-blur",
        "text-[color:var(--edition-ink)]",
        "px-4 pt-[calc(env(safe-area-inset-top)+0.5rem)] pb-2",
      )}
    >
      <div className="flex items-end justify-between gap-3">
        <div className="flex min-w-0 items-end gap-3">
          <Link
            href="/"
            aria-label="The Edition — home"
            className={cn(
              "edition-display select-none leading-none tracking-[-0.025em]",
              "text-[1.6rem] font-semibold",
              "text-[color:var(--edition-ink)]",
            )}
          >
            The Edition
          </Link>
          <span
            className="edition-stamp truncate pb-1 text-[0.66rem] text-[color:var(--edition-ink-faint)]"
            suppressHydrationWarning
          >
            {stamp ? `${stamp.edition} · ${stamp.weekday}, ${stamp.date}` : " "}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Open command palette"
            title="Search and run commands"
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-full",
              "border border-[color:var(--edition-rule-strong)]",
              "text-[color:var(--edition-ink-muted)]",
              "transition-colors outline-none",
              "focus-visible:ring-2 focus-visible:ring-[color:var(--edition-accent)]/60",
            )}
          >
            <Command className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefreshAll}
            disabled={isRefreshing}
            aria-label="Refresh all feeds"
            title="Refresh all feeds"
            className="h-8 w-8 text-[color:var(--edition-ink-muted)] hover:text-[color:var(--edition-ink)]"
          >
            <RefreshCw
              className={cn("h-4 w-4", isRefreshing && "animate-spin")}
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
      <div className="mt-1.5 flex items-center justify-end">
        <EditionDateControl
          range={dateRange}
          onChange={onDateRangeChange}
          variant="mobile"
        />
      </div>
    </header>
  );
}

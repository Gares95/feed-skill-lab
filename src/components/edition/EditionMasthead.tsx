"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  CheckCheck,
  Command,
  RefreshCw,
  Settings as SettingsIcon,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DateRange } from "@/lib/date-range";
import type { DateRangeSelection } from "@/components/layout/AppShell";
import { EditionDateControl } from "./EditionDateControl";

interface EditionMastheadProps {
  totalUnread: number;
  starredCount: number;
  feedCount: number;
  isRefreshing: boolean;
  isStarredView: boolean;
  onRefreshAll: () => void;
  onMarkAllRead: () => void;
  onOpenPalette: () => void;
  onSelectStarred: () => void;
  dateRange: DateRange;
  onDateRangeChange: (next: DateRangeSelection) => void;
  showDateControl: boolean;
}

interface EditionStamp {
  weekday: string;
  date: string;
  edition: string;
  iso: string;
}

// Pin to en-US so the masthead reads as an English-language edition stamp
// regardless of the user's OS / browser locale. Keeps the issue deterministic.
const EDITION_LOCALE = "en-US";

function computeStamp(d: Date): EditionStamp {
  const weekday = d.toLocaleDateString(EDITION_LOCALE, { weekday: "long" });
  const date = d.toLocaleDateString(EDITION_LOCALE, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const start = new Date(d.getFullYear(), 0, 0);
  const day = Math.floor((d.getTime() - start.getTime()) / 86_400_000);
  const edition = `№${String(day).padStart(3, "0")}`;
  const iso = d.toISOString().slice(0, 10);
  return { weekday, date, edition, iso };
}

export function EditionMasthead({
  totalUnread,
  starredCount,
  feedCount,
  isRefreshing,
  isStarredView,
  onRefreshAll,
  onMarkAllRead,
  onOpenPalette,
  onSelectStarred,
  dateRange,
  onDateRangeChange,
  showDateControl,
}: EditionMastheadProps) {
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
        "edition-masthead",
        "hidden md:flex shrink-0 flex-col",
        "border-b border-[color:var(--edition-rule-strong)]",
        "bg-[color:var(--edition-paper)] text-[color:var(--edition-ink)]",
        "px-6 lg:px-10 pt-4 pb-3",
      )}
    >
      <div className="flex items-end justify-between gap-6">
        {/* Nameplate + edition stamp */}
        <div className="flex min-w-0 items-end gap-5">
          <Link
            href="/"
            aria-label="The Edition — home"
            className="edition-display select-none leading-none tracking-[-0.025em] text-[2rem] lg:text-[2.4rem] font-semibold text-[color:var(--edition-ink)] hover:text-[color:var(--edition-accent)] transition-colors"
          >
            The Edition
          </Link>
          <div className="flex min-w-0 flex-col gap-0.5 pb-1.5">
            <span className="edition-eyebrow text-[0.68rem]">
              {stamp ? stamp.weekday : " "}
            </span>
            <span
              className="edition-stamp truncate"
              suppressHydrationWarning
              title={stamp ? `${stamp.weekday}, ${stamp.date}` : undefined}
            >
              {stamp ? `${stamp.edition} · ${stamp.date}` : " "}
            </span>
          </div>
        </div>

        {/* Right cluster: palette pill + actions */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Open command palette (Cmd or Ctrl + K)"
            title="Search and run commands"
            className={cn(
              "group inline-flex h-8 items-center gap-2 rounded-full",
              "border border-[color:var(--edition-rule-strong)]",
              "bg-transparent px-3 text-xs",
              "text-[color:var(--edition-ink-muted)] hover:text-[color:var(--edition-ink)]",
              "hover:border-[color:var(--edition-accent)]/60",
              "transition-colors outline-none",
              "focus-visible:ring-2 focus-visible:ring-[color:var(--edition-accent)]/60",
            )}
          >
            <Command className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden lg:inline">Search and run commands</span>
            <span className="lg:hidden">Search</span>
            <kbd className="edition-stamp ml-1 rounded border border-[color:var(--edition-rule)] px-1 py-0.5 text-[0.65rem]">
              ⌘K
            </kbd>
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

          <Button
            variant="ghost"
            size="icon"
            onClick={onMarkAllRead}
            aria-label="Mark all as read"
            title="Mark all as read"
            className="h-8 w-8 text-[color:var(--edition-ink-muted)] hover:text-[color:var(--edition-ink)]"
          >
            <CheckCheck className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Lower row: counters + nav links */}
      <div className="mt-3 flex items-center justify-between gap-4 border-t border-[color:var(--edition-rule)] pt-2.5">
        <div className="flex min-w-0 items-center gap-4">
        <dl className="flex items-baseline gap-5 text-xs">
          <div className="flex items-baseline gap-1.5">
            <dt className="edition-eyebrow text-[0.62rem]">Unread</dt>
            <dd className="edition-stamp text-[color:var(--edition-ink)]">
              {totalUnread}
            </dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="edition-eyebrow text-[0.62rem]">Starred</dt>
            <dd className="edition-stamp text-[color:var(--edition-ink)]">
              {starredCount}
            </dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="edition-eyebrow text-[0.62rem]">Sources</dt>
            <dd className="edition-stamp text-[color:var(--edition-ink)]">
              {feedCount}
            </dd>
          </div>
        </dl>
          {showDateControl && (
            <EditionDateControl
              range={dateRange}
              onChange={onDateRangeChange}
            />
          )}
        </div>

        <nav
          aria-label="Edition navigation"
          className="flex items-center gap-0.5"
        >
          <button
            type="button"
            onClick={onSelectStarred}
            aria-pressed={isStarredView}
            aria-label="Show starred articles"
            title="Starred"
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs",
              "transition-colors outline-none",
              "focus-visible:ring-2 focus-visible:ring-[color:var(--edition-accent)]/60",
              isStarredView
                ? "text-[color:var(--edition-accent)]"
                : "text-[color:var(--edition-ink-muted)] hover:text-[color:var(--edition-ink)]",
            )}
          >
            <Star
              className={cn(
                "h-3.5 w-3.5",
                isStarredView && "fill-[color:var(--edition-accent)]",
              )}
              aria-hidden="true"
            />
            <span className="hidden lg:inline">Starred</span>
          </button>
          <MastheadNavLink
            href="/health"
            icon={<Activity className="h-3.5 w-3.5" aria-hidden="true" />}
            label="Health"
          />
          <MastheadNavLink
            href="/stats"
            icon={<BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />}
            label="Stats"
          />
          <MastheadNavLink
            href="/settings"
            icon={<SettingsIcon className="h-3.5 w-3.5" aria-hidden="true" />}
            label="Settings"
          />
        </nav>
      </div>
    </header>
  );
}

function MastheadNavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs",
        "text-[color:var(--edition-ink-muted)] hover:text-[color:var(--edition-ink)]",
        "transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-[color:var(--edition-accent)]/60",
      )}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </Link>
  );
}

"use client";

import Link from "next/link";
import { Newspaper, Search, Star, ListTree, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type EditionMobileTab = "today" | "feeds" | "starred" | "search";

interface EditionMobileTabBarProps {
  active: EditionMobileTab;
  isStarredView: boolean;
  onSelectToday: () => void;
  onSelectFeeds: () => void;
  onSelectStarred: () => void;
  onOpenPalette: () => void;
}

export function EditionMobileTabBar({
  active,
  isStarredView,
  onSelectToday,
  onSelectFeeds,
  onSelectStarred,
  onOpenPalette,
}: EditionMobileTabBarProps) {
  return (
    <nav
      aria-label="Edition tab bar"
      className={cn(
        "edition-tabbar md:hidden fixed inset-x-0 bottom-0 z-30",
        "border-t border-[color:var(--edition-rule-strong)]",
        "bg-[color:var(--edition-paper)]/95 backdrop-blur",
        "pb-[calc(env(safe-area-inset-bottom)+0.25rem)] pt-1",
      )}
    >
      <ul className="grid grid-cols-5 gap-0">
        <TabButton
          label="Today"
          icon={<Newspaper className="h-4 w-4" aria-hidden="true" />}
          isActive={active === "today" && !isStarredView}
          onClick={onSelectToday}
        />
        <TabButton
          label="Search"
          icon={<Search className="h-4 w-4" aria-hidden="true" />}
          isActive={active === "search"}
          onClick={onOpenPalette}
        />
        <TabButton
          label="Starred"
          icon={<Star className="h-4 w-4" aria-hidden="true" />}
          isActive={isStarredView}
          onClick={onSelectStarred}
        />
        <TabButton
          label="Feeds"
          icon={<ListTree className="h-4 w-4" aria-hidden="true" />}
          isActive={active === "feeds"}
          onClick={onSelectFeeds}
        />
        <TabLink
          href="/settings"
          label="More"
          icon={<SettingsIcon className="h-4 w-4" aria-hidden="true" />}
        />
      </ul>
    </nav>
  );
}

function TabButton({
  label,
  icon,
  isActive,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-0.5 py-1.5",
          "edition-eyebrow text-[0.6rem] tracking-[0.1em]",
          "transition-colors outline-none",
          "focus-visible:ring-2 focus-visible:ring-[color:var(--edition-accent)]/60 rounded-md",
          isActive
            ? "text-[color:var(--edition-accent)]"
            : "text-[color:var(--edition-ink-muted)] hover:text-[color:var(--edition-ink)]",
        )}
      >
        {icon}
        <span>{label}</span>
      </button>
    </li>
  );
}

function TabLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        aria-label={label}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-0.5 py-1.5",
          "edition-eyebrow text-[0.6rem] tracking-[0.1em]",
          "transition-colors outline-none",
          "focus-visible:ring-2 focus-visible:ring-[color:var(--edition-accent)]/60 rounded-md",
          "text-[color:var(--edition-ink-muted)] hover:text-[color:var(--edition-ink)]",
        )}
      >
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  );
}

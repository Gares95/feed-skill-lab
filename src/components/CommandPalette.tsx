"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Newspaper, Rss, Star, RefreshCw, CheckCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { FeedWithCount } from "@/components/sidebar/Sidebar";

interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feeds: FeedWithCount[];
  onSelectAll: () => void;
  onSelectStarred: () => void;
  onSelectFeed: (feedId: string) => void;
  onRefreshAll: () => void;
  onMarkAllRead: () => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  feeds,
  onSelectAll,
  onSelectStarred,
  onSelectFeed,
  onRefreshAll,
  onMarkAllRead,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const items: CommandItem[] = useMemo(() => {
    const close = () => onOpenChange(false);
    const result: CommandItem[] = [
      {
        id: "nav:all",
        label: "All Articles",
        icon: <Newspaper className="h-4 w-4" />,
        action: () => {
          onSelectAll();
          close();
        },
      },
      {
        id: "nav:starred",
        label: "Starred",
        icon: <Star className="h-4 w-4 text-star" />,
        action: () => {
          onSelectStarred();
          close();
        },
      },
      {
        id: "action:refresh-all",
        label: "Refresh all feeds",
        hint: "Shift+R",
        icon: <RefreshCw className="h-4 w-4" />,
        action: () => {
          onRefreshAll();
          close();
        },
      },
      {
        id: "action:mark-all-read",
        label: "Mark all as read",
        icon: <CheckCheck className="h-4 w-4" />,
        action: () => {
          onMarkAllRead();
          close();
        },
      },
      ...feeds.map<CommandItem>((feed) => ({
        id: `feed:${feed.id}`,
        label: feed.title,
        hint: feed.unreadCount > 0 ? `${feed.unreadCount}` : undefined,
        icon: <Rss className="h-4 w-4 text-muted-foreground" />,
        action: () => {
          onSelectFeed(feed.id);
          close();
        },
      })),
    ];
    return result;
  }, [feeds, onSelectAll, onSelectStarred, onSelectFeed, onRefreshAll, onMarkAllRead, onOpenChange]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[activeIndex]?.action();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-lg">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <DialogDescription className="sr-only">
          Search feeds and run actions
        </DialogDescription>
        <div className="border-b px-3 py-2">
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or feed name..."
            className="h-8 border-none bg-transparent px-1 text-sm shadow-none focus-visible:ring-0"
          />
        </div>
        <div ref={listRef} className="max-h-80 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">
              No results
            </p>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                onMouseEnter={() => setActiveIndex(idx)}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm",
                  idx === activeIndex
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground",
                )}
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.hint && (
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {item.hint}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

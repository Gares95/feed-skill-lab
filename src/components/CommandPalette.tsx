"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCheck,
  CornerDownLeft,
  ExternalLink,
  Folder,
  Hash,
  HelpCircle,
  Inbox,
  Newspaper,
  RefreshCw,
  Rss,
  Search,
  Settings,
  Star,
  StarOff,
  Terminal,
  ChevronRight,
  CircleDot,
  Activity,
  BarChart3,
  AtSign,
  Slash,
  ChevronsRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import type { FeedWithCount, FolderRef } from "@/components/sidebar/Sidebar";
import type { ArticleWithFeed } from "@/components/articles/ArticleList";

type Scope = "all" | "command" | "folder" | "feed" | "article";

interface CommandItem {
  id: string;
  label: string;
  sublabel?: string;
  hint?: React.ReactNode;
  icon: React.ReactNode;
  group: string;
  groupOrder: number;
  scope: Scope;
  keywords?: string;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feeds: FeedWithCount[];
  folders: FolderRef[];
  articles: ArticleWithFeed[];
  selectedArticleId: string | null;
  currentArticleLink: string | null;
  currentArticleStarred: boolean;
  currentArticleRead: boolean;
  onSelectAll: () => void;
  onSelectStarred: () => void;
  onSelectFeed: (feedId: string) => void;
  onSelectArticle: (articleId: string) => void;
  onRefreshAll: () => void;
  onMarkAllRead: () => void;
  onToggleStar: (articleId: string) => void;
  onToggleRead: (articleId: string) => void;
  onOpenOriginal: () => void;
}

const RECENT_KEY = "cmd-palette:recent-v1";
const RECENT_MAX = 5;

function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function pushRecent(id: string) {
  if (typeof window === "undefined") return;
  try {
    const cur = loadRecent().filter((x) => x !== id);
    cur.unshift(id);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(cur.slice(0, RECENT_MAX)));
  } catch {
    // ignore
  }
}

function detectScope(query: string): { scope: Scope; rest: string } {
  if (query.startsWith(">")) return { scope: "command", rest: query.slice(1).trimStart() };
  if (query.startsWith("#")) return { scope: "folder", rest: query.slice(1).trimStart() };
  if (query.startsWith("@")) return { scope: "feed", rest: query.slice(1).trimStart() };
  if (query.startsWith("/")) return { scope: "article", rest: query.slice(1).trimStart() };
  return { scope: "all", rest: query.trim() };
}

const SCOPE_META: Record<
  Exclude<Scope, "all">,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  command: { label: "Commands", icon: Terminal },
  folder: { label: "Folders", icon: Hash },
  feed: { label: "Feeds", icon: AtSign },
  article: { label: "Articles", icon: Slash },
};

export function CommandPalette({
  open,
  onOpenChange,
  feeds,
  folders,
  articles,
  selectedArticleId,
  currentArticleLink,
  currentArticleStarred,
  currentArticleRead,
  onSelectAll,
  onSelectStarred,
  onSelectFeed,
  onSelectArticle,
  onRefreshAll,
  onMarkAllRead,
  onToggleStar,
  onToggleRead,
  onOpenOriginal,
}: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  const items: CommandItem[] = useMemo(() => {
    const result: CommandItem[] = [];
    const wrap = (id: string, fn: () => void) => () => {
      pushRecent(id);
      fn();
      close();
    };

    // Contextual (only if an article is selected)
    if (selectedArticleId) {
      result.push({
        id: "ctx:toggle-star",
        label: currentArticleStarred ? "Unstar article" : "Star article",
        icon: currentArticleStarred ? (
          <StarOff className="h-4 w-4" />
        ) : (
          <Star className="h-4 w-4 text-star" />
        ),
        hint: <Kbd>S</Kbd>,
        group: "Current article",
        groupOrder: 0,
        scope: "command",
        keywords: "star unstar favorite",
        action: wrap("ctx:toggle-star", () => onToggleStar(selectedArticleId)),
      });
      result.push({
        id: "ctx:toggle-read",
        label: currentArticleRead ? "Mark as unread" : "Mark as read",
        icon: <CircleDot className="h-4 w-4" />,
        hint: <Kbd>M</Kbd>,
        group: "Current article",
        groupOrder: 0,
        scope: "command",
        keywords: "read unread mark toggle",
        action: wrap("ctx:toggle-read", () => onToggleRead(selectedArticleId)),
      });
      if (currentArticleLink) {
        result.push({
          id: "ctx:open-original",
          label: "Open original article",
          sublabel: currentArticleLink,
          icon: <ExternalLink className="h-4 w-4" />,
          hint: <Kbd>O</Kbd>,
          group: "Current article",
          groupOrder: 0,
          scope: "command",
          keywords: "open external link source",
          action: wrap("ctx:open-original", onOpenOriginal),
        });
      }
    }

    // Modes
    result.push({
      id: "mode:inbox",
      label: "Go to Inbox",
      sublabel: "All articles",
      icon: <Inbox className="h-4 w-4" />,
      hint: <KbdGroup><Kbd>G</Kbd><Kbd>I</Kbd></KbdGroup>,
      group: "Navigate",
      groupOrder: 1,
      scope: "command",
      keywords: "inbox all home",
      action: wrap("mode:inbox", onSelectAll),
    });
    result.push({
      id: "mode:starred",
      label: "Go to Starred",
      icon: <Star className="h-4 w-4 text-star" />,
      hint: <KbdGroup><Kbd>G</Kbd><Kbd>S</Kbd></KbdGroup>,
      group: "Navigate",
      groupOrder: 1,
      scope: "command",
      keywords: "star favorites bookmarks",
      action: wrap("mode:starred", onSelectStarred),
    });
    result.push({
      id: "mode:health",
      label: "Go to Feed Health",
      icon: <Activity className="h-4 w-4" />,
      hint: <KbdGroup><Kbd>G</Kbd><Kbd>H</Kbd></KbdGroup>,
      group: "Navigate",
      groupOrder: 1,
      scope: "command",
      keywords: "health errors broken",
      action: wrap("mode:health", () => router.push("/health")),
    });
    result.push({
      id: "mode:stats",
      label: "Go to Stats",
      icon: <BarChart3 className="h-4 w-4" />,
      hint: <KbdGroup><Kbd>G</Kbd><Kbd>T</Kbd></KbdGroup>,
      group: "Navigate",
      groupOrder: 1,
      scope: "command",
      keywords: "stats statistics analytics",
      action: wrap("mode:stats", () => router.push("/stats")),
    });
    result.push({
      id: "mode:settings",
      label: "Go to Settings",
      icon: <Settings className="h-4 w-4" />,
      group: "Navigate",
      groupOrder: 1,
      scope: "command",
      keywords: "settings preferences config",
      action: wrap("mode:settings", () => router.push("/settings")),
    });

    // Actions
    result.push({
      id: "action:refresh-all",
      label: "Refresh all feeds",
      icon: <RefreshCw className="h-4 w-4" />,
      hint: <KbdGroup><Kbd>⇧</Kbd><Kbd>R</Kbd></KbdGroup>,
      group: "Actions",
      groupOrder: 2,
      scope: "command",
      keywords: "refresh sync update fetch",
      action: wrap("action:refresh-all", onRefreshAll),
    });
    result.push({
      id: "action:mark-all-read",
      label: "Mark all as read",
      icon: <CheckCheck className="h-4 w-4" />,
      group: "Actions",
      groupOrder: 2,
      scope: "command",
      keywords: "mark read clear inbox",
      action: wrap("action:mark-all-read", onMarkAllRead),
    });

    // Help
    result.push({
      id: "help:shortcuts",
      label: "Keyboard shortcuts",
      sublabel: "View all available shortcuts",
      icon: <HelpCircle className="h-4 w-4" />,
      hint: <Kbd>?</Kbd>,
      group: "Help",
      groupOrder: 5,
      scope: "command",
      keywords: "shortcuts help keys cheatsheet",
      action: wrap("help:shortcuts", () => router.push("/settings")),
    });

    // Folders
    folders.forEach((folder) => {
      const folderFeeds = feeds.filter((f) => f.folderId === folder.id);
      const unread = folderFeeds.reduce((sum, f) => sum + f.unreadCount, 0);
      result.push({
        id: `folder:${folder.id}`,
        label: folder.name,
        sublabel: `${folderFeeds.length} feed${folderFeeds.length === 1 ? "" : "s"}`,
        icon: <Folder className="h-4 w-4 text-muted-foreground" />,
        hint: unread > 0 ? (
          <span className="cockpit-mono text-[11px] text-muted-foreground">{unread}</span>
        ) : undefined,
        group: "Folders",
        groupOrder: 3,
        scope: "folder",
        keywords: folder.name.toLowerCase(),
        action: wrap(`folder:${folder.id}`, () => {
          // Select first feed in folder if any, otherwise no-op
          const first = folderFeeds[0];
          if (first) onSelectFeed(first.id);
        }),
      });
    });

    // Feeds
    feeds.forEach((feed) => {
      const folder = folders.find((f) => f.id === feed.folderId);
      result.push({
        id: `feed:${feed.id}`,
        label: feed.title,
        sublabel: folder?.name,
        icon: feed.favicon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={feed.favicon}
            alt=""
            className="h-4 w-4 rounded-sm object-contain"
          />
        ) : (
          <Rss className="h-4 w-4 text-muted-foreground" />
        ),
        hint: feed.unreadCount > 0 ? (
          <span className="cockpit-mono text-[11px] text-muted-foreground">{feed.unreadCount}</span>
        ) : undefined,
        group: "Feeds",
        groupOrder: 4,
        scope: "feed",
        keywords: `${feed.title} ${folder?.name ?? ""}`.toLowerCase(),
        action: wrap(`feed:${feed.id}`, () => onSelectFeed(feed.id)),
      });
    });

    // Articles (limit to keep palette responsive)
    articles.slice(0, 60).forEach((article) => {
      result.push({
        id: `article:${article.id}`,
        label: article.title,
        sublabel: article.feedTitle,
        icon: <Newspaper className={cn("h-4 w-4", article.isRead ? "text-muted-foreground/60" : "text-muted-foreground")} />,
        hint: article.isStarred ? <Star className="h-3 w-3 text-star" fill="currentColor" /> : undefined,
        group: "Articles",
        groupOrder: 6,
        scope: "article",
        keywords: `${article.title} ${article.feedTitle}`.toLowerCase(),
        action: wrap(`article:${article.id}`, () => onSelectArticle(article.id)),
      });
    });

    return result;
  }, [
    feeds,
    folders,
    articles,
    selectedArticleId,
    currentArticleStarred,
    currentArticleRead,
    currentArticleLink,
    onSelectAll,
    onSelectStarred,
    onSelectFeed,
    onSelectArticle,
    onRefreshAll,
    onMarkAllRead,
    onToggleStar,
    onToggleRead,
    onOpenOriginal,
    router,
    close,
  ]);

  const { scope, rest } = useMemo(() => detectScope(query), [query]);

  const filtered = useMemo(() => {
    const q = rest.toLowerCase();
    let candidates = items;
    if (scope !== "all") {
      candidates = items.filter((it) => it.scope === scope);
    }
    if (!q) return candidates;
    return candidates.filter((item) => {
      const label = item.label.toLowerCase();
      const keywords = item.keywords ?? "";
      return label.includes(q) || keywords.includes(q);
    });
  }, [items, scope, rest]);

  // Group by group, preserving order. Show "Recent" first when query is empty
  // and scope is "all".
  const sections = useMemo(() => {
    type Section = { label: string; order: number; items: CommandItem[] };
    const map = new Map<string, Section>();

    const showRecent = scope === "all" && rest.length === 0 && recent.length > 0;
    if (showRecent) {
      const recentItems = recent
        .map((id) => filtered.find((it) => it.id === id))
        .filter((it): it is CommandItem => Boolean(it));
      if (recentItems.length > 0) {
        map.set("__recent__", { label: "Recent", order: -1, items: recentItems });
      }
    }

    const seenIds = new Set<string>(
      map.get("__recent__")?.items.map((it) => it.id) ?? [],
    );

    filtered.forEach((it) => {
      if (seenIds.has(it.id)) return;
      const existing = map.get(it.group);
      if (existing) {
        existing.items.push(it);
      } else {
        map.set(it.group, { label: it.group, order: it.groupOrder, items: [it] });
      }
    });

    return Array.from(map.values()).sort((a, b) => a.order - b.order);
  }, [filtered, recent, scope, rest]);

  // Flatten for keyboard navigation
  const flat = useMemo(() => sections.flatMap((s) => s.items), [sections]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setRecent(loadRecent());
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Scroll active into view
  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.querySelector<HTMLElement>(
      `[data-active="true"]`,
    );
    if (active) {
      active.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, sections]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      flat[activeIndex]?.action();
    } else if (e.key === "Tab") {
      // Cycle through scopes via Tab
      e.preventDefault();
      const order: Scope[] = ["all", "command", "folder", "feed", "article"];
      const cur = order.indexOf(scope);
      const next = order[(cur + 1) % order.length];
      setQuery(next === "all" ? "" : next === "command" ? ">" : next === "folder" ? "#" : next === "feed" ? "@" : "/");
    }
  }

  const ScopeIcon = scope !== "all" ? SCOPE_META[scope].icon : Search;
  const scopeLabel = scope !== "all" ? SCOPE_META[scope].label : null;

  let runningIndex = -1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="overflow-hidden p-0 sm:max-w-xl gap-0"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <DialogDescription className="sr-only">
          Search feeds, folders, articles, and run commands. Use {">"} for commands,{" "}
          {"#"} for folders, @ for feeds, / for articles.
        </DialogDescription>

        {/* Input row */}
        <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2.5">
          <ScopeIcon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          {scopeLabel && (
            <span
              className={cn(
                "shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                "bg-[color-mix(in_oklch,var(--cockpit-accent)_18%,transparent)] text-[var(--cockpit-accent)]",
              )}
            >
              {scopeLabel}
            </span>
          )}
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              scope === "command"
                ? "Run a command…"
                : scope === "folder"
                  ? "Find a folder…"
                  : scope === "feed"
                    ? "Find a feed…"
                    : scope === "article"
                      ? "Find an article…"
                      : "Search or type > # @ / to scope…"
            }
            className="h-7 flex-1 border-none bg-transparent px-0 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-list"
            aria-activedescendant={
              flat[activeIndex] ? `cmd-${flat[activeIndex].id}` : undefined
            }
            aria-autocomplete="list"
          />
          <KbdGroup className="hidden sm:inline-flex">
            <Kbd>esc</Kbd>
          </KbdGroup>
        </div>

        {/* Scope hints (when no query) */}
        {scope === "all" && rest.length === 0 && (
          <div className="flex items-center gap-1 border-b border-border/40 px-3 py-1.5 text-[11px] text-muted-foreground/80">
            <span className="mr-1">Scope:</span>
            {(["command", "folder", "feed", "article"] as const).map((s) => {
              const Icon = SCOPE_META[s].icon;
              const prefix = s === "command" ? ">" : s === "folder" ? "#" : s === "feed" ? "@" : "/";
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setQuery(prefix);
                    inputRef.current?.focus();
                  }}
                  className="inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-muted-foreground/80 hover:bg-accent hover:text-foreground"
                >
                  <Kbd className="h-4 min-w-4 px-1 text-[10px]">{prefix}</Kbd>
                  <Icon className="h-3 w-3" />
                  <span className="capitalize">{s}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Results */}
        <div
          ref={listRef}
          id="command-palette-list"
          role="listbox"
          className="max-h-[60vh] overflow-y-auto py-1"
        >
          {flat.length === 0 ? (
            <div className="flex flex-col items-center gap-1 px-3 py-10 text-center">
              <Search className="h-5 w-5 text-muted-foreground/60" />
              <p className="text-sm text-foreground">No results</p>
              <p className="text-xs text-muted-foreground">
                Try a different query or scope.
              </p>
            </div>
          ) : (
            sections.map((section) => (
              <div key={section.label} className="pb-1">
                <div className="sticky top-0 z-10 bg-popover/95 px-3 pt-1.5 pb-1 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/80 backdrop-blur">
                  {section.label}
                </div>
                {section.items.map((item) => {
                  runningIndex += 1;
                  const idx = runningIndex;
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      id={`cmd-${item.id}`}
                      role="option"
                      aria-selected={isActive}
                      data-active={isActive ? "true" : undefined}
                      type="button"
                      onClick={item.action}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={cn(
                        "flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm outline-none",
                        "border-l-2 border-transparent",
                        isActive
                          ? "bg-accent/60 border-l-[var(--cockpit-rail-active-edge)] text-foreground"
                          : "text-foreground/90 hover:bg-accent/30",
                      )}
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                        {item.icon}
                      </span>
                      <span className="flex min-w-0 flex-1 items-center gap-2">
                        <span className="truncate">{item.label}</span>
                        {item.sublabel && (
                          <>
                            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/50" aria-hidden="true" />
                            <span className="truncate text-xs text-muted-foreground">
                              {item.sublabel}
                            </span>
                          </>
                        )}
                      </span>
                      {item.hint && (
                        <span className="shrink-0 text-muted-foreground">
                          {item.hint}
                        </span>
                      )}
                      {isActive && (
                        <ChevronsRight className="h-3.5 w-3.5 shrink-0 text-[var(--cockpit-accent)]" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center justify-between border-t border-border/60 bg-background/40 px-3 py-1.5 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <KbdGroup>
                <Kbd className="px-1"><ArrowUp className="h-2.5 w-2.5" /></Kbd>
                <Kbd className="px-1"><ArrowDown className="h-2.5 w-2.5" /></Kbd>
              </KbdGroup>
              navigate
            </span>
            <span className="inline-flex items-center gap-1">
              <Kbd className="px-1"><CornerDownLeft className="h-2.5 w-2.5" /></Kbd>
              select
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <Kbd>tab</Kbd>
              cycle scope
            </span>
          </div>
          <span className="cockpit-mono text-[10px] tabular-nums">
            {flat.length} {flat.length === 1 ? "result" : "results"}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

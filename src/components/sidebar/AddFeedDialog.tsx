"use client";

import { useState } from "react";
import { Loader2, Plus, Rss, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

interface AddFeedDialogProps {
  onFeedAdded: () => void;
}

const SUGGESTED_FEEDS: { title: string; description: string; url: string }[] = [
  {
    title: "Hacker News",
    description: "Tech, startups, programming",
    url: "https://news.ycombinator.com/rss",
  },
  {
    title: "BBC News",
    description: "World news from the BBC",
    url: "https://feeds.bbci.co.uk/news/rss.xml",
  },
  {
    title: "The Guardian",
    description: "International news and analysis",
    url: "https://www.theguardian.com/international/rss",
  },
  {
    title: "Ars Technica",
    description: "Tech, science, policy, culture",
    url: "https://feeds.arstechnica.com/arstechnica/index",
  },
  {
    title: "The Verge",
    description: "Technology, science, entertainment",
    url: "https://www.theverge.com/rss/index.xml",
  },
  {
    title: "XKCD",
    description: "Webcomic of romance, sarcasm, math, and language",
    url: "https://xkcd.com/rss.xml",
  },
];

export function AddFeedDialog({ onFeedAdded }: AddFeedDialogProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to add feed");
        return;
      }

      setUrl("");
      setOpen(false);
      onFeedAdded();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setUrl("");
          setError(null);
          setLoading(false);
        }
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            aria-label="Add feed"
            title="Add feed"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md gap-3">
        <DialogHeader>
          <span className="cockpit-mono inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-[var(--cockpit-accent)]/85">
            <Rss className="h-3 w-3" aria-hidden="true" />
            New feed
          </span>
          <DialogTitle className="text-[15px] tracking-[-0.01em]">
            Add a feed
          </DialogTitle>
          <DialogDescription className="text-[12px]">
            Paste an RSS / Atom URL, or a site&apos;s homepage — Feed will try
            to auto-discover the feed link.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          <div className="relative">
            <Input
              placeholder="https://site.url/feed.xml"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              autoFocus
              className="font-mono text-[12.5px] pr-14"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 sm:inline-flex"
            >
              <Kbd>↵</Kbd>
            </span>
          </div>
          {error && (
            <p
              className="cockpit-mono inline-flex items-center gap-1.5 rounded-sm border border-destructive/40 bg-[color-mix(in_oklch,var(--destructive)_10%,transparent)] px-2 py-1 text-[11px] text-destructive"
              role="alert"
            >
              {error}
            </p>
          )}
          <div className="flex items-center justify-end gap-2">
            <Button
              type="submit"
              size="sm"
              disabled={loading || !url.trim()}
              className="h-8"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  Adding…
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  Add feed
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-1 border-t border-border/60 pt-3">
          <p className="cockpit-mono inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Discover
          </p>
          <ul className="mt-2 grid gap-0.5">
            {SUGGESTED_FEEDS.map((suggestion) => (
              <li key={suggestion.url}>
                <button
                  type="button"
                  onClick={() => setUrl(suggestion.url)}
                  disabled={loading}
                  className="group flex w-full items-center justify-between gap-3 rounded-sm border border-transparent px-2 py-1.5 text-left transition-colors hover:border-border/60 hover:bg-accent/50 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium">
                      {suggestion.title}
                    </span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {suggestion.description}
                    </span>
                  </span>
                  <span className="cockpit-mono shrink-0 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/0 transition-colors group-hover:text-[var(--cockpit-accent)]/90">
                    Use →
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <details className="text-[11px] text-muted-foreground">
          <summary className="cursor-pointer select-none hover:text-foreground">
            How to find a feed URL
          </summary>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Look for an <strong>RSS</strong>, <strong>Feed</strong>, or
              orange RSS icon in the site&apos;s header or footer.
            </li>
            <li>
              Try common paths: <code>/rss</code>, <code>/feed</code>,{" "}
              <code>/atom.xml</code>, or <code>/index.xml</code>.
            </li>
            <li>
              If you can&apos;t find a feed link, paste the homepage URL — Feed
              scans the page for{" "}
              <code>&lt;link rel=&quot;alternate&quot;&gt;</code> tags.
            </li>
            <li>
              For YouTube channels, Reddit, Mastodon, and GitHub releases,
              most pages expose a hidden RSS endpoint — search the site name
              plus &quot;RSS&quot;.
            </li>
          </ul>
        </details>

        <div className="-mx-4 -mb-4 mt-2 flex items-center justify-end gap-2 border-t border-border/60 px-4 py-2 text-[11px] text-muted-foreground">
          <span className="cockpit-mono inline-flex items-center gap-1.5 uppercase tracking-[0.18em]">
            <KbdGroup>
              <Kbd>esc</Kbd>
            </KbdGroup>
            close
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

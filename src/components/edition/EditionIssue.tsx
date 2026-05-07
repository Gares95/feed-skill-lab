"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, Plus, RefreshCw, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ArticleWithFeed } from "@/components/articles/ArticleList";
import { composeIssue, dayOfYear, type ComposedIssue } from "./composeIssue";

interface EditionIssueProps {
  articles: ArticleWithFeed[];
  selectedArticleId: string | null;
  onSelectArticle: (articleId: string) => void;
  hasFeeds: boolean;
  onRefreshAll?: () => void;
  isRefreshing?: boolean;
}

export function EditionIssue({
  articles,
  selectedArticleId,
  onSelectArticle,
  hasFeeds,
  onRefreshAll,
  isRefreshing,
}: EditionIssueProps) {
  // Use a stable dayOfYear after hydration so the daily rotation matches the
  // user's local clock without producing SSR/CSR mismatch.
  const [doy, setDoy] = useState(0);
  useEffect(() => {
    setDoy(dayOfYear(new Date()));
  }, []);

  const issue = useMemo<ComposedIssue>(
    () => composeIssue(articles, { dayOfYear: doy }),
    [articles, doy],
  );

  if (!hasFeeds) {
    return <EditionEmpty kind="no-feeds" />;
  }
  if (!issue.cover) {
    return (
      <EditionEmpty
        kind="no-articles"
        onRefresh={onRefreshAll}
        isRefreshing={isRefreshing}
      />
    );
  }

  // Pattern E — low-volume day. When the dataset is too thin to populate
  // seconds + sections, render a calm cover-only edition with a colophon
  // instead of empty rules.
  const isLightEdition = articles.length <= 2;

  return (
    <article
      aria-label="Today edition front page"
      className="edition-issue edition-scroll mx-auto h-full w-full max-w-[1180px] overflow-y-auto px-6 lg:px-12 pb-24 pt-6"
    >
      <CoverStory
        article={issue.cover}
        isSelected={selectedArticleId === issue.cover.id}
        onSelect={onSelectArticle}
      />

      {issue.seconds.length > 0 && (
        <div
          className={cn(
            "mt-12 grid gap-8 border-t border-[color:var(--edition-rule)] pt-8",
            "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {issue.seconds.map((a) => (
            <StoryCard
              key={a.id}
              article={a}
              isSelected={selectedArticleId === a.id}
              onSelect={onSelectArticle}
              variant="second"
            />
          ))}
        </div>
      )}

      {issue.sections.map((s) => (
        <EditionSectionBlock
          key={s.feedTitle}
          feedTitle={s.feedTitle}
          items={s.items}
          selectedArticleId={selectedArticleId}
          onSelect={onSelectArticle}
        />
      ))}

      {issue.later.length > 0 && (
        <LaterTray
          items={issue.later}
          selectedArticleId={selectedArticleId}
          onSelect={onSelectArticle}
        />
      )}

      {isLightEdition && (
        <EditionColophon
          articleCount={articles.length}
          onRefresh={onRefreshAll}
          isRefreshing={isRefreshing}
        />
      )}
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */

function CoverStory({
  article,
  isSelected,
  onSelect,
}: {
  article: ArticleWithFeed;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <section aria-label="Cover story" className="pt-2">
      <div className="edition-eyebrow flex items-center gap-2">
        <span>Cover</span>
        <span aria-hidden="true">·</span>
        <span className="normal-case tracking-normal text-[color:var(--edition-ink-muted)] text-[0.7rem] font-medium">
          {article.feedTitle}
        </span>
        {article.isStarred && (
          <Star
            className="h-3 w-3 fill-[color:var(--edition-accent)] text-[color:var(--edition-accent)]"
            aria-label="Starred"
          />
        )}
      </div>
      <button
        type="button"
        onClick={() => onSelect(article.id)}
        aria-pressed={isSelected}
        className={cn(
          "group mt-3 block w-full text-left outline-none",
          "focus-visible:ring-2 focus-visible:ring-[color:var(--edition-accent)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--edition-paper)]",
        )}
      >
        <h1
          className={cn(
            "edition-display text-[length:var(--edition-display-cover)] font-semibold leading-[1.05] tracking-[-0.02em]",
            "text-balance text-[color:var(--edition-ink)] group-hover:text-[color:var(--edition-accent)] transition-colors",
            article.isRead && "text-[color:var(--edition-ink-muted)]",
          )}
        >
          {article.title}
        </h1>
      </button>
      <Dateline article={article} className="mt-4" />
    </section>
  );
}

function StoryCard({
  article,
  isSelected,
  onSelect,
  variant,
}: {
  article: ArticleWithFeed;
  isSelected: boolean;
  onSelect: (id: string) => void;
  variant: "second" | "section";
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(article.id)}
      aria-pressed={isSelected}
      className={cn(
        "group block w-full text-left outline-none",
        "border-t border-[color:var(--edition-rule)] pt-3",
        "focus-visible:ring-2 focus-visible:ring-[color:var(--edition-accent)]/60",
      )}
    >
      <div className="edition-eyebrow flex items-center gap-2">
        <span className="normal-case tracking-normal text-[0.7rem] font-medium text-[color:var(--edition-ink-muted)]">
          {article.feedTitle}
        </span>
        {article.isStarred && (
          <Star
            className="h-3 w-3 fill-[color:var(--edition-accent)] text-[color:var(--edition-accent)]"
            aria-label="Starred"
          />
        )}
      </div>
      <h2
        className={cn(
          "edition-display mt-2 font-semibold leading-[1.15] tracking-[-0.012em] text-balance",
          variant === "second"
            ? "text-[length:var(--edition-display-second)]"
            : "text-[1.1rem] md:text-[1.2rem]",
          "text-[color:var(--edition-ink)] group-hover:text-[color:var(--edition-accent)] transition-colors",
          article.isRead && "text-[color:var(--edition-ink-muted)]",
        )}
      >
        {article.title}
      </h2>
      <Dateline article={article} className="mt-2" compact />
    </button>
  );
}

function EditionSectionBlock({
  feedTitle,
  items,
  selectedArticleId,
  onSelect,
}: {
  feedTitle: string;
  items: ArticleWithFeed[];
  selectedArticleId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <section
      aria-label={`Section: ${feedTitle}`}
      className="mt-16 border-t-2 border-[color:var(--edition-rule-strong)] pt-6"
    >
      <header className="flex items-baseline justify-between gap-4">
        <h3 className="edition-eyebrow text-[0.78rem]">{feedTitle}</h3>
        <span className="edition-stamp text-[0.7rem] text-[color:var(--edition-ink-faint)]">
          {items.length} {items.length === 1 ? "story" : "stories"}
        </span>
      </header>
      <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <StoryCard
            key={a.id}
            article={a}
            isSelected={selectedArticleId === a.id}
            onSelect={onSelect}
            variant="section"
          />
        ))}
      </div>
    </section>
  );
}

function LaterTray({
  items,
  selectedArticleId,
  onSelect,
}: {
  items: ArticleWithFeed[];
  selectedArticleId: string | null;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const PEEK = 4;
  const visible = open ? items : items.slice(0, PEEK);
  const collapsible = items.length > PEEK;

  return (
    <section
      aria-label="Later"
      className="mt-16 border-t-2 border-[color:var(--edition-rule-strong)] pt-6"
    >
      <header className="flex items-baseline justify-between gap-4">
        <h3 className="edition-eyebrow text-[0.78rem]">Later</h3>
        <div className="flex items-baseline gap-3">
          <span className="edition-stamp text-[0.7rem] text-[color:var(--edition-ink-faint)]">
            {items.length}
          </span>
          {collapsible && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className={cn(
                "edition-eyebrow inline-flex items-center gap-1 text-[0.65rem]",
                "text-[color:var(--edition-ink-muted)] hover:text-[color:var(--edition-accent)]",
                "transition-colors outline-none rounded-sm",
                "focus-visible:ring-2 focus-visible:ring-[color:var(--edition-accent)]/60",
              )}
            >
              <span>{open ? "Collapse" : "Show all"}</span>
              <ChevronDown
                className={cn(
                  "h-3 w-3 transition-transform",
                  open && "rotate-180",
                )}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </header>
      <ul className="mt-3 divide-y divide-[color:var(--edition-rule)]">
        {visible.map((a) => (
          <li key={a.id}>
            <button
              type="button"
              onClick={() => onSelect(a.id)}
              aria-pressed={selectedArticleId === a.id}
              className={cn(
                "group flex w-full items-baseline gap-4 py-2.5 text-left outline-none",
                "focus-visible:ring-2 focus-visible:ring-[color:var(--edition-accent)]/60",
              )}
            >
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-[0.95rem] leading-snug",
                  "text-[color:var(--edition-ink)] group-hover:text-[color:var(--edition-accent)] transition-colors",
                  a.isRead && "text-[color:var(--edition-ink-muted)]",
                )}
              >
                {a.title}
              </span>
              <span className="edition-eyebrow shrink-0 normal-case tracking-normal text-[0.68rem] text-[color:var(--edition-ink-muted)]">
                {a.feedTitle}
              </span>
              <span className="edition-stamp shrink-0 text-[0.68rem] text-[color:var(--edition-ink-faint)] tabular-nums">
                <RelativeTime date={a.publishedAt} short />
              </span>
            </button>
          </li>
        ))}
      </ul>
      {collapsible && !open && (
        <p className="edition-stamp mt-3 text-[0.68rem] text-[color:var(--edition-ink-faint)]">
          {items.length - PEEK} more held back. Use “Show all” to recover them.
        </p>
      )}
    </section>
  );
}

function EditionColophon({
  articleCount,
  onRefresh,
  isRefreshing,
}: {
  articleCount: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}) {
  return (
    <section
      aria-label="Edition colophon"
      className="mt-16 border-t-2 border-[color:var(--edition-rule-strong)] pt-6"
    >
      <p className="edition-eyebrow text-[0.7rem]">Light edition</p>
      <p className="edition-dek mt-3">
        Only {articleCount === 1 ? "one story" : `${articleCount} stories`} crossed the desk today.
        A short edition is still an edition.
      </p>
      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className={cn(
            "edition-eyebrow mt-5 inline-flex items-center gap-2 text-[0.7rem]",
            "text-[color:var(--edition-ink-muted)] hover:text-[color:var(--edition-accent)]",
            "transition-colors outline-none rounded-sm",
            "focus-visible:ring-2 focus-visible:ring-[color:var(--edition-accent)]/60",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          <RefreshCw
            className={cn("h-3 w-3", isRefreshing && "animate-spin")}
            aria-hidden="true"
          />
          <span>{isRefreshing ? "Refreshing sources" : "Refresh sources"}</span>
        </button>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */

function Dateline({
  article,
  className,
  compact,
}: {
  article: ArticleWithFeed;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "edition-stamp flex items-center gap-2 text-[color:var(--edition-ink-muted)]",
        compact ? "text-[0.68rem]" : "text-[0.78rem]",
        className,
      )}
    >
      {!compact && (
        <>
          <span>{article.feedTitle}</span>
          <span aria-hidden="true">·</span>
        </>
      )}
      <RelativeTime date={article.publishedAt} />
    </div>
  );
}

function RelativeTime({ date, short }: { date: Date; short?: boolean }) {
  const [label, setLabel] = useState<string>("");
  useEffect(() => {
    const d = date instanceof Date ? date : new Date(date);
    const full = formatDistanceToNow(d, { addSuffix: true });
    setLabel(short ? full.replace("about ", "") : full);
  }, [date, short]);
  return (
    <time
      dateTime={(date instanceof Date ? date : new Date(date)).toISOString()}
      suppressHydrationWarning
    >
      {label || " "}
    </time>
  );
}

function EditionEmpty({
  kind,
  onRefresh,
  isRefreshing,
}: {
  kind: "no-feeds" | "no-articles";
  onRefresh?: () => void;
  isRefreshing?: boolean;
}) {
  if (kind === "no-feeds") {
    return (
      <div className="edition-issue edition-scroll flex h-full w-full items-center justify-center overflow-y-auto px-6 pb-24 pt-6">
        <div className="w-full max-w-[560px]">
          <div className="border-t-2 border-[color:var(--edition-rule-strong)] pt-5">
            <p className="edition-eyebrow text-[0.7rem]">Vol. I · No. 1</p>
            <h2 className="edition-display mt-3 text-[length:var(--edition-display-cover)] font-semibold leading-[1.05] tracking-[-0.02em] text-balance text-[color:var(--edition-ink)]">
              Your edition starts with a feed.
            </h2>
            <p className="edition-dek mt-5">
              Today Edition composes a finite, deterministic issue from the
              sources you trust. Add your first feed and tomorrow’s front page
              writes itself.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/settings"
                className={cn(
                  "edition-eyebrow inline-flex items-center gap-2 text-[0.72rem]",
                  "text-[color:var(--edition-accent)] hover:text-[color:var(--edition-accent-strong)]",
                  "transition-colors outline-none rounded-sm",
                  "focus-visible:ring-2 focus-visible:ring-[color:var(--edition-accent)]/60",
                )}
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Add your first feed</span>
              </Link>
              <span className="edition-stamp text-[0.68rem] text-[color:var(--edition-ink-faint)]">
                or press ⌘K to open the palette
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // no-articles — finished edition reward
  return (
    <div className="edition-issue edition-scroll flex h-full w-full items-center justify-center overflow-y-auto px-6 pb-24 pt-6">
      <div className="w-full max-w-[560px]">
        <div className="border-t-2 border-[color:var(--edition-rule-strong)] pt-5">
          <p className="edition-eyebrow text-[0.7rem]">— Finis —</p>
          <h2 className="edition-display mt-3 text-[length:var(--edition-display-cover)] font-semibold leading-[1.05] tracking-[-0.02em] text-balance text-[color:var(--edition-ink)]">
            You&rsquo;ve finished today&rsquo;s edition.
          </h2>
          <p className="edition-dek mt-5">
            Nothing more to read here. The next issue arrives when your
            sources publish — refresh to check, or come back tomorrow for a
            new front page.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={isRefreshing}
                className={cn(
                  "edition-eyebrow inline-flex items-center gap-2 text-[0.72rem]",
                  "text-[color:var(--edition-accent)] hover:text-[color:var(--edition-accent-strong)]",
                  "transition-colors outline-none rounded-sm",
                  "focus-visible:ring-2 focus-visible:ring-[color:var(--edition-accent)]/60",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                )}
              >
                <RefreshCw
                  className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")}
                  aria-hidden="true"
                />
                <span>
                  {isRefreshing ? "Refreshing sources" : "Refresh sources"}
                </span>
              </button>
            )}
            <Link
              href="/settings"
              className="edition-stamp text-[0.68rem] text-[color:var(--edition-ink-faint)] hover:text-[color:var(--edition-ink-muted)] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--edition-accent)]/60 rounded-sm"
            >
              Manage feeds →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
